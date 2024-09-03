import { NextResponse } from 'next/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
	const user = await currentUser();

	if (!user) {
		return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
	}

	const profileImageUrl = user.unsafeMetadata?.profile_image_url;

	if (typeof profileImageUrl !== 'string') {
		return NextResponse.json({ error: 'No profile image to delete' }, { status: 400 });
	}

	try {
		// Extract the public_id from the URL
		const publicId = profileImageUrl.split('/').pop()?.split('.')[0];

		if (publicId) {
			// Delete the image from Cloudinary
			await cloudinary.uploader.destroy(`user_profile_images/${publicId}`);

			// Fetch the existing unsafeMetadata to preserve other fields
			const existingMetadata = (await clerkClient.users.getUser(user.id)).unsafeMetadata || {};

			// Update user metadata to remove the profile image URL while preserving other fields
			await clerkClient.users.updateUser(user.id, {
				unsafeMetadata: {
					...existingMetadata, // Preserve existing metadata
					profile_image_url: null, // Set profile_image_url to null
				},
			});

			return NextResponse.json({
				message: 'Profile image deleted',
			});
		} else {
			throw new Error('Invalid public ID');
		}
	} catch (error) {
		console.error('Error deleting profile image:', error);
		return NextResponse.json({ error: 'Failed to delete profile image' }, { status: 500 });
	}
}
