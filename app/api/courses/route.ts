import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
	try {
		const res = await db.query('SELECT * FROM courses');
		return NextResponse.json(res.rows);
	} catch (error) {
		console.error('Error fetching courses:', error);
		return NextResponse.error();
	}
}
