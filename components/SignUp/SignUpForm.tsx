import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SignUpForm: React.FC = () => {
	return (
		<div className="-mt-6 flex min-h-full flex-col justify-center px-6 py-12">
			<div className="mx-auto w-full max-w-sm">
				<Image
					className="mx-auto h-30 w-auto"
					src="/seal.png"
					alt="Drexel Seal"
					width={300}
					height={300}
				/>
			</div>

			<div className="mt-10 mx-auto w-[80%]">
				<form
					className="space-y-6"
					action="#"
					method="POST"
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
								<Link
									href="#"
									className="font-semibold text-drexel-yellow hover:text-indigo-500"
								>
									Forgot password?
								</Link>
							</div>
						</div>
						<div className="mt-2">
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-drexel-blue sm:text-base sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md transition-all bg-drexel-blue px-3 py-1.5 text-base font-semibold leading-6 text-white shadow-sm hover:bg-[#02224d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-drexel-blue"
						>
							Sign in
						</button>
					</div>

					<p className="mt-10 text-basetext-center text-base text-gray-100">
						Not a member?
						<a
							href="#"
							className="ml-2 text-base font-semibold leading-6 transition-all text-drexel-yellow hover:text-[#fcd81e]"
						>
							Sign Up Here
						</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignUpForm;
