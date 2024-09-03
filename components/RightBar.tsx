'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@clerk/nextjs';
import { Assignment } from '@/lib/interfaces';

interface RightBarProps {
	isVisible: boolean;
	setIsVisible: (visible: boolean) => void;
	courseName?: string;
	courseCode?: string;
	assignments?: Assignment[];
	allAssignments?: { [course: string]: Assignment[] };
	onAssignmentClick: (assignment: Assignment) => void;
	onEditAssignment: (assignment: Assignment) => void;
	onCreateAssignment: () => void;
}

export default function RightBar({
	isVisible,
	setIsVisible,
	courseName = '',
	courseCode = '',
	assignments = [],
	allAssignments = {},
	onAssignmentClick,
	onCreateAssignment,
	onEditAssignment,
}: RightBarProps) {
	const { user } = useUser();
	const isProfessor = user?.unsafeMetadata?.role === 'professor';

	const renderAssignments = () => {
		// Filter out courses with no assignments
		const filteredCourses = Object.keys(allAssignments).filter(
			(course) => allAssignments[course].length > 0
		);

		if (courseName && assignments.length > 0) {
			return (
				<>
					<div className="p-4 overflow-y-auto">
						{assignments.map((assignment, index) => (
							<div
								key={index}
								className="relative mb-4"
							>
								<div
									className="p-2 bg-gray-100 rounded-lg cursor-pointer"
									onClick={() => onAssignmentClick(assignment)}
								>
									<h4 className="text-sm font-semibold">
										{assignment.title}
									</h4>
									<p className="text-xs text-gray-500">
										Due:{' '}
										{new Date(
											assignment.due_date
										).toLocaleDateString()}
									</p>
								</div>
								{isProfessor && (
									<button
										className="absolute -top-4 right-0 bg-white rounded-full p-1 border hover:bg-gray-50"
										onClick={() =>
											onEditAssignment(assignment)
										}
									>
										<FontAwesomeIcon icon={faPencilAlt} />
									</button>
								)}
							</div>
						))}
						{isProfessor && (
							<>
								<hr className="mt-2 mb-4" />
								<div
									className="p-2 w-20 mx-auto mb-2 bg-gray-100 rounded-2xl cursor-pointer text-center text-black"
									onClick={onCreateAssignment}
								>
									+
								</div>
							</>
						)}
					</div>
				</>
			);
		} else if (filteredCourses.length > 0) {
			return (
				<div className="p-4 overflow-y-auto">
					{filteredCourses.map((course) => (
						<div
							key={course}
							className="mb-4"
						>
							<h3 className="pl-2 text-lg font-semibold mb-2">{course}</h3>
							{allAssignments[course].map((assignment, index) => (
								<div
									key={index}
									className="p-2 ml-1 mr-4 mb-2 bg-gray-100 rounded-lg cursor-pointer"
									onClick={() => onAssignmentClick(assignment)}
								>
									<h4 className="text-sm font-semibold">
										{assignment.title}
									</h4>
									<p className="text-xs text-gray-500">
										Due:{' '}
										{new Date(
											assignment.due_date
										).toLocaleDateString()}
									</p>
								</div>
							))}
							<hr className="w-[80%] ml-2 my-4" />
						</div>
					))}
				</div>
			);
		} else {
			return <p className="text-gray-500 text-center">No assignments available.</p>;
		}
	};

	return (
		<>
			<div
				className={`fixed inset-y-0 right-0 z-50 bg-gray-50 transform transition-transform duration-500 ease-in-out ${
					isVisible ? 'translate-x-0' : 'translate-x-full'
				} w-64`}
			>
				<h3 className="font-semibold text-3xl p-8 text-drexel-blue">Assignments</h3>
				<hr />
				{renderAssignments()}
			</div>

			<button
				onClick={() => setIsVisible(!isVisible)}
				className={`fixed top-1/2 transform transition-all -translate-y-1/2 duration-500 ease-in-out bg-gray-200 hover:bg-gray-300 p-2 rounded-l-lg z-50 ${
					isVisible ? 'right-64' : 'right-0'
				}`}
			>
				<FontAwesomeIcon
					icon={faChevronLeft}
					className={`w-4 h-4 transition-transform duration-500 ease-in-out text-drexel-blue ${
						isVisible ? '' : 'rotate-180'
					}`}
				/>
			</button>
		</>
	);
}
