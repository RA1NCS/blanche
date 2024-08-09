import { NextRequest, NextResponse } from 'next/server';

// Example function handling GET requests
export async function GET(request: NextRequest) {
	return NextResponse.json({ message: 'Hello from the API!' });
}

// Example function handling POST requests
export async function POST(request: NextRequest) {
	const body = await request.json();
	return NextResponse.json({ message: 'Data received', data: body });
}
