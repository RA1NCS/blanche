'use client';

import { useState, useEffect, Suspense } from 'react';
import CourseGrid from '@/components/Courses/CourseGrid';
import CourseModal from '@/components/Courses/CourseModal';
import RightBar from '@/components/RightBar';
import { Course, Assignment, AssignmentDisplay } from '@/lib/interfaces';
import { useSearchParams } from 'next/navigation';

export default function CoursesPage() {
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [selectedAssignment, setSelectedAssignment] =
		useState<Assignment | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isRightBarVisible, setIsRightBarVisible] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [allAssignments, setAllAssignments] = useState<{
		[course: string]: AssignmentDisplay[];
	}>({});

	const searchParams = useSearchParams();

	// Fetch courses on component mount
	useEffect(() => {
		async function fetchCourses() {
			try {
				const res = await fetch('/api/courses');
				const data = await res.json();
				setCourses(data); // Set the courses state

				// Check if a course and assignment were specified in the URL
				const courseId = searchParams.get('courseId');
				const assignmentId =
					searchParams.get('assignmentId');

				if (courseId) {
					const selectedCourse = data.find(
						(course: Course) =>
							course.course_id ===
							parseInt(courseId)
					);
					if (selectedCourse) {
						handleCourseClick(selectedCourse);
						if (assignmentId) {
							const res = await fetch(
								`/api/courses/${selectedCourse.course_id}/assignments`
							);
							const assignmentsData: Assignment[] =
								await res.json();
							const selectedAssignment =
								assignmentsData.find(
									(
										assignment
									) =>
										assignment.assignment_id ===
										parseInt(
											assignmentId
										)
								);
							if (selectedAssignment) {
								setSelectedAssignment(
									selectedAssignment
								);
								setIsModalOpen(true);
							}
						}
					}
				}
			} catch (error) {
				console.error('Failed to fetch courses:', error);
			}
		}

		fetchCourses(); // Trigger fetching courses on component mount
	}, [searchParams]);

	// Fetch assignments once courses are loaded
	useEffect(() => {
		async function fetchAllAssignments() {
			const assignmentsMap: {
				[course: string]: AssignmentDisplay[];
			} = {};
			for (const course of courses) {
				const res = await fetch(
					`/api/courses/${course.course_id}/assignments`
				);
				const data: Assignment[] = await res.json();
				assignmentsMap[course.course_name] = data.map(
					(assignment: Assignment) => ({
						title: assignment.title,
						dueDate: new Date(
							assignment.due_date
						).toLocaleDateString(),
					})
				);
			}
			setAllAssignments(assignmentsMap); // Set the allAssignments state
		}

		if (courses.length > 0) {
			fetchAllAssignments(); // Trigger fetching assignments only after courses are loaded
		}
	}, [courses]);

	const handleCourseClick = async (course: Course) => {
		setSelectedCourse(course);
		const res = await fetch(
			`/api/courses/${course.course_id}/assignments`
		);
		const data: Assignment[] = await res.json();
		setAssignments(data); // Set the assignments state for the selected course
		setSelectedAssignment(null); // Reset selected assignment when course changes
		setIsModalOpen(true);
		setIsRightBarVisible(true); // Show right bar when course is selected
	};

	const handleAssignmentClick = async (assignment: AssignmentDisplay) => {
		// Find the course corresponding to the assignment
		const course = courses.find((c) =>
			allAssignments[c.course_name]?.some(
				(a) => a.title === assignment.title
			)
		);

		if (course) {
			setSelectedCourse(course);
			// Fetch assignments for the selected course
			const res = await fetch(
				`/api/courses/${course.course_id}/assignments`
			);
			const data: Assignment[] = await res.json();
			setAssignments(data);

			// Find and set the selected assignment
			const selectedAssignment = data.find(
				(a) => a.title === assignment.title
			);
			if (selectedAssignment) {
				setSelectedAssignment(selectedAssignment);
				setIsModalOpen(true);
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
		<Suspense fallback={<div>Loading...</div>}>
			<div className="flex">
				{/* Main Content */}
				<div className="flex-grow">
					<CourseGrid
						courses={courses}
						onCourseClick={handleCourseClick}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
					<CourseModal
						isModalOpen={isModalOpen}
						selectedCourse={selectedCourse}
						selectedAssignment={
							selectedAssignment
						}
						onClose={handleCloseModal}
						onBackToCourse={handleBackToCourse} // New handler for back to course
					/>
				</div>

				{/* Right Side Bar */}
				<RightBar
					isVisible={isRightBarVisible}
					setIsVisible={setIsRightBarVisible}
					courseName={selectedCourse?.course_name}
					courseCode={selectedCourse?.course_code}
					assignments={assignments.map(
						(assignment) => ({
							title: assignment.title,
							dueDate: new Date(
								assignment.due_date
							).toLocaleDateString(),
						})
					)}
					allAssignments={allAssignments}
					onAssignmentClick={handleAssignmentClick} // Handle assignment click
				/>
			</div>
		</Suspense>
	);
}
