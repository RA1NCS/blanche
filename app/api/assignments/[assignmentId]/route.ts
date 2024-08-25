import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(
	request: Request,
	{ params }: { params: { assignmentId: string } }
) {
	const { assignmentId } = params;
	const user = await currentUser();

	if (!user) {
		return NextResponse.json(
			{ error: 'User not authenticated' },
			{ status: 401 }
		);
	}

	try {
		// Fetch the assignment details
		const assignmentResult = await db.query(
			'SELECT * FROM assignments WHERE assignment_id = $1',
			[assignmentId]
		);

		if (assignmentResult.rows.length === 0) {
			return NextResponse.json(
				{ error: 'Assignment not found' },
				{ status: 404 }
			);
		}

		// Fetch any existing submission by the user
		const submissionResult = await db.query(
			'SELECT * FROM student_submissions WHERE assignment_id = $1 AND student_id = $2',
			[assignmentId, user.id]
		);

		// Indicate if the user has already submitted this assignment
		const hasSubmitted = submissionResult.rowCount
			? submissionResult.rowCount > 0
			: false;

		return NextResponse.json({
			assignment: assignmentResult.rows[0],
			submission: submissionResult.rows[0] || null,
			hasSubmitted, // Add this field to clearly indicate submission status
		});
	} catch (error) {
		console.error('Error fetching assignment details:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch assignment details' },
			{ status: 500 }
		);
	}
}
