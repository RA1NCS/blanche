import { Course, Assignment } from '@/lib/interfaces';
import { useEffect } from 'react';

interface CourseModalProps {
	isModalOpen: boolean;
	selectedCourse: Course | null;
	assignments: Assignment[];
	onClose: () => void;
}

export default function CourseModal({ isModalOpen, selectedCourse, assignments, onClose }: CourseModalProps) {
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
					isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			></div>

			{/* Modal */}
			<div
				className={`fixed inset-y-0 right-0 z-50 w-full max-w-[97%] rounded-s-2xl bg-white shadow-xl transform transition-transform duration-500 ease-in-out ${
					isModalOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className="relative h-full">
					<button
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 text-4xl"
						onClick={onClose}
					>
						&times;
					</button>
					<div className="p-8 h-full overflow-y-auto">
						<h2 className="text-3xl font-bold mb-4">
							{selectedCourse.course_code}
						</h2>
						<h3 className="text-xl font-semibold mb-4">
							{selectedCourse.course_name}
						</h3>
						<p className="text-lg mb-4">{selectedCourse.course_description}</p>

						{/* Assignments Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{assignments.map((assignment) => (
								<div
									key={assignment.assignment_id}
									className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition"
									onClick={() =>
										console.log(
											'Assignment clicked:',
											assignment
										)
									}
								>
									<h3 className="text-xl font-semibold mb-2">
										{assignment.title}
									</h3>
									<p className="text-gray-700 mb-2">
										{assignment.description}
									</p>
									<p className="text-gray-500 text-sm">
										Due:{' '}
										{new Date(
											assignment.due_date
										).toLocaleDateString()}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
