import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
	'/courses(.*)',
	'/deadlines(.*)',
	'/assignments(.*)',
	'/grades(.*)',
]);

export default clerkMiddleware((auth, req) => {
	const { userId } = auth();

	if (isProtectedRoute(req)) {
		if (!userId) {
			return NextResponse.redirect(new URL('/', req.url));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
	],
};
