import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(
	process.env.NEXT_PUBLIC_POST_LOGIN_ROUTES?.split(',') || []
);

export default clerkMiddleware((auth, req) => {
	const { userId } = auth();
	const url = req.nextUrl;
	let response;

	if (isProtectedRoute(req)) {
		if (!userId) {
			response = NextResponse.redirect(new URL('/', req.url));
		} else {
			response = NextResponse.next();
		}
	} else {
		response = NextResponse.next();
	}

	response.headers.set('X-Pathname', url.pathname);

	return response;
});

export const config = {
	matcher: [
		// Ensure the matcher covers the correct routes
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
	],
};
