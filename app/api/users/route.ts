import { NextResponse } from 'next/server';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
});

export async function GET() {
	try {
		const users = await clerkClient.users.getUserList({ limit: 100 });
		return NextResponse.json(users);
	} catch (error) {
		console.error('Error fetching user list:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user list' },
			{ status: 500 }
		);
	}
}
