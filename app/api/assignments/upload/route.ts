import { NextResponse } from 'next/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import db from '@/lib/db';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
	const data = await request.formData();
	const file = data.get('file') as File | null;
	const assignmentId = data.get('assignmentId');
	const submissionText = data.get('submissionText');
	const user = await currentUser();

	if (!file && !submissionText) {
		return NextResponse.json(
			{ error: 'No submission content provided' },
			{ status: 400 }
		);
	}

	if (!user) {
		return NextResponse.json(
			{ error: 'User not authenticated' },
			{ status: 401 }
		);
	}

	if (!assignmentId) {
		return NextResponse.json(
			{ error: 'Assignment ID is required' },
			{ status: 400 }
		);
	}

	// Check if the user has already submitted this assignment
	const existingSubmission = await db.query(
		`SELECT * FROM student_submissions WHERE assignment_id = $1 AND student_id = $2`,
		[assignmentId, user.id]
	);

	// Safely handle null for rowCount
	const hasSubmitted = existingSubmission.rowCount
		? existingSubmission.rowCount > 0
		: false;

	if (hasSubmitted) {
		return NextResponse.json(
			{ error: 'You have already submitted this assignment' },
			{ status: 400 }
		);
	}

	let fileUrl: string | null = null;

	// If a file is provided, upload it to Cloudinary
	if (file) {
		const buffer = Buffer.from(await file.arrayBuffer());
		try {
			const uploadResult = await new Promise<{
				secure_url: string;
			}>((resolve, reject) => {
				const uploadStream =
					cloudinary.uploader.upload_stream(
						{ folder: 'assignments' }, // Customize the folder if needed
						(error, result) => {
							if (result) {
								resolve(result);
							} else {
								reject(error);
							}
						}
					);

				streamifier
					.createReadStream(buffer)
					.pipe(uploadStream);
			});

			fileUrl = uploadResult.secure_url;
		} catch (error) {
			console.error('Error uploading to Cloudinary:', error);
			return NextResponse.json(
				{ error: 'Failed to upload file' },
				{ status: 500 }
			);
		}
	}

	// Save the submission to the database
	try {
		const result = await db.query(
			`INSERT INTO student_submissions (assignment_id, student_id, submission_text, submission_file_url)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
			[assignmentId, user.id, submissionText || null, fileUrl]
		);

		return NextResponse.json(result.rows[0]);
	} catch (error) {
		console.error('Error saving submission:', error);
		return NextResponse.json(
			{ error: 'Failed to save submission' },
			{ status: 500 }
		);
	}
}
