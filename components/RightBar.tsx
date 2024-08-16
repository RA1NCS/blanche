'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface AssignmentDisplay {
	title: string;
	dueDate: string;
}

interface RightBarProps {
	isVisible: boolean;
	setIsVisible: (visible: boolean) => void;
	courseName?: string;
	courseCode?: string;
	assignments?: AssignmentDisplay[];
	allAssignments?: { [course: string]: AssignmentDisplay[] };
}

export default function RightBar({
	isVisible,
	setIsVisible,
	courseName = '',
	courseCode = '',
	assignments = [],
	allAssignments = {},
}: RightBarProps) {
	const renderAssignments = () => {
		if (courseName && assignments.length > 0) {
			return (
				<>
					{/* Course Info */}
					<div className="p-4 border-b border-gray-300">
						<h3 className="text-xl font-bold">{courseName}</h3>
						<p className="text-gray-600">{courseCode}</p>
					</div>

					{/* Assignments List */}
					<div className="p-4 overflow-y-auto">
						{assignments.map((assignment, index) => (
							<div
								key={index}
								className="p-2 mb-2 bg-gray-100 rounded-lg"
							>
								<h4 className="text-sm font-semibold">
									{assignment.title}
								</h4>
								<p className="text-xs text-gray-500">
									Due: {assignment.dueDate}
								</p>
							</div>
						))}
					</div>
				</>
			);
		} else {
			// Show all assignments grouped by course when no course is selected
			return (
				<div className="p-4 overflow-y-auto">
					{Object.keys(allAssignments).length > 0 ? (
						Object.keys(allAssignments).map((course) => (
							<div
								key={course}
								className="mb-4"
							>
								<h3 className="pl-2 text-lg font-semibold mb-2">
									{course}
								</h3>
								{allAssignments[course].map((assignment, index) => (
									<div
										key={index}
										className="p-2 ml-1 mr-4 mb-2 bg-gray-100 rounded-lg"
									>
										<h4 className="text-sm font-semibold">
											{assignment.title}
										</h4>
										<p className="text-xs text-gray-500">
											Due: {assignment.dueDate}
										</p>
									</div>
								))}
								<hr className="w-[80%] ml-2 my-4" />
							</div>
						))
					) : (
						<p className="text-gray-500">No assignments available.</p>
					)}
				</div>
			);
		}
	};

	return (
		<div
			className={`fixed inset-y-0 right-0 z-50 bg-gray-50 transform transition-transform duration-500 ease-in-out ${
				isVisible ? 'translate-x-0' : 'translate-x-full'
			} w-64`}
		>
			{/* Toggle Button */}
			<h3 className="font-semibold text-3xl p-8 text-drexel-blue">Assignments</h3>
			<hr className="" />
			<button
				onClick={() => setIsVisible(!isVisible)}
				className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full bg-gray-200 hover:bg-gray-300 p-2 rounded-l-lg"
			>
				<FontAwesomeIcon
					icon={faChevronLeft}
					className={`w-4 h-4 transition-transform duration-500 ease-in-out ${
						isVisible ? '' : 'rotate-180'
					}`}
				/>
			</button>

			{renderAssignments()}
		</div>
	);
}
