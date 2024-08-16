import { Course } from '@/lib/interfaces';

interface CourseGridProps {
	courses: Course[];
	onCourseClick: (course: Course) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

export default function CourseGrid({ courses, onCourseClick, searchQuery, setSearchQuery }: CourseGridProps) {
	const filteredCourses = courses.filter(
		(course) =>
			course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.course_code.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="mt-0">
			{/* Search Bar */}
			<div className="w-full mb-8">
				<input
					type="text"
					placeholder="Search courses..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full h-12 px-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* Courses Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 py-8 px-6 rounded-3xl border border-gray-300 ">
				{filteredCourses.map((course) => (
					<div
						key={course.course_id}
						className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
						onClick={() => onCourseClick(course)}
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
							<p className="text-gray-700 mb-1">{course.professor_name}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
