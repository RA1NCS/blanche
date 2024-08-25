import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Course, Assignment } from '@/lib/interfaces';

type HandleCourseClick = (course: Course) => void;

export default function SearchParamsHandler({
	handleCourseClick,
	setSelectedAssignment,
	setIsModalOpen,
}: {
	handleCourseClick: HandleCourseClick;
	setSelectedAssignment: (assignment: Assignment | null) => void;
	setIsModalOpen: (isOpen: boolean) => void;
}) {
	const searchParams = useSearchParams();

	useEffect(() => {
		const fetchParams = async () => {
			const courseId = searchParams.get('courseId');
			const assignmentId = searchParams.get('assignmentId');

			if (courseId) {
				// Fetch the course details here using courseId and call handleCourseClick
				const courseResponse = await fetch(
					`/api/courses/${courseId}`
				);
				const courseData = await courseResponse.json();

				handleCourseClick(courseData);

				if (assignmentId) {
					// Fetch the assignment details here using assignmentId and update the state
					const assignmentResponse = await fetch(
						`/api/courses/${courseId}/assignments`
					);
					const assignments: Assignment[] =
						await assignmentResponse.json();
					const selectedAssignment = assignments.find(
						(assignment) =>
							assignment.assignment_id ===
							parseInt(assignmentId)
					);

					if (selectedAssignment) {
						setSelectedAssignment(
							selectedAssignment
						);
						setIsModalOpen(true);
					}
				}
			}
		};

		fetchParams();
	}, [searchParams, handleCourseClick, setSelectedAssignment, setIsModalOpen]);

	return null;
}
