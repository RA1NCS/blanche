import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
	const user = await currentUser();

	if (!user) {
		return NextResponse.json(
			{ error: 'User not authenticated' },
			{ status: 401 }
		);
	}

	try {
		const {
			title,
			description,
			due_date,
			course_id,
			private: isPrivate,
		} = await request.json();

		const insertResult = await db.query(
			'INSERT INTO assignments (course_id, title, description, due_date, private) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[course_id, title, description, due_date, isPrivate]
		);

		return NextResponse.json(insertResult.rows[0]);
	} catch (error) {
		console.error('Error creating assignment:', error);
		return NextResponse.json(
			{ error: 'Failed to create assignment' },
			{ status: 500 }
		);
	}
}
