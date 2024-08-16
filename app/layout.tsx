'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar/Navbar';
import { usePathname } from 'next/navigation';
import GlobalLayout from '@/components/Layouts/GlobalLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const pageTitle = pathname.split('/')[1].charAt(0).toUpperCase() + pathname.split('/')[1].slice(1);

	const postLoginRoutes = process.env.NEXT_PUBLIC_POST_LOGIN_ROUTES?.split(',') || [];

	const isPostLoginPage = postLoginRoutes.some((route) => pathname.startsWith(route));

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
					<GlobalLayout>
						<div className="flex h-screen">
							{isPostLoginPage ? (
								<>
									<Navbar />
									<main className="flex-1">
										<div className="pt-9 px-14">
											<h1 className="font-bold text-6xl font-miller-display text-drexel-blue">
												{pageTitle}
											</h1>
											<hr className="w-[80%] mt-5 mb-12 -mx-3" />
											{children}
										</div>
									</main>
								</>
							) : (
								<main className="flex-1">{children}</main>
							)}
						</div>
					</GlobalLayout>
				</ClerkProvider>
			</body>
		</html>
	);
}
