import { Course, Assignment } from '@/lib/interfaces';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface CourseModalProps {
	isModalOpen: boolean;
	selectedCourse: Course | null;
	selectedAssignment: Assignment | null;
	onClose: () => void;
	onBackToCourse: () => void;
}

export default function CourseModal({
	isModalOpen,
	selectedCourse,
	selectedAssignment,
	onClose,
	onBackToCourse,
}: CourseModalProps) {
	// Handle body scroll lock when modal is open
	useEffect(() => {
		if (isModalOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}, [isModalOpen]);

	if (!isModalOpen || !selectedCourse) return null;

	return (
		<>
			{/* Background overlay */}
			<div
				className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out ${
					isModalOpen
						? 'opacity-100'
						: 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			></div>

			{/* Modal */}
			<div
				className={`fixed inset-y-0 right-0 z-50 w-full max-w-[97%] rounded-s-2xl bg-white shadow-xl transform transition-transform duration-500 ease-in-out ${
					isModalOpen
						? 'translate-x-0'
						: 'translate-x-full'
				}`}
			>
				<div className="relative h-full flex">
					{/* Vertical Course Code Bar */}
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

					{/* Content Area */}
					<div className="flex-1 p-8 overflow-y-auto">
						<button
							className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 z-10 text-lg"
							onClick={onClose}
						>
							<FontAwesomeIcon
								icon={faTimes}
							/>
						</button>

						{selectedAssignment ? (
							<div
								className="transition-transform duration-500 ml-8 mt-8 ease-in-out transform flex flex-col justify-between h-full"
								style={{
									transform: 'translateX(0)',
								}}
							>
								<div>
									<h2 className="text-3xl font-bold mb-4">
										{
											selectedAssignment.title
										}
									</h2>
									<h3 className="text-xl font-semibold mb-4">
										{
											selectedCourse.course_name
										}
									</h3>
									<p className="text-lg mb-4">
										{
											selectedAssignment.description
										}
									</p>
									<p className="text-lg mb-4 text-gray-700">
										Due:{' '}
										{new Date(
											selectedAssignment.due_date
										).toLocaleDateString()}
									</p>
								</div>

								{/* Back to Course Overview Button */}
								<div className="mt-auto mb-10">
									<button
										className="text-drexel-blue transition-all hover:text-blue-700"
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
								</div>
							</div>
						) : (
							<div className="flex justify-center items-center h-full text-2xl text-gray-500">
								No assignment open
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
