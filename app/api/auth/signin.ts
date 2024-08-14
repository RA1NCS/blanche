import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { email, password } = req.body;

	try {
		const signIn = await clerkClient.signIn.create({
			identifier: email,
			password,
		});

		if (signIn.status === 'complete') {
			// Authentication successful
			res.status(200).json({ message: 'Login successful', sessionId: signIn.createdSessionId });
		} else {
			// Authentication failed
			res.status(401).json({ message: 'Invalid credentials' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong', error });
	}
}
