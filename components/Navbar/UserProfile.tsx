'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { SignOutButton } from '@clerk/nextjs';

export default function UserProfile() {
	const [isHovered, setIsHovered] = useState(false);
	const [fullName, setFullName] = useState('Loading...');
	const [username, setUsername] = useState('Loading...');
	const [profileImage, setProfileImage] = useState('/user-image.png');
	const [isDefaultImage, setIsDefaultImage] = useState(true);
	const [showOptions, setShowOptions] = useState(false);

	// Fetch full name and username
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const fullNameResponse = await fetch(
					'/api/users/curFullname'
				);
				if (!fullNameResponse.ok)
					throw new Error('Failed to fetch full name');
				const fullNameData = await fullNameResponse.json();
				setFullName(fullNameData.fullName);

				const usernameResponse = await fetch(
					'/api/users/curUsername'
				);
				if (!usernameResponse.ok)
					throw new Error('Failed to fetch username');
				const usernameData = await usernameResponse.json();
				setUsername(usernameData.username || 'No Username');

				// Fetch the profile image URL from metadata
				const metadataResponse = await fetch(
					'/api/users/curMetadata'
				); // This route now exists
				if (metadataResponse.ok) {
					const metadata =
						await metadataResponse.json();
					if (metadata.profile_image_url) {
						setProfileImage(
							metadata.profile_image_url
						);
						setIsDefaultImage(false);
					}
				}
			} catch (error) {
				console.error(error);
				setFullName('Error loading name');
				setUsername('Error loading username');
			}
		};

		fetchUserData();
	}, []);

	// Handle image click to toggle options
	const handleImageClick = () => setShowOptions((prev) => !prev);

	// Handle file upload
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('userId', 'current'); // Assuming the user ID is handled server-side

			try {
				const response = await fetch('/api/users/upload', {
					method: 'POST',
					body: formData,
				});

				if (response.ok) {
					const { imageUrl } = await response.json();
					setProfileImage(imageUrl);
					setIsDefaultImage(false);
					setShowOptions(false);
				} else {
					console.error('Failed to upload image');
				}
			} catch (error) {
				console.error('Error uploading image:', error);
			}
		}
	};

	// Handle delete profile picture
	const handleDeleteProfilePicture = async () => {
		try {
			const response = await fetch(
				'/api/users/deleteProfileImage',
				{
					method: 'POST',
				}
			);

			if (response.ok) {
				setProfileImage('/user-image.png');
				setIsDefaultImage(true);
				setShowOptions(false);
			} else {
				console.error('Failed to delete profile picture');
			}
		} catch (error) {
			console.error('Error deleting profile picture:', error);
		}
	};

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
				<div className="relative">
					<Image
						src={profileImage}
						alt="User Profile"
						width={40}
						height={40}
						className="rounded-full cursor-pointer"
						onClick={handleImageClick}
					/>
					{showOptions && (
						<div
							className={`absolute ${
								!isDefaultImage
									? `-top-32`
									: `-top-20`
							} mt-2 w-12 bg-white bg-opacity-90 backdrop-blur-lg border rounded-lg shadow-lg z-50 p-2 transition-opacity duration-300 ease-in-out`}
						>
							{!isDefaultImage && (
								<button
									className="block w-full text-left text-red-600 hover:bg-red-50 p-2 rounded-lg flex items-center"
									onClick={
										handleDeleteProfilePicture
									}
								>
									<FontAwesomeIcon
										icon={
											faTrashAlt
										}
										className="mr-9"
									/>
								</button>
							)}
							<label className="block w-full text-left p-2 rounded-lg flex items-center hover:bg-gray-100 cursor-pointer text-gray-600">
								<FontAwesomeIcon
									icon={faEdit}
									className="mr-14"
								/>
								<input
									type="file"
									className="hidden"
									onChange={
										handleFileChange
									}
								/>
							</label>
						</div>
					)}
				</div>

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
