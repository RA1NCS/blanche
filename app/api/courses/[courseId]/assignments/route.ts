import { NextResponse } from 'next/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
	const { courseId } = params;

	try {
		const result = await db.query('SELECT * FROM assignments WHERE course_id = $1', [courseId]);

		return NextResponse.json(result.rows);
	} catch (error) {
		console.error('Error fetching assignments:', error);
		return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
	}
}

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
	const user = await currentUser();
	const { courseId } = params;

	if (!user) {
		return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
	}

	const { title, description, dueDate, isPrivate } = await request.json();

	if (!title || !description || !dueDate) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		// Check if the user is an instructor
		const role = user.unsafeMetadata?.role;
		if (role !== 'instructor') {
			return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
		}

		// Verify that the course belongs to the instructor
		const course = await db.query('SELECT * FROM courses WHERE course_id = $1 AND instructor_id = $2', [
			courseId,
			user.id,
		]);

		if (course.rows.length === 0) {
			return NextResponse.json(
				{ error: 'Course not found or you do not have permission' },
				{ status: 404 }
			);
		}

		// Insert the new assignment into the database
		const result = await db.query(
			`INSERT INTO assignments (course_id, title, description, due_date, is_private) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[courseId, title, description, dueDate, isPrivate || false]
		);

		return NextResponse.json(result.rows[0], { status: 201 });
	} catch (error) {
		console.error('Error creating assignment:', error);
		return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
	}
}
