'use client';

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const SignupForm: React.FC = () => {
	const { isLoaded, signUp, setActive } = useSignUp();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [isFaculty, setIsFaculty] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isLoaded) return;

		if (!emailAddress.endsWith('@drexel.edu')) {
			setError('Only Drexel email addresses are allowed.');
			return;
		}

		try {
			const result = await signUp.create({
				emailAddress,
				password,
				firstName,
				lastName,
				unsafeMetadata: {
					role: isFaculty ? 'faculty' : 'student',
				},
			});

			if (result.status === 'complete') {
				await setActive({ session: result.createdSessionId });
				router.push('/courses');
			} else {
				setError('Signup failed. Please check your details and try again.');
			}
		} catch (err: any) {
			setError('Signup failed. Please check your details and try again.');
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4"
		>
			<div>
				<label htmlFor="firstName">First Name</label>
				<input
					id="firstName"
					type="text"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					className="p-2 border rounded"
					required
				/>
			</div>
			<div>
				<label htmlFor="lastName">Last Name</label>
				<input
					id="lastName"
					type="text"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					className="p-2 border rounded"
					required
				/>
			</div>
			<div>
				<label htmlFor="email">Email Address</label>
				<input
					id="email"
					type="email"
					value={emailAddress}
					onChange={(e) => setEmailAddress(e.target.value)}
					className="p-2 border rounded"
					required
				/>
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="p-2 border rounded"
					required
				/>
			</div>
			<div>
				<label>
					<input
						type="checkbox"
						checked={isFaculty}
						onChange={() => setIsFaculty(!isFaculty)}
					/>
					Faculty
				</label>
			</div>
			{error && <p className="text-red-500">{error}</p>}
			<button
				type="submit"
				className="bg-blue-500 text-white p-2 rounded"
			>
				Sign Up
			</button>
		</form>
	);
};

export default SignupForm;
