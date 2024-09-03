import { Course, Assignment } from '@/lib/interfaces';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTimes,
	faUpload,
	faTrashAlt,
	faPencilAlt,
	faSave,
} from '@fortawesome/free-solid-svg-icons';

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
	const [title, setTitle] = useState<string>(selectedAssignment?.title || '');
	const [description, setDescription] = useState<string>(
		selectedAssignment?.description || ''
	);
	const [dueDate, setDueDate] = useState<string>(
		selectedAssignment?.due_date || ''
	);

	useEffect(() => {
		if (selectedAssignment) {
			setTitle(selectedAssignment.title);
			setDescription(selectedAssignment.description);
			setDueDate(selectedAssignment.due_date);
		} else if (editMode) {
			setTitle(''); // Reset title for new assignment creation
			setDescription(''); // Reset description for new assignment creation
			setDueDate(''); // Reset due date for new assignment creation
		}
	}, [selectedAssignment, editMode]);

	const handleSave = () => {
		if (selectedAssignment) {
			const updatedAssignment = {
				...selectedAssignment,
				title,
				description,
				due_date: dueDate,
			};
			onEditAssignment(updatedAssignment);
		} else if (editMode && !selectedAssignment) {
			const newAssignment = {
				assignment_id: Date.now(), // Temporary ID, replace with actual ID from DB
				course_id: selectedCourse!.course_id,
				title,
				description,
				due_date: dueDate || new Date().toISOString(), // Placeholder due date, allow editing later
			};
			onCreateAssignment(newAssignment);
		}
		setEditMode(false);
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

					<div className="flex-1 flex">
						<div className="w-1/2 p-8 overflow-y-auto border-r border-gray-300 flex flex-col justify-between">
							<button
								className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 z-10 text-lg"
								onClick={onClose}
							>
								<FontAwesomeIcon
									icon={
										faTimes
									}
								/>
							</button>

							<div>
								{editMode ? (
									<>
										<input
											type="text"
											value={
												title
											}
											onChange={(
												e
											) =>
												setTitle(
													e
														.target
														.value
												)
											}
											className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-drexel-blue text-6xl font-bold text-gray-700 bg-transparent"
											placeholder="Enter title..."
										/>
										<textarea
											value={
												description
											}
											onChange={(
												e
											) =>
												setDescription(
													e
														.target
														.value
												)
											}
											className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-drexel-blue text-lg text-gray-700 bg-transparent mt-4"
											rows={
												6
											}
											placeholder="Enter description..."
										/>
									</>
								) : (
									<>
										<h2 className="text-6xl font-bold mb-6">
											{
												title
											}
										</h2>
										<p className="mt-2 text-lg mb-4">
											{
												description
											}
										</p>
									</>
								)}
							</div>

							<div className="flex justify-between items-center mt-auto">
								{editMode ? (
									<input
										type="date"
										value={
											dueDate
												? dueDate.split(
														'T'
												  )[0]
												: ''
										}
										onChange={(
											e
										) =>
											setDueDate(
												e
													.target
													.value
											)
										}
										className="text-lg text-gray-700 focus:outline-none bg-transparent"
									/>
								) : (
									<p className="text-lg text-gray-600">
										Due:{' '}
										{dueDate
											? new Date(
													dueDate
											  ).toLocaleDateString()
											: 'No due date available'}
									</p>
								)}
								<button
									className="text-drexel-blue text-xl transition-all hover:text-blue-700"
									onClick={
										onBackToCourse
									}
								>
									&larr; Back
									to Course
									Overview
								</button>
							</div>
						</div>

						<div className="w-1/2 p-8 pt-0 overflow-y-auto h-full flex flex-col">
							<div className="mt-8">
								<div className="flex justify-start bottom-7 absolute">
									{editMode ? (
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
									)}
									{selectedAssignment && (
										<button
											onClick={
												onDeleteAssignment
											}
											className="text-red-500 text-lg transition-all hover:text-red-700 border w-12 h-12 p-2 bg-gray-100 hover:bg-gray-50 border-gray-800 rounded-full"
										>
											<FontAwesomeIcon
												icon={
													faTrashAlt
												}
											/>
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
