'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	const postLoginRoutes =
		process.env.NEXT_PUBLIC_POST_LOGIN_ROUTES?.split(',') || [];

	const showNavBar = postLoginRoutes.includes(pathname);

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
						{showNavBar && <Navbar />}
						<main className="flex-1">
							{children}
						</main>
					</div>
				</ClerkProvider>
			</body>
		</html>
	);
}