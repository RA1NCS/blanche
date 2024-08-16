import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(process.env.NEXT_PUBLIC_POST_LOGIN_ROUTES?.split(',') || []);

export default clerkMiddleware((auth, req) => {
	const { userId } = auth();
	const url = req.nextUrl;
	const loginRoute = new URL('/', req.url);
	const coursesRoute = new URL('/courses', req.url);

	// If user is authenticated and is on the login page, redirect to /courses
	if (userId && url.pathname === '/') {
		return NextResponse.redirect(coursesRoute);
	}

	// If user is not authenticated and tries to access a protected route, redirect to login
	if (isProtectedRoute(req) && !userId) {
		return NextResponse.redirect(loginRoute);
	}

	// Proceed as normal
	const response = NextResponse.next();
	response.headers.set('X-Pathname', url.pathname);
	return response;
});

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
	],
};
