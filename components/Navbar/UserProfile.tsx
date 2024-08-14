'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { SignOutButton } from '@clerk/nextjs';

export default function UserProfile() {
	const [isHovered, setIsHovered] = useState(false);
	const [fullName, setFullName] = useState('Loading...');
	const [username, setUsername] = useState('Loading...');

	// Fetch full name
	useEffect(() => {
		const fetchFullName = async () => {
			try {
				const response = await fetch(
					'/api/users/curFullname'
				);
				if (!response.ok) {
					throw new Error('Failed to fetch full name');
				}
				const data = await response.json();
				setFullName(data.fullName);
			} catch (error) {
				console.error(error);
				setFullName('Error loading name');
			}
		};

		fetchFullName();
	}, []);

	// Fetch username
	useEffect(() => {
		const fetchUsername = async () => {
			try {
				const response = await fetch(
					'/api/users/curUsername'
				);
				if (!response.ok) {
					throw new Error('Failed to fetch username');
				}
				const data = await response.json();
				setUsername(data.username || 'No Username');
			} catch (error) {
				console.error('Error fetching username:', error);
				setUsername('Error loading username');
			}
		};

		fetchUsername();
	}, []);

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
					src="/user-image.png"
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
						{fullName}
					</p>
					<p className="text-[#002F6C] text-xs">
						{username}
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
				<SignOutButton>
					<button className="flex items-center text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition duration-300">
						<FontAwesomeIcon
							icon={faSignOutAlt}
							className="w-4 h-4"
						/>
					</button>
				</SignOutButton>
			</div>
		</div>
	);
}
