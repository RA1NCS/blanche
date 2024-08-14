import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
	const user = await currentUser();

	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	return new Response(JSON.stringify({ firstName: user.firstName }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
