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

		// Extract the part before @drexel.edu for the username
		const username = emailAddress.split('@')[0];

		try {
			console.log(
				emailAddress.trim(),
				password.trim(),
				firstName.trim(),
				lastName.trim(),
				username,
				isFaculty ? 'professor' : 'student'
			);

			const result = await signUp.create({
				emailAddress: emailAddress.trim(),
				password: password.trim(),
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				username: username,
				unsafeMetadata: {
					role: isFaculty ? 'professor' : 'student',
				},
			});

			if (result.status === 'complete') {
				await setActive({
					session: result.createdSessionId,
				});
				router.push('/courses');
			} else {
				console.error('Sign-up not completed:', result);
				setError(
					'Signup failed. Please check your details and try again.'
				);
			}
		} catch (err: any) {
			console.error(
				'Signup failed:',
				err.response?.data || err.message
			);
			setError(
				'Signup failed. Please check your details and try again.'
			);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4"
		>
			<div className="flex justify-between gap-4">
				<div className="flex-1">
					<label
						htmlFor="firstName"
						className="block text-base font-medium leading-6 text-drexel-yellow mb-1"
					>
						First Name
					</label>
					<input
						id="firstName"
						type="text"
						value={firstName}
						onChange={(e) =>
							setFirstName(e.target.value)
						}
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-drexel-blue sm:text-base sm:leading-6"
						required
					/>
				</div>

				<div className="flex-1">
					<label
						htmlFor="lastName"
						className="block text-base font-medium leading-6 text-drexel-yellow mb-1"
					>
						Last Name
					</label>
					<input
						id="lastName"
						type="text"
						value={lastName}
						onChange={(e) =>
							setLastName(e.target.value)
						}
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-drexel-blue sm:text-base sm:leading-6"
						required
					/>
				</div>
			</div>

			<div>
				<label
					htmlFor="email"
					className="block text-base font-medium leading-6 text-drexel-yellow mb-1"
				>
					Email address
				</label>
				<div className="mt-2">
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						value={emailAddress}
						onChange={(e) =>
							setEmailAddress(
								e.target.value
							)
						}
						required
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-drexel-blue sm:text-base sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label
					htmlFor="password"
					className="block text-base font-medium leading-6 text-drexel-yellow mb-1"
				>
					Password
				</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-drexel-blue sm:text-base sm:leading-6"
					required
				/>
			</div>

			<div className="flex items-center mt-1">
				<input
					className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
					type="checkbox"
					checked={isFaculty}
					onChange={() => setIsFaculty(!isFaculty)}
				/>
				<label className="ml-3 text-base font-medium leading-6 text-drexel-yellow">
					Are you a professor?
				</label>
			</div>

			{error && <p className="text-red-500 mt-2">{error}</p>}

			<button
				type="submit"
				className="flex w-full justify-center rounded-md transition-all bg-drexel-blue px-3 py-1.5 text-base font-semibold leading-6 text-white shadow-sm hover:bg-[#02224d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-drexel-blue mt-4"
			>
				Sign Up
			</button>
		</form>
	);
};

export default SignupForm;
