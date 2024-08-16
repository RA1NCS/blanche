import { Assignment, Course } from '@/lib/interfaces';

interface AssignmentsModalProps {
	isOpen: boolean;
	onClose: () => void;
	course: Course | null;
	assignments: Assignment[];
}

export default function assignments({
	isOpen,
	onClose,
	course,
	assignments,
}: AssignmentsModalProps) {
	if (!isOpen || !course) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white rounded-lg p-6 w-11/12 max-w-3xl relative transform transition-all duration-300 ease-in-out scale-100 opacity-100">
				<button
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
					onClick={onClose}
				>
					&times;
				</button>
				<h2 className="text-3xl font-bold mb-4">{course.course_name}</h2>
				<p className="text-lg mb-4">{course.course_description}</p>

				{/* Assignments Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{assignments.map((assignment) => (
						<div
							key={assignment.assignment_id}
							className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition"
							onClick={() => console.log('Assignment clicked:', assignment)}
						>
							<h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
							<p className="text-gray-700 mb-2">{assignment.description}</p>
							<p className="text-gray-500 text-sm">
								Due: {new Date(assignment.due_date).toLocaleDateString()}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
