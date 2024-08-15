'use client';

import React, { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const SignInForm: React.FC = () => {
	const { isLoaded, signIn, setActive } = useSignIn();
	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isLoaded) return;

		try {
			// Attempt to sign in the user with the provided email and password
			const result = await signIn.create({
				identifier: emailAddress,
				password,
			});

			// If sign-in is successful, set the active session and redirect
			if (result.status === 'complete') {
				await setActive({
					session: result.createdSessionId,
				});
				router.push('/courses'); // Redirect to courses page on success
			} else {
				console.error('Login not completed:', result);
				setError(
					'Login failed. Please check your credentials and try again.'
				);
			}
		} catch (err: any) {
			console.error(
				'Login failed:',
				err.response?.data || err.message
			);
			setError(
				'Login failed. Please check your credentials and try again.'
			);
		}
	};

	return (
		<form
			className="space-y-6"
			onSubmit={handleSubmit}
		>
			<div>
				<label
					htmlFor="email"
					className="block text-base font-medium leading-6 text-drexel-yellow"
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
				<div className="flex items-center justify-between">
					<label
						htmlFor="password"
						className="block text-base font-medium leading-6 text-drexel-yellow"
					>
						Password
					</label>
					<div className="text-base">
						<a
							href="#"
							className="font-semibold text-drexel-yellow hover:text-indigo-500"
						>
							Forgot password?
						</a>
					</div>
				</div>
				<div className="mt-2">
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) =>
							setPassword(e.target.value)
						}
						required
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-drexel-blue sm:text-base sm:leading-6"
					/>
				</div>
			</div>

			{error && <p className="text-red-500">{error}</p>}

			<div>
				<button
					type="submit"
					className="flex w-full justify-center rounded-md transition-all bg-drexel-blue px-3 py-1.5 text-base font-semibold leading-6 text-white shadow-sm hover:bg-[#02224d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-drexel-blue"
				>
					Sign in
				</button>
			</div>
		</form>
	);
};

export default SignInForm;
