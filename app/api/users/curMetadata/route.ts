import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
	const user = await currentUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Return user's metadata
	const metadata = user.unsafeMetadata; // unsafeMetadata contains custom fields like `profile_image_url`

	return NextResponse.json(metadata);
}
