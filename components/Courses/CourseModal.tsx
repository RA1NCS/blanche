import { Course, Assignment } from '@/lib/interfaces';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload, faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

interface CourseModalProps {
	isModalOpen: boolean;
	selectedCourse: Course | null;
	selectedAssignment: Assignment | null;
	onClose: () => void;
	onBackToCourse: () => void;
	onEditAssignment: () => void;
	onDeleteAssignment: () => void; // To trigger deletion
}

export default function CourseModal({
	isModalOpen,
	selectedCourse,
	selectedAssignment,
	onClose,
	onBackToCourse,
	onEditAssignment,
	onDeleteAssignment,
}: CourseModalProps) {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);
	const [textSubmission, setTextSubmission] = useState<string>('');
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	useEffect(() => {
		if (isModalOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}, [isModalOpen]);

	useEffect(() => {
		async function checkSubmission() {
			if (selectedAssignment) {
				try {
					const response = await fetch(
						`/api/assignments/${selectedAssignment.assignment_id}/submissions/check`
					);
					const data = await response.json();
					setHasSubmitted(data.hasSubmitted);
				} catch (error) {
					console.error('Error fetching submission status:', error);
				}
			}
		}

		if (selectedAssignment) {
			checkSubmission();
		}
	}, [selectedAssignment]);

	if (!isModalOpen || !selectedCourse) return null;

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
			formData.append('assignmentId', selectedAssignment?.assignment_id.toString() || '');
			formData.append('submissionText', textSubmission);

			try {
				const response = await fetch('/api/assignments/upload', {
					method: 'POST',
					body: formData,
				});

				const result = await response.json();

				if (response.ok) {
					setUploadStatus('Submission successful');
					setHasSubmitted(true);
				} else {
					setUploadStatus(result.error || 'Failed to submit');
				}
			} catch (error) {
				console.error('Error uploading files:', error);
				setUploadStatus('Error uploading files');
			}
		}
	};

	const handleDeleteFile = (fileIndex: number) => {
		setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));
	};

	return (
		<>
			<div
				className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out ${
					isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			></div>

			<div
				className={`fixed inset-y-0 right-0 z-50 w-full max-w-[97%] rounded-s-2xl bg-white shadow-xl transform transition-transform duration-500 ease-in-out ${
					isModalOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className="relative h-full flex">
					<div className="bg-gray-200 w-48 rounded rounded-e-3xl flex flex-col justify-center items-center">
						<div className="text-8xl font-bold font-futura-condensed-medium text-gray-400">
							{selectedCourse.course_code.split('').map((char, index) => (
								<div
									key={index}
									className="leading-none mt-4"
								>
									{char}
								</div>
							))}
						</div>
					</div>

					{selectedAssignment ? (
						<div className="flex-1 flex">
							<div className="w-1/2 p-8 overflow-y-auto border-r border-gray-300 flex flex-col justify-between">
								<button
									className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 z-10 text-lg"
									onClick={onClose}
								>
									<FontAwesomeIcon icon={faTimes} />
								</button>

								<div>
									<h2 className="text-6xl font-bold mb-6">
										{selectedAssignment?.title}
									</h2>
									<p className="mt-2 text-lg mb-4">
										{selectedAssignment?.description}
									</p>
								</div>

								<div className="flex justify-between items-center mt-auto">
									<button
										className="text-drexel-blue text-xl transition-all hover:text-blue-700"
										onClick={onBackToCourse}
									>
										&larr; Back to Course Overview
									</button>
									<p className="text-lg text-gray-600">
										Due:{' '}
										{selectedAssignment?.due_date
											? new Date(
													selectedAssignment.due_date
											  ).toLocaleDateString()
											: 'No due date available'}
									</p>
								</div>
							</div>

							<div className="w-1/2 p-8 pt-0 overflow-y-auto h-full flex flex-col">
								<div className="mt-8">
									<h1 className="text-6xl font-bold mb-4">
										Your Submission
									</h1>

									{!hasSubmitted ? (
										<>
											<textarea
												className="w-full max-w-xl p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
												placeholder="Type your submission here..."
												value={textSubmission}
												onChange={(e) =>
													setTextSubmission(
														e.target
															.value
													)
												}
												rows={4}
												style={{
													overflowY: 'hidden',
												}}
												onInput={(e) => {
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
													Upload Files
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
											You have submitted this
											assignment.
										</p>
									)}

									{uploadStatus && (
										<p className="mt-2 ml-2 text-sm text-gray-500">
											{uploadStatus !==
												'Submission successful' && (
												<span className="text-red-500">
													Error:{' '}
													{uploadStatus}
												</span>
											)}
										</p>
									)}

									<div className="flex justify-start bottom-7 absolute">
										<button
											onClick={onEditAssignment}
											className="text-drexel-blue text-lg transition-all hover:text-blue-700 mr-4 border w-12 py-2 bg-gray-100 hover:bg-gray-50 border-gray-800 rounded-3xl"
										>
											<FontAwesomeIcon
												icon={faPencilAlt}
											/>{' '}
										</button>
										<button
											onClick={onDeleteAssignment}
											className="text-red-500 text-lg transition-all hover:text-red-700 border w-12 py-2 bg-gray-100 hover:bg-gray-50 border-gray-800 rounded-3xl"
										>
											<FontAwesomeIcon
												icon={faTrashAlt}
											/>{' '}
										</button>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="flex-1 flex flex-col justify-center items-center text-center">
							<h2 className="text-6xl font-bold">
								{selectedCourse.course_code}
							</h2>
							<p className="text-2xl text-gray-600 mt-4">
								{selectedCourse.course_name}
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
