import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
	request: Request,
	{ params }: { params: { courseId: string } }
) {
	const { courseId } = params;

	try {
		const res = await db.query(
			'SELECT * FROM courses WHERE course_id = $1',
			[courseId]
		);
		return NextResponse.json(res.rows[0]);
	} catch (error) {
		console.error(`Error fetching course ${courseId}:`, error);
		return NextResponse.error();
	}
}
