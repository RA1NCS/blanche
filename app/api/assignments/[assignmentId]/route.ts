import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// GET: Fetch assignment details
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

		const submissionResult = await db.query(
			'SELECT * FROM student_submissions WHERE assignment_id = $1 AND student_id = $2',
			[assignmentId, user.id]
		);

		const hasSubmitted = submissionResult.rowCount
			? submissionResult.rowCount > 0
			: false;

		return NextResponse.json({
			assignment: assignmentResult.rows[0],
			submission: submissionResult.rows[0] || null,
			hasSubmitted,
		});
	} catch (error) {
		console.error('Error fetching assignment details:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch assignment details' },
			{ status: 500 }
		);
	}
}

// PUT: Update assignment details
export async function PUT(
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
		const { title, description } = await request.json();

		const updateResult = await db.query(
			'UPDATE assignments SET title = $1, description = $2 WHERE assignment_id = $3 RETURNING *',
			[title, description, assignmentId]
		);

		if (updateResult.rows.length === 0) {
			return NextResponse.json(
				{ error: 'Assignment not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(updateResult.rows[0]);
	} catch (error) {
		console.error('Error updating assignment:', error);
		return NextResponse.json(
			{ error: 'Failed to update assignment' },
			{ status: 500 }
		);
	}
}

// DELETE: Delete assignment
export async function DELETE(
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
		const deleteResult = await db.query(
			'DELETE FROM assignments WHERE assignment_id = $1 RETURNING *',
			[assignmentId]
		);

		if (deleteResult.rowCount === 0) {
			return NextResponse.json(
				{ error: 'Assignment not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			message: 'Assignment deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting assignment:', error);
		return NextResponse.json(
			{ error: 'Failed to delete assignment' },
			{ status: 500 }
		);
	}
}
