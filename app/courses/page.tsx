import { auth, currentUser } from '@clerk/nextjs/server';

export default async function Home() {
	const user = await currentUser();

	if (!user) {
		return null;
	}

	return (
		<div>
			<h1>Welcome</h1>
			<ul>
				<li>
					<span>First Name:</span> {user.firstName}
				</li>
				<li>
					<span>Last Name:</span> {user.lastName}
				</li>
			</ul>
		</div>
	);
}
