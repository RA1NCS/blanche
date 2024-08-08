import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
	try {
		const result = await db.query('SELECT * FROM USERS');
		return NextResponse.json({
			message: result,
			timestamp: result.rows[0].now,
		});
	} catch (error) {
		console.error('Database connection error:', error);
		return NextResponse.json(
			{ message: 'Database connection error' },
			{ status: 500 }
		);
	}
}
