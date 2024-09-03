'use client';

import { useState, useEffect, Suspense } from 'react';
import CourseGrid from '@/components/Courses/CourseGrid';
import { useSearchParams } from 'next/navigation';
import CourseModal from '@/components/Courses/CourseModal';
import RightBar from '@/components/RightBar';
import { Course, Assignment } from '@/lib/interfaces';

export default function CoursesPage() {
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isRightBarVisible, setIsRightBarVisible] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [allAssignments, setAllAssignments] = useState<{
		[course: string]: Assignment[];
	}>({});

	// Fetch courses on component mount
	useEffect(() => {
		async function fetchCourses() {
			try {
				const res = await fetch('/api/courses');
				const data = await res.json();
				setCourses(data); // Set the courses state
			} catch (error) {
				console.error('Failed to fetch courses:', error);
			}
		}

		fetchCourses(); // Trigger fetching courses on component mount
	}, []);

	// Fetch assignments once courses are loaded
	useEffect(() => {
		async function fetchAllAssignments() {
			const assignmentsMap: {
				[course: string]: Assignment[];
			} = {};
			for (const course of courses) {
				const res = await fetch(`/api/courses/${course.course_id}/assignments`);
				const data: Assignment[] = await res.json();
				assignmentsMap[course.course_name] = data;
			}
			setAllAssignments(assignmentsMap); // Set the allAssignments state
		}

		if (courses.length > 0) {
			fetchAllAssignments(); // Trigger fetching assignments only after courses are loaded
		}
	}, [courses]);

	const handleCourseClick = async (course: Course) => {
		setSelectedCourse(course);
		const res = await fetch(`/api/courses/${course.course_id}/assignments`);
		const data: Assignment[] = await res.json();
		setAssignments(data); // Set the assignments state for the selected course
		setSelectedAssignment(null); // Reset selected assignment when course changes
		setIsModalOpen(true);
		setIsRightBarVisible(true); // Show right bar when course is selected
	};

	const handleAssignmentClick = async (assignment: Assignment) => {
		// Find the course corresponding to the assignment
		const course = courses.find((c) =>
			allAssignments[c.course_name]?.some((a) => a.assignment_id === assignment.assignment_id)
		);

		if (course) {
			// Set the selected course and assignments
			setSelectedCourse(course);

			// Fetch and set assignments for the selected course
			const res = await fetch(`/api/courses/${course.course_id}/assignments`);
			const data: Assignment[] = await res.json();
			setAssignments(data);

			// Set the clicked assignment as the selected assignment
			const selectedAssignment = data.find((a) => a.assignment_id === assignment.assignment_id);
			if (selectedAssignment) {
				setSelectedAssignment(selectedAssignment);
				setIsModalOpen(true); // Open the modal with the selected assignment
			}
		}
	};

	const handleEditAssignment = (assignment: Assignment) => {
		setSelectedAssignment(assignment); // Open the selected assignment in edit mode
		setIsModalOpen(true);
	};

	const handleCreateAssignment = () => {
		setSelectedAssignment(null); // Clear any selected assignment
		setIsModalOpen(true); // Open the modal in create mode
	};

	const handleDeleteAssignment = async () => {
		if (selectedAssignment) {
			try {
				// Send a DELETE request to the backend API
				const response = await fetch(`/api/assignments/${selectedAssignment.assignment_id}`, {
					method: 'DELETE',
				});

				// Check if the deletion was successful
				if (response.ok) {
					// Remove the assignment from the UI
					const updatedAssignments = assignments.filter(
						(assignment) =>
							assignment.assignment_id !== selectedAssignment.assignment_id
					);
					setAssignments(updatedAssignments);

					// Update the assignments in the right sidebar
					setAllAssignments((prev) => {
						const newAllAssignments = { ...prev };
						newAllAssignments[selectedCourse?.course_name || ''] =
							updatedAssignments;
						return newAllAssignments;
					});

					// Close the modal and reset the selected assignment
					setSelectedAssignment(null);
					setIsModalOpen(false);
				} else {
					console.error('Failed to delete assignment:', await response.text());
				}
			} catch (error) {
				console.error('Failed to delete assignment:', error);
			}
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedCourse(null);
		setAssignments([]);
		setSelectedAssignment(null); // Reset selected assignment when modal closes
		setIsRightBarVisible(false); // Hide the bar after closing the modal
	};

	const handleBackToCourse = () => {
		setSelectedAssignment(null); // Reset selected assignment to go back to course view
	};

	return (
		<div className="flex">
			{/* Main Content */}
			<div className="flex-grow">
				<CourseGrid
					courses={courses}
					onCourseClick={handleCourseClick}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
				<Suspense fallback={<div>Loading...</div>}>
					<CourseModal
						isModalOpen={isModalOpen}
						selectedCourse={selectedCourse}
						selectedAssignment={selectedAssignment}
						onClose={handleCloseModal}
						onBackToCourse={handleBackToCourse}
						onEditAssignment={() => handleEditAssignment(selectedAssignment!)}
						onDeleteAssignment={handleDeleteAssignment}
					/>
				</Suspense>
			</div>

			{/* Right Side Bar */}
			<RightBar
				isVisible={isRightBarVisible}
				setIsVisible={setIsRightBarVisible}
				courseName={selectedCourse?.course_name}
				courseCode={selectedCourse?.course_code}
				assignments={assignments}
				allAssignments={allAssignments}
				onAssignmentClick={handleAssignmentClick}
				onEditAssignment={handleEditAssignment}
				onCreateAssignment={handleCreateAssignment}
			/>
		</div>
	);
}
