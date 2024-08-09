import Navbar from '@/components/Navbar/Navbar';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<div className="flex h-screen">
					<Navbar />
					<main className="flex-1 p-10">
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
