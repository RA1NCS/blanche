import { NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

export async function POST() {
	const user = await currentUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Reset the profile_image_url in the user's metadata
	await clerkClient.users.updateUser(user.id, {
		unsafeMetadata: {
			profile_image_url: '',
		},
	});

	return NextResponse.json({ message: 'Profile image reset' });
}
