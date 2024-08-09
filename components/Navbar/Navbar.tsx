'use client'; // This marks the component as a Client Component

import Image from 'next/image';
import NavItem from './NavItem';
import NavSection from './NavSection';

export default function Navbar() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
			<div className="w-full bg-transparent px-6 pt-8 pb-6">
				<div className="relative w-full h-0 pb-[25.5%]">
					<Image
						src="/drexel-horizontal-logo.png"
						alt="Drexel Dragon Logo"
						layout="fill"
						objectFit="contain"
					/>
				</div>
			</div>

			<hr className="h-px w-[80%] mx-auto my-1 bg-gray-300 border-0" />

			<div className="flex-grow overflow-y-auto p-10">
				<NavSection>
					<NavItem
						href="/profile"
						icon={
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								></path>
							</svg>
						}
						label="User Profile"
					/>
					<NavItem
						href="/courses"
						icon={
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								></path>
							</svg>
						}
						label="Courses"
					/>
					<NavItem
						href="/deadlines"
						icon={
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
								></path>
							</svg>
						}
						label="Deadlines"
					/>
					<NavItem
						href="/assignments"
						icon={
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
								></path>
							</svg>
						}
						label="Assignments"
					/>
				</NavSection>
			</div>

			<div className="p-6">
				<NavItem
					href="/logout"
					icon={
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							></path>
						</svg>
					}
					label="Logout"
				/>
			</div>
		</div>
	);
}
