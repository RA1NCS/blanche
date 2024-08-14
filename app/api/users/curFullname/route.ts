import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
	const user = await currentUser();

	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const fullName = `${user.firstName} ${user.lastName}`;

	return new Response(JSON.stringify({ fullName }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
