import { NextResponse } from 'next/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
	const data = await request.formData();
	const file = data.get('file') as File;
	const user = await currentUser();

	if (!file || !user) {
		return NextResponse.json({ error: 'Missing file or user' }, { status: 400 });
	}

	const buffer = Buffer.from(await file.arrayBuffer());

	try {
		const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: 'user_profile_images' },
				(error, result) => {
					if (result) {
						resolve(result);
					} else {
						reject(error);
					}
				}
			);

			streamifier.createReadStream(buffer).pipe(uploadStream);
		});

		const imageUrl = uploadResult.secure_url;

		// Fetch the existing unsafeMetadata to preserve other fields
		const existingMetadata = (await clerkClient.users.getUser(user.id)).unsafeMetadata || {};

		// Update user metadata with the new image URL while preserving the role
		await clerkClient.users.updateUser(user.id, {
			unsafeMetadata: {
				...existingMetadata, // Preserve existing metadata, including the role
				profile_image_url: imageUrl, // Update the profile image URL
			},
		});

		return NextResponse.json({ imageUrl });
	} catch (error) {
		console.error('Error uploading to Cloudinary:', error);
		return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
	}
}
