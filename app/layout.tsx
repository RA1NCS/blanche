import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Whiteboard Learn',
	description: 'A better way to learn.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
					rel="icon"
					href="/favicon.ico"
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
