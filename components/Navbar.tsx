import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className="w-1/6 bg-gray-800 text-white flex flex-col justify-between p-6">
			<ul className="space-y-6">
				<li>
					<Link
						href="/profile"
						className="hover:text-gray-300"
					>
						Profile
					</Link>
				</li>
				<li>
					<Link
						href="/courses"
						className="hover:text-gray-300"
					>
						Courses
					</Link>
				</li>
				<li>
					<Link
						href="/grades"
						className="hover:text-gray-300"
					>
						Grades
					</Link>
				</li>
				<li>
					<Link
						href="/deadlines"
						className="hover:text-gray-300"
					>
						Deadlines
					</Link>
				</li>
			</ul>
			<div className="mt-auto">
				<button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
					Sign Out
				</button>
			</div>
		</nav>
	);
}
