'use client';

import { useState, useEffect, Suspense } from 'react';
import CourseGrid from '@/components/Courses/CourseGrid';
import CourseModal from '@/components/Courses/CourseModal';
import RightBar from '@/components/RightBar';
import { Course, Assignment, AssignmentDisplay } from '@/lib/interfaces';
import dynamic from 'next/dynamic';

// Dynamically import the SearchParamsHandler since it's client-side only.
const SearchParamsHandler = dynamic(
	() => import('@/components/Courses/SearchParamsHandler'),
	{ ssr: false }
);

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

	// Fetch courses on component mount
	useEffect(() => {
		async function fetchCourses() {
			try {
				const res = await fetch('/api/courses');
				const data = await res.json();
				setCourses(data);
			} catch (error) {
				console.error('Failed to fetch courses:', error);
			}
		}

		fetchCourses();
	}, []);

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
			setAllAssignments(assignmentsMap);
		}

		if (courses.length > 0) {
			fetchAllAssignments();
		}
	}, [courses]);

	const handleCourseClick = async (course: Course) => {
		setSelectedCourse(course);
		const res = await fetch(
			`/api/courses/${course.course_id}/assignments`
		);
		const data: Assignment[] = await res.json();
		setAssignments(data);
		setSelectedAssignment(null);
		setIsModalOpen(true);
		setIsRightBarVisible(true);
	};

	const handleAssignmentClick = async (assignment: AssignmentDisplay) => {
		const course = courses.find((c) =>
			allAssignments[c.course_name]?.some(
				(a) => a.title === assignment.title
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
		setSelectedAssignment(null);
		setIsRightBarVisible(false);
	};

	const handleBackToCourse = () => {
		setSelectedAssignment(null);
	};

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
				selectedAssignment={selectedAssignment}
				onClose={handleCloseModal}
				onBackToCourse={handleBackToCourse}
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
				dueDate: new Date(
					assignment.due_date
				).toLocaleDateString(),
			}))}
			allAssignments={allAssignments}
			onAssignmentClick={handleAssignmentClick}
		/>

		<Suspense fallback={<div>Loading...</div>}>
			<SearchParamsHandler
				handleCourseClick={handleCourseClick}
				setSelectedAssignment={setSelectedAssignment}
				setIsModalOpen={setIsModalOpen}
			/>
		</Suspense>
	</div>;
}
