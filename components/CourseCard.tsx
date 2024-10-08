import { Course } from '@/lib/interfaces';
import Image from 'next/image';

interface CourseCardProps {
	course: Course;
	onClick: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
	return (
		<div
			className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
			onClick={onClick}
		>
			<div className="relative w-full h-48">
				<Image
					src={course.course_image_url}
					alt={course.course_name}
					layout="fill"
					objectFit="cover"
					className="rounded-t-lg"
				/>
			</div>
			<div className="p-4">
				<h2 className="text-2xl font-bold mb-2">
					{course.course_code}
				</h2>
				<h2 className="text-xl font-medium mb-2">
					{course.course_name}
				</h2>
				<p className="text-gray-700 mb-1">
					{course.professor_name}
				</p>
			</div>
		</div>
	);
}
