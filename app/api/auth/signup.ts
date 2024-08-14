import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { firstName, lastName, email, password, role } = req.body;

	try {
		const signUp = await clerkClient.signUp.create({
			emailAddress: email,
			password,
			firstName,
			lastName,
			unsafeMetadata: {
				role,
			},
		});

		if (signUp.status === 'complete') {
			// Signup successful
			res.status(200).json({ message: 'Signup successful', sessionId: signUp.createdSessionId });
		} else {
			// Signup failed
			res.status(401).json({ message: 'Signup failed' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong', error });
	}
}
