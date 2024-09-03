'use client';

import { useState, useEffect, Suspense } from 'react';
import CourseGrid from '@/components/Courses/CourseGrid';
import CourseModal from '@/components/Courses/CourseModal';
import RightBar from '@/components/RightBar';
import { Course, Assignment } from '@/lib/interfaces';

export default function CoursesPage() {
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [selectedAssignment, setSelectedAssignment] =
		useState<Assignment | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isRightBarVisible, setIsRightBarVisible] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<boolean>(false);
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
				const res = await fetch(
					`/api/courses/${course.course_id}/assignments`
				);
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
		const res = await fetch(
			`/api/courses/${course.course_id}/assignments`
		);
		const data: Assignment[] = await res.json();
		setAssignments(data); // Set the assignments state for the selected course
		setSelectedAssignment(null); // Reset selected assignment when course changes
		setIsModalOpen(true);
		setIsRightBarVisible(true); // Show right bar when course is selected
	};

	const handleAssignmentClick = async (assignment: Assignment) => {
		setEditMode(false); // Disable edit mode initially
		const course = courses.find((c) =>
			allAssignments[c.course_name]?.some(
				(a) => a.assignment_id === assignment.assignment_id
			)
		);

		if (course) {
			setSelectedCourse(course);
			const res = await fetch(
				`/api/courses/${course.course_id}/assignments`
			);
			const data: Assignment[] = await res.json();
			setAssignments(data);
			const selectedAssignment = data.find(
				(a) => a.assignment_id === assignment.assignment_id
			);
			if (selectedAssignment) {
				setSelectedAssignment(selectedAssignment);
				setIsModalOpen(true);
			}
		}
	};

	const handleEditAssignment = async (updatedAssignment: Assignment) => {
		try {
			const response = await fetch(
				`/api/assignments/${updatedAssignment.assignment_id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedAssignment),
				}
			);

			if (response.ok) {
				const updatedAssignments = assignments.map(
					(assignment) =>
						assignment.assignment_id ===
						updatedAssignment.assignment_id
							? updatedAssignment
							: assignment
				);
				setAssignments(updatedAssignments);
				setSelectedAssignment(updatedAssignment);
				setEditMode(false); // Exit edit mode
			} else {
				console.error(
					'Failed to update assignment:',
					await response.text()
				);
			}
		} catch (error) {
			console.error('Failed to update assignment:', error);
		}
	};

	const handleCreateAssignment = async (newAssignment: Assignment) => {
		try {
			const response = await fetch(`/api/assignments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newAssignment),
			});

			if (response.ok) {
				const createdAssignment = await response.json();
				setAssignments([...assignments, createdAssignment]);
				setAllAssignments((prev) => ({
					...prev,
					[selectedCourse?.course_name || '']: [
						...(prev[
							selectedCourse?.course_name ||
								''
						] || []),
						createdAssignment,
					],
				}));
				setSelectedAssignment(createdAssignment);
				setIsModalOpen(false);
			} else {
				console.error(
					'Failed to create assignment:',
					await response.text()
				);
			}
		} catch (error) {
			console.error('Failed to create assignment:', error);
		}
	};

	const handleDeleteAssignment = async () => {
		if (selectedAssignment) {
			try {
				await fetch(
					`/api/assignments/${selectedAssignment.assignment_id}`,
					{
						method: 'DELETE',
					}
				);
				const res = await fetch(
					`/api/courses/${selectedCourse?.course_id}/assignments`
				);
				const data: Assignment[] = await res.json();
				setAssignments(data);
				setSelectedAssignment(null);
				setIsModalOpen(false);
			} catch (error) {
				console.error('Failed to delete assignment:', error);
			}
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedCourse(null);
		setAssignments([]);
		setSelectedAssignment(null);
		setIsRightBarVisible(false);
		setEditMode(false);
	};

	const handleBackToCourse = () => {
		setSelectedAssignment(null);
		setEditMode(false);
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
						selectedAssignment={
							selectedAssignment
						}
						onClose={handleCloseModal}
						onBackToCourse={handleBackToCourse}
						onEditAssignment={
							handleEditAssignment
						}
						onDeleteAssignment={
							handleDeleteAssignment
						}
						onCreateAssignment={
							handleCreateAssignment
						} // Handle assignment creation
						editMode={editMode}
						setEditMode={setEditMode}
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
				onEditAssignment={(assignment) => {
					setSelectedAssignment(assignment); // Set the correct assignment
					setEditMode(true); // Enable edit mode
					setIsModalOpen(true); // Open the modal
				}}
				onCreateAssignment={() => {
					setEditMode(true);
					setSelectedAssignment(null); // Clear selection for new assignment
					setIsModalOpen(true);
				}}
			/>
		</div>
	);
}
