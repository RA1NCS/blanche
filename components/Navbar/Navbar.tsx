'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import NavItem from './NavItem';
import NavSection from './NavSection';
import UserProfile from './UserProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBook,
	faCalendarAlt,
	faGraduationCap,
	faEllipsisH,
	faShieldAlt,
	faGavel,
	faUniversalAccess,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
	const [hovered, setHovered] = useState(false);
	const [delayedHovered, setDelayedHovered] = useState(false);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		if (hovered) {
			setDelayedHovered(true);
		} else {
			timeoutId = setTimeout(() => {
				setDelayedHovered(false);
			}, 600);
		}

		return () => clearTimeout(timeoutId);
	}, [hovered]);

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
			<div className="flex-grow flex flex-col justify-between overflow-y-auto px-2 py-8 mx-5">
				<div>
					<NavSection>
						<NavItem
							href="/courses"
							icon={
								<FontAwesomeIcon
									icon={faBook}
									className="w-5 h-5 mr-3"
								/>
							}
							label="Courses"
						/>
						<NavItem
							href="/deadlines"
							icon={
								<FontAwesomeIcon
									icon={
										faCalendarAlt
									}
									className="w-5 h-5 mr-3"
								/>
							}
							label="Deadlines"
						/>
						<NavItem
							href="/grades"
							icon={
								<FontAwesomeIcon
									icon={
										faGraduationCap
									}
									className="w-5 h-5 mr-3"
								/>
							}
							label="Grades"
						/>
					</NavSection>
				</div>
				<div
					className="-my-3 relative"
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					<div
						className={`absolute left-4 -top-14 flex justify-between w-40 space-x-4 transition-all duration-300 ease-in-out ${
							delayedHovered
								? 'opacity-100 translate-y-0'
								: 'opacity-0 translate-y-4'
						}`}
					>
						<a
							href="https://help.blackboard.com/1000en_US"
							className="p-2 px-3 rounded bg-gray-100 hover:bg-gray-200"
							title="Privacy"
						>
							<FontAwesomeIcon
								icon={faShieldAlt}
								className="w-4 h-4"
							/>
						</a>
						<a
							href="https://help.blackboard.com/1001en_US"
							className="p-2 px-3 rounded bg-gray-100 hover:bg-gray-200"
							title="Terms"
						>
							<FontAwesomeIcon
								icon={faGavel}
								className="w-4 h-4"
							/>
						</a>
						<a
							href="https://help.blackboard.com/001_631en_US"
							className="p-2 px-3 rounded bg-gray-100 hover:bg-gray-200"
							title="Accessibility"
						>
							<FontAwesomeIcon
								icon={
									faUniversalAccess
								}
								className="w-4 h-4"
							/>
						</a>
					</div>
					<NavItem
						href="#"
						icon={
							<FontAwesomeIcon
								icon={faEllipsisH}
								className="w-5 h-5 mr-3"
							/>
						}
						label="More Information"
					/>
				</div>
			</div>
			<hr className="h-px w-[80%] mx-auto bg-gray-300 border-0" />
			<UserProfile />
		</div>
	);
}
