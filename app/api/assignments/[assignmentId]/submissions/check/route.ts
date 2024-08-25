import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';

export async function GET(
	request: Request,
	{ params }: { params: { assignmentId: string } }
) {
	const user = await currentUser();

	if (!user) {
		return NextResponse.json(
			{ error: 'User not authenticated' },
			{ status: 401 }
		);
	}

	const { assignmentId } = params;

	try {
		// Check if the user has already submitted this assignment
		const existingSubmission = await db.query(
			`SELECT * FROM student_submissions WHERE assignment_id = $1 AND student_id = $2`,
			[assignmentId, user.id]
		);

		// Safely handle null for rowCount
		const hasSubmitted = existingSubmission.rowCount
			? existingSubmission.rowCount > 0
			: false;

		return NextResponse.json({ hasSubmitted });
	} catch (error) {
		console.error('Error checking submission status:', error);
		return NextResponse.json(
			{ error: 'Failed to check submission status' },
			{ status: 500 }
		);
	}
}
