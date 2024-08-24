'use client';

import Image from 'next/image';
import SignInForm from '@/components/Login/SignInForm';
import SignupForm from '@/components/Login/SignUpForm';
import { useState } from 'react';

export default function LoginPage() {
	const [isSignUp, setIsSignUp] = useState(false);

	const handleToggle = () => {
		setIsSignUp(!isSignUp);
	};

	return (
		<div className="flex h-screen">
			{/* Left side - White background with dotted light effect */}
			<div className="w-1/2 flex-1 bg-white flex flex-col justify-between relative overflow-hidden">
				{/* Dotted Light Effect */}
				<div className="absolute inset-0 w-full h-full">
					<div
						className="absolute top-0 right-0 w-full h-full"
						style={{
							backgroundSize: '30px 30px',
							backgroundImage:
								'radial-gradient(circle, rgba(242, 202, 0, 1) 2px, transparent 2px)',
							maskImage: 'linear-gradient(to bottom left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 40%)',
							clipPath: 'circle(64.3% at 100% 0)',
						}}
					></div>
				</div>

				<div className="p-16 pt-20 relative z-10">
					<h1 className="text-8xl font-bold text-drexel-blue font-miller-display">
						Drexel Learn
					</h1>
					<p className="text-4xl text-drexel-yellow font-futura-medium mt-4">
						AMBITION CAN&apos;T WAIT
					</p>
				</div>
				<div className="p-8 pb-0 -bottom-6 flex justify-center relative z-10">
					<Image
						src="/drexel-logo-yellow.png"
						alt="Drexel Seal"
						width={900}
						height={100}
					/>
				</div>
			</div>

			{/* Right side - Rounded grey box with form */}
			<div className="flex-1 bg-gray-200 flex flex-col justify-center items-center rounded-tl-3xl rounded-bl-3xl relative overflow-hidden">
				{/* Dotted Light Effect in Bottom Left */}
				<div className="absolute inset-0 w-full h-full">
					<div
						className="absolute bottom-0 left-0 w-full h-full"
						style={{
							backgroundSize: '30px 30px',
							backgroundImage:
								'radial-gradient(circle, rgba(0, 47, 108, 0.5) 2px, transparent 2px)', // Drexel Blue color
							maskImage: 'linear-gradient(to top right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 40%)',
							clipPath: 'circle(64.3% at 0 100%)',
						}}
					></div>
				</div>

				<div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg z-10">
					<div className="flex justify-between items-center">
						<h2 className="text-3xl font-bold text-drexel-blue">
							{isSignUp
								? 'Sign Up'
								: 'Sign In'}
						</h2>
						<button
							className="text-sm text-drexel-blue hover:text-drexel-yellow"
							onClick={handleToggle}
						>
							{isSignUp
								? 'Already have an account? Sign In'
								: 'Not a member? Sign Up'}
						</button>
					</div>
					<div className="mt-8">
						{isSignUp ? (
							<SignupForm />
						) : (
							<SignInForm />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
