import type { Metadata } from 'next';
import './globals.css';
import { headers } from 'next/headers';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar/Navbar';

export const metadata: Metadata = {
	title: 'Whiteboard Learn',
	description: 'A better way to learn.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const pathname = headers().get('X-Pathname') || '';

	const noNavbarRoutes = ['/', '/sign-up', '/sign-in'];

	const hideNavbar = noNavbarRoutes.includes(pathname);

	return (
		<html lang="en">
			<head>
				<link
					rel="icon"
					href="/favicon.ico"
				/>
			</head>
			<body>
				<ClerkProvider>
					<div className="flex h-screen">
						{!hideNavbar && <Navbar />}
						<main className="flex-1 p-10">
							{children}
						</main>
					</div>
				</ClerkProvider>
			</body>
		</html>
	);
}
