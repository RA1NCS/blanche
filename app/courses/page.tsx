'use client';

import { useEffect, useState } from 'react';

// Define the Course Type
interface Course {
	course_id: number;
	course_code: string;
	course_name: string;
	course_description: string;
	instructor_id: number;
	course_image_url: string;
	professor_name: string;
}

export default function CoursesPage() {
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');

	useEffect(() => {
		async function fetchCourses() {
			const res = await fetch('/api/courses');
			const data = await res.json();
			setCourses(data);
		}

		fetchCourses();
	}, []);

	const filteredCourses = courses.filter(
		(course) =>
			course.course_name
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			course.course_code
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	return (
		<div className="mt-0">
			{/* Search Bar */}
			<div className="w-full mb-8">
				<input
					type="text"
					placeholder="Search courses..."
					value={searchQuery}
					onChange={(e) =>
						setSearchQuery(e.target.value)
					}
					className="w-full h-12 px-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* Courses Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 py-8 px-6 rounded-3xl border border-gray-300 ">
				{filteredCourses.map((course) => (
					<div
						key={course.course_id}
						className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
					>
						<img
							src={course.course_image_url}
							alt={course.course_name}
							className="w-full h-48 object-cover"
						/>
						<div className="p-4">
							<h2 className="text-2xl font-bold mb-2">
								{course.course_code}
							</h2>
							<h2 className="text-xl font-medium mb-2">
								{course.course_name}
							</h2>
							<p className="text-gray-700 mb-1">
								{
									course.professor_name
								}
							</p>
						</div>
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
		</div>
	);
}
