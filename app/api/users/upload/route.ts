import { NextResponse } from 'next/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
	const data = await request.formData();
	const file = data.get('file') as File;
	const user = await currentUser();

	if (!file || !user) {
		return NextResponse.json(
			{ error: 'Missing file or user' },
			{ status: 400 }
		);
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
	}

	const fileName = `${user.id}-${Date.now()}-${file.name}`;
	const filePath = path.join(uploadsDir, fileName);

	fs.writeFileSync(filePath, buffer);

	const imageUrl = `/uploads/${fileName}`;

	// Update user metadata with the image URL using clerkClient
	await clerkClient.users.updateUser(user.id, {
		unsafeMetadata: {
			profile_image_url: imageUrl,
		},
	});

	return NextResponse.json({ imageUrl });
}
