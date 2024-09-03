import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
	const newAssignment = await request.json();

	try {
		const result = await db.query(
			`INSERT INTO assignments (course_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *`,
			[
				newAssignment.course_id,
				newAssignment.title,
				newAssignment.description,
				newAssignment.due_date,
			]
		);

		return NextResponse.json(result.rows[0]);
	} catch (error) {
		console.error('Error creating assignment:', error);
		return NextResponse.json(
			{ error: 'Failed to create assignment' },
			{ status: 500 }
		);
	}
}
