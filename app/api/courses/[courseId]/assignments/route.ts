import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
	request: Request,
	{ params }: { params: { courseId: string } }
) {
	const { courseId } = params;

	try {
		const res = await db.query(
			'SELECT * FROM assignments WHERE course_id = $1',
			[courseId]
		);
		return NextResponse.json(res.rows);
	} catch (error) {
		console.error(
			`Error fetching assignments for course ${courseId}:`,
			error
		);
		return NextResponse.error();
	}
}
