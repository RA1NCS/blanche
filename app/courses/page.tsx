'use client';

import { useState, useEffect } from 'react';
import CourseGrid from '@/components/Courses/CourseGrid';
import CourseModal from '@/components/Courses/CourseModal';
import RightBar from '@/components/RightBar';
import { Course, Assignment, AssignmentDisplay } from '@/lib/interfaces';

export default function CoursesPage() {
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isRightBarVisible, setIsRightBarVisible] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [allAssignments, setAllAssignments] = useState<{
		[course: string]: AssignmentDisplay[];
	}>({});

	useEffect(() => {
		async function fetchCourses() {
			const res = await fetch('/api/courses');
			const data = await res.json();

			setCourses(data);
		}

		async function fetchAllAssignments() {
			const assignmentsMap: { [course: string]: AssignmentDisplay[] } = {};
			for (const course of courses) {
				const res = await fetch(`/api/courses/${course.course_id}/assignments`);
				const data: Assignment[] = await res.json();
				assignmentsMap[course.course_name] = data.map((assignment: Assignment) => ({
					title: assignment.title,
					dueDate: new Date(assignment.due_date).toLocaleDateString(),
				}));
			}
			setAllAssignments(assignmentsMap);
		}

		if (courses.length > 0) {
			fetchAllAssignments();
		}
	}, [courses]);

	const handleCourseClick = async (course: Course) => {
		setSelectedCourse(course);
		const res = await fetch(`/api/courses/${course.course_id}/assignments`);
		const data: Assignment[] = await res.json();
		setAssignments(data);
		setIsModalOpen(true);
		setIsRightBarVisible(true); // Show right bar when course is selected
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedCourse(null);
		setAssignments([]);
		setIsRightBarVisible(false); // Hide the bar after closing the modal
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
				<CourseModal
					isModalOpen={isModalOpen}
					selectedCourse={selectedCourse}
					assignments={assignments}
					onClose={handleCloseModal}
				/>
			</div>

			{/* Right Side Bar */}
			<RightBar
				isVisible={isRightBarVisible}
				setIsVisible={setIsRightBarVisible}
				courseName={selectedCourse?.course_name}
				courseCode={selectedCourse?.course_code}
				assignments={assignments.map((assignment) => ({
					title: assignment.title,
					dueDate: new Date(assignment.due_date).toLocaleDateString(),
				}))}
				allAssignments={allAssignments}
			/>
		</div>
	);
}
