'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignInForm from '@/components/Login/SignInForm';
import SignupForm from '@/components/Login/SignUpForm';
import { useAuth } from '@clerk/nextjs';

export default function HomePage() {
	const [isSignUp, setIsSignUp] = useState(false);
	const router = useRouter();
	const { isSignedIn } = useAuth();

	useEffect(() => {
		if (isSignedIn) {
			router.push('/courses');
		}
	}, [isSignedIn, router]);

	const handleToggle = () => {
		setIsSignUp(!isSignUp);
	};

	return (
		<div
			className="flex flex-col justify-center items-center h-screen bg-white bg-cover bg-center"
			style={{ backgroundImage: 'url(/bg.jpg)' }}
		>
			<div className="text-center">
				<h1 className="text-8xl text-drexel-blue font-bold font-miller-display drop-shadow-[0_0px_1.3px_rgba(255,255,255,255.8)]">
					Drexel Learn
				</h1>
			</div>

			<div className="relative h-[70%] w-[50%] border-2 border-gray-200 rounded-3xl flex justify-center items-center p-10 mt-8 bg-black bg-opacity-10 backdrop-blur-lg">
				<p className="absolute -top-6 left-1/2 transform pt-1 -translate-x-1/2 text-drexel-yellow rounded-lg text-4xl uppercase font-futura-medium bg-white px-4 backdrop-blur-lg">
					AMBITION CAN'T WAIT
				</p>
				<div className="w-full flex flex-col justify-center">
					<div className="-mt-6 flex min-h-full flex-col justify-center px-6 py-12">
						<div className="mx-auto w-full max-w-sm">
							<img
								className="mx-auto h-30 w-auto"
								src="/seal.png"
								alt="Drexel Seal"
								width={300}
								height={300}
							/>
						</div>
						<div className="mt-10 mx-auto w-[80%]">
							{isSignUp ? (
								<SignupForm />
							) : (
								<SignInForm />
							)}
						</div>
					</div>

					<div className="mt-4 text-center">
						<p className="text-center text-base text-gray-100">
							{isSignUp
								? 'Already have an account?'
								: 'Not a member?'}
							<button
								onClick={
									handleToggle
								}
								className="text-base ml-2 font-semibold text-drexel-yellow hover:text-[#fcd81e]"
							>
								{isSignUp
									? 'Sign In'
									: 'Sign Up Here'}
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
