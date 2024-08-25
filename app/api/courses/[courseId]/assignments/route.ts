import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
	request: Request,
	{ params }: { params: { courseId: string } }
) {
	const { courseId } = params;

	try {
		const result = await db.query(
			'SELECT * FROM assignments WHERE course_id = $1',
			[courseId]
		);

		return NextResponse.json(result.rows);
	} catch (error) {
		console.error('Error fetching assignments:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch assignments' },
			{ status: 500 }
		);
	}
}
