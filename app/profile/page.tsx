import Navbar from '@/components/Navbar/Navbar';

export default function Home() {
	return (
		<div className="flex h-screen">
			<Navbar />
			<main className="flex-1 p-10">
				<h1>User Profile</h1>
			</main>
		</div>
	);
}
