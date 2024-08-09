'use client';

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
} from '@fortawesome/free-solid-svg-icons';

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
				<div className="-my-3">
					<NavItem
						href="/more-info"
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
