'use client';

import { useEffect, useState } from 'react';

// Define the Course Type
interface Course {
	course_id: number;
	course_name: string;
	course_description: string;
	instructor_id: number;
	course_image_url: string;
}

export default function CoursesPage() {
	// State to hold the list of courses
	const [courses, setCourses] = useState<Course[]>([]);

	// State to hold the selected course ID
	const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

	useEffect(() => {
		async function fetchCourses() {
			const res = await fetch('/api/courses');
			const data = await res.json();
			setCourses(data);
		}

		fetchCourses();
	}, []);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{courses.map((course) => (
				<div
					key={course.course_id}
					className="card"
				>
					<img
						src={course.course_image_url}
						alt={course.course_name}
					/>
					<h2>{course.course_name}</h2>
					<p>{course.course_description}</p>
					<button
						onClick={() =>
							setSelectedCourse(
								course.course_id
							)
						}
					>
						View Assignments
					</button>
				</div>
			))}

			{selectedCourse && (
				<div>
					{/* Render assignments for the selected course here */}
					<p>
						Assignments for course ID:{' '}
						{selectedCourse}
					</p>
					{/* Add additional logic to fetch and display assignments */}
				</div>
			)}
		</div>
	);
}
