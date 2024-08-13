import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import SignInForm from '@/components/Login/SignInForm';

export default async function CustomLoginPage() {
	const { userId } = auth();

	if (userId) {
		redirect('/courses');
		return null;
	}

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
					<SignInForm />
				</div>
			</div>
		</div>
	);
}
