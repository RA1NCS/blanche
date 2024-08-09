'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function UserProfile() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="relative flex items-center justify-center p-4 rounded-t-lg transition-all duration-500 ease-in-out"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className={`flex items-center transition-transform duration-500 ease-in-out ${
					isHovered ? 'translate-x-1' : 'translate-x-4'
				}`}
			>
				<Image
					src="/logo.jpeg"
					alt="User Profile"
					width={40}
					height={40}
					className="rounded-full"
				/>

				<div
					className={`ml-4 transition-transform duration-500 ease-in-out ${
						isHovered
							? '-translate-x-0'
							: 'translate-x-1'
					}`}
				>
					<p className="text-gray-600 text-sm font-semibold">
						Student Name
					</p>
					<p className="text-[#002F6C] text-xs">
						StudentID
					</p>
				</div>
			</div>

			<div
				className={`ml-4 transition-all transform duration-500 ease-in-out ${
					isHovered
						? 'opacity-100 translate-x-0'
						: 'opacity-0 translate-x-4'
				}`}
			>
				<button className="flex items-center text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition duration-300">
					<FontAwesomeIcon
						icon={faSignOutAlt}
						className="w-4 h-4"
					/>
				</button>
			</div>
		</div>
	);
}
