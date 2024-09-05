import { Course, Assignment } from '@/lib/interfaces';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTimes,
	faUpload,
	faTrashAlt,
	faPencilAlt,
	faSave,
	faEye,
	faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@clerk/nextjs';

interface CourseModalProps {
	isModalOpen: boolean;
	selectedCourse: Course | null;
	selectedAssignment: Assignment | null;
	onClose: () => void;
	onBackToCourse: () => void;
	onEditAssignment: (updatedAssignment: Assignment) => void;
	onDeleteAssignment: () => void;
	onCreateAssignment: (newAssignment: Assignment) => void;
	editMode: boolean;
	setEditMode: (mode: boolean) => void;
}

export default function CourseModal({
	isModalOpen,
	selectedCourse,
	selectedAssignment,
	onClose,
	onBackToCourse,
	onEditAssignment,
	onDeleteAssignment,
	onCreateAssignment,
	editMode,
	setEditMode,
}: CourseModalProps) {
	const { user } = useUser();
	const isProfessor = user?.unsafeMetadata?.role === 'professor';

	const [title, setTitle] = useState<string>(selectedAssignment?.title || '');
	const [description, setDescription] = useState<string>(
		selectedAssignment?.description || ''
	);
	const [dueDate, setDueDate] = useState<string>(
		selectedAssignment?.due_date || ''
	);
	const [isPrivate, setIsPrivate] = useState<boolean>(
		selectedAssignment?.private || false
	);
	const [textSubmission, setTextSubmission] = useState<string>('');
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	useEffect(() => {
		if (selectedAssignment) {
			setTitle(selectedAssignment.title);
			setDescription(selectedAssignment.description);
			setDueDate(selectedAssignment.due_date);
			setIsPrivate(selectedAssignment.private || false);
			checkSubmission();
		} else if (editMode) {
			// Clear fields for new assignment
			setTitle('');
			setDescription('');
			setDueDate('');
			setIsPrivate(false); // Default to public for new assignments
		}
	}, [selectedAssignment, editMode]);

	const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

	const handleSave = () => {
		if (editMode && selectedAssignment) {
			const updatedAssignment = {
				...selectedAssignment,
				title,
				description,
				due_date: dueDate,
				private: isPrivate,
			};
			onEditAssignment(updatedAssignment);
		} else if (editMode && !selectedAssignment) {
			const newAssignment: Assignment = {
				assignment_id: Date.now(), // Temporary ID, this will be replaced by the backend
				course_id: selectedCourse?.course_id || 0,
				title,
				description,
				due_date: dueDate,
				private: isPrivate,
			};
			onCreateAssignment(newAssignment);
		}
		setEditMode(false);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setDescription(e.target.value);
	};

	const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDueDate(e.target.value);
	};

	const togglePrivate = () => {
		setIsPrivate(!isPrivate);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
		setUploadStatus(null);
	};

	const handleUpload = async () => {
		if (selectedFiles.length > 0 || textSubmission.trim() !== '') {
			const formData = new FormData();
			selectedFiles.forEach((file) => {
				formData.append('file', file);
			});
			formData.append(
				'assignmentId',
				selectedAssignment?.assignment_id.toString() || ''
			);
			formData.append('submissionText', textSubmission);

			try {
				const response = await fetch(
					'/api/assignments/upload',
					{
						method: 'POST',
						body: formData,
					}
				);

				const result = await response.json();

				if (response.ok) {
					setUploadStatus('Submission successful');
					setHasSubmitted(true);
				} else {
					setUploadStatus(
						result.error || 'Failed to submit'
					);
				}
			} catch (error) {
				console.error('Error uploading files:', error);
				setUploadStatus('Error uploading files');
			}
		} else {
			setUploadStatus('Please provide a submission.');
		}
	};

	const handleDeleteFile = (fileIndex: number) => {
		setSelectedFiles((prevFiles) =>
			prevFiles.filter((_, index) => index !== fileIndex)
		);
	};

	const checkSubmission = async () => {
		if (selectedAssignment) {
			try {
				const response = await fetch(
					`/api/assignments/${selectedAssignment.assignment_id}/submissions/check`
				);
				const data = await response.json();
				setHasSubmitted(data.hasSubmitted);
			} catch (error) {
				console.error(
					'Error fetching submission status:',
					error
				);
			}
		}
	};

	if (!isModalOpen || !selectedCourse) return null;

	return (
		<>
			<div
				className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out ${
					isModalOpen
						? 'opacity-100'
						: 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			></div>

			<div
				className={`fixed inset-y-0 right-0 z-50 w-full max-w-[97%] rounded-s-2xl bg-white shadow-xl transform transition-transform duration-500 ease-in-out ${
					isModalOpen
						? 'translate-x-0'
						: 'translate-x-full'
				}`}
			>
				<div className="relative h-full flex">
					<div className="bg-gray-200 w-48 rounded rounded-e-3xl flex flex-col justify-center items-center">
						<div className="text-8xl font-bold font-futura-condensed-medium text-gray-400">
							{selectedCourse.course_code
								.split('')
								.map(
									(
										char,
										index
									) => (
										<div
											key={
												index
											}
											className="leading-none mt-4"
										>
											{
												char
											}
										</div>
									)
								)}
						</div>
					</div>

					{selectedAssignment || editMode ? (
						<div className="flex-1 flex">
							<div className="w-1/2 p-8 overflow-y-auto border-r border-gray-300 flex flex-col justify-between">
								<button
									className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 z-10 text-lg"
									onClick={
										onClose
									}
								>
									<FontAwesomeIcon
										icon={
											faTimes
										}
									/>
								</button>

								<div>
									{!editMode ? (
										<>
											<h2 className="text-6xl font-bold mb-6">
												{
													selectedAssignment?.title
												}
											</h2>
											<div className="mt-2 text-lg mb-4 whitespace-pre-wrap">
												{
													selectedAssignment?.description
												}
											</div>
										</>
									) : (
										<>
											<input
												type="text"
												value={
													title
												}
												onChange={
													handleTitleChange
												}
												className="w-full mb-4 p-2 border-b border-gray-300 focus:outline-none focus:border-drexel-blue text-6xl font-bold text-gray-700"
												placeholder="Enter title..."
											/>
											<textarea
												value={
													description
												}
												onChange={
													handleDescriptionChange
												}
												onInput={(
													e
												) => {
													const target =
														e.target as HTMLTextAreaElement;
													target.style.height =
														'auto';
													target.style.height = `${target.scrollHeight}px`;
												}}
												className="w-full resize-none p-2 border-b border-gray-300 focus:outline-none focus:border-drexel-blue text-lg text-gray-700 mt-4 overflow-hidden"
												placeholder="Enter description..."
											/>
										</>
									)}
								</div>

								<div className="flex justify-between items-center mt-auto">
									<button
										className="text-drexel-blue text-xl transition-all hover:text-blue-700"
										onClick={
											onBackToCourse
										}
									>
										&larr;
										Back
										to
										Course
										Overview
									</button>
									{!editMode && (
										<p className="text-lg text-gray-600">
											Due:{' '}
											{selectedAssignment?.due_date
												? new Date(
														selectedAssignment.due_date
												  ).toLocaleDateString()
												: 'No due date available'}
										</p>
									)}
									{editMode && (
										<div className="bottom-8 right-8">
											<input
												type="date"
												value={
													dueDate.split(
														'T'
													)[0]
												}
												onChange={
													handleDueDateChange
												}
												className="p-2 focus:outline-none focus:border-drexel-blue text-lg text-gray-700 bg-gray-50 border border-gray-300 rounded-lg"
												min={
													today
												}
											/>
										</div>
									)}
								</div>
							</div>

							<div className="w-1/2 p-8 pt-0 overflow-y-auto h-full flex flex-col">
								<div className="mt-8">
									<div className="flex justify-start bottom-7 absolute">
										{isProfessor &&
										editMode ? (
											<>
												<button
													onClick={
														handleSave
													}
													className="text-green-500 text-lg transition-all hover:text-green-700 mr-4 border w-12 h-12 p-2 bg-gray-100 hover:bg-gray-50 border-gray-800 rounded-full"
												>
													<FontAwesomeIcon
														icon={
															faSave
														}
													/>
												</button>
												<button
													onClick={() =>
														setEditMode(
															false
														)
													}
													className="text-gray-500 text-lg transition-all hover:text-gray-700 mr-4 border w-28 h-12 p-2 bg-gray-100 hover:bg-gray-50 border-gray-800 rounded-full"
												>
													Discard
												</button>
											</>
										) : (
											isProfessor && (
												<button
													onClick={() =>
														setEditMode(
															true
														)
													}
													className="text-drexel-blue text-lg transition-all hover:text-drexel-blue-darker mr-4 border w-12 h-12 p-2 bg-gray-100 hover:bg-gray-50 border-gray-800 rounded-full"
												>
													<FontAwesomeIcon
														icon={
															faPencilAlt
														}
													/>
												</button>
											)
										)}
										{selectedAssignment &&
											isProfessor && (
												<button
													onClick={
														onDeleteAssignment
													}
													className="text-red-500 text-lg transition-all hover:text-red-700 border mr-4 w-12 h-12 p-2 bg-gray-100 hover:bg-gray-50 border-gray-800 rounded-full"
												>
													<FontAwesomeIcon
														icon={
															faTrashAlt
														}
													/>
												</button>
											)}
										{isProfessor &&
											editMode && (
												<button
													onClick={
														togglePrivate
													}
													className="text-gray-500 text-lg transition-all hover:text-gray-700 border h-12 p-2 px-4 bg-gray-100 hover:bg-gray-50 border-gray-800 rounded-full flex items-center"
												>
													<FontAwesomeIcon
														icon={
															isPrivate
																? faEyeSlash
																: faEye
														}
													/>
													<span className="ml-2">
														{isPrivate
															? 'Hidden'
															: 'Visible'}
													</span>
												</button>
											)}
									</div>

									{!isProfessor &&
										!editMode && (
											<>
												<h1 className="text-6xl font-bold mb-4">
													Your
													Submission
												</h1>

												{!hasSubmitted ? (
													<>
														<textarea
															className="w-full max-w-xl p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
															placeholder="Type your submission here..."
															value={
																textSubmission
															}
															onChange={(
																e
															) =>
																setTextSubmission(
																	e
																		.target
																		.value
																)
															}
															rows={
																4
															}
															style={{
																overflowY: 'hidden',
															}}
															onInput={(
																e
															) => {
																const target =
																	e.target as HTMLTextAreaElement;
																target.style.height =
																	'auto';
																target.style.height = `${target.scrollHeight}px`;
															}}
														></textarea>

														<div className="flex flex-col space-y-2 mt-4">
															{selectedFiles.map(
																(
																	file,
																	index
																) => (
																	<div
																		key={
																			index
																		}
																		className="flex items-center justify-between w-full max-w-xl px-4 py-2 border border-gray-300 rounded-full bg-gray-200"
																	>
																		<span className="text-gray-700 truncate">
																			{
																				file.name
																			}
																		</span>
																		<button
																			className="text-red-600 hover:text-red-800 transition-all hover:bg-gray-300 hover:rounded-full p-2 py-0"
																			onClick={() =>
																				handleDeleteFile(
																					index
																				)
																			}
																		>
																			<FontAwesomeIcon
																				icon={
																					faTrashAlt
																				}
																				className="py-3 px-1 flex justify-center align-middle"
																			/>
																		</button>
																	</div>
																)
															)}
														</div>

														<div className="flex items-center space-x-4 mt-4">
															<label className="relative cursor-pointer px-4 py-3 hover:bg-gray-300 transition-all ease-in-out duration-500 rounded-full flex items-center justify-center bg-gray-100 border border-gray-300">
																Upload
																Files
																<FontAwesomeIcon
																	icon={
																		faUpload
																	}
																	className="ml-3 text-gray-600"
																/>
																<input
																	type="file"
																	onChange={
																		handleFileChange
																	}
																	className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
																	multiple
																/>
															</label>
															{(selectedFiles.length >
																0 ||
																textSubmission.trim() !==
																	'') && (
																<button
																	onClick={
																		handleUpload
																	}
																	className="bg-drexel-blue text-white px-4 py-3 rounded-full shadow hover:bg-drexel-blue-darker transition"
																>
																	Submit
																</button>
															)}
														</div>
													</>
												) : (
													<p className="text-xl text-green-600">
														You
														have
														submitted
														this
														assignment.
													</p>
												)}

												{uploadStatus && (
													<p className="mt-2 ml-2 text-sm text-gray-500">
														{uploadStatus !==
															'Submission successful' && (
															<span className="text-red-500">
																Error:{' '}
																{
																	uploadStatus
																}
															</span>
														)}
													</p>
												)}
											</>
										)}
								</div>
							</div>
						</div>
					) : (
						<div className="flex-1 flex flex-col justify-center items-center text-center">
							<h2 className="text-6xl font-bold">
								{
									selectedCourse?.course_code
								}
							</h2>
							<p className="text-2xl text-gray-600 mt-4">
								{
									selectedCourse?.course_name
								}
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
