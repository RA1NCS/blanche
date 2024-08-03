import React from 'react';
import Link from 'next/link';

const Login = () => (
	<div>
		<h1>Login</h1>
		<form action="">
			<div>
				<input type="email" />
				<label htmlFor="">Your Email</label>
			</div>
			<div>
				<input type="password" />
				<label htmlFor="">Your Password</label>
			</div>
			<div>
				<div>
					<input
						type="checkbox"
						name=""
						id="rememberMe"
					/>
					<label htmlFor="rememberMe">
						Remember Me
					</label>
				</div>
				<span>Forgot Password?</span>
			</div>
			<button type="submit">Login</button>
			<div>
				<span>
					New Here?{' '}
					<Link href="/register">
						Create an Account
					</Link>
				</span>
			</div>
		</form>
	</div>
);

export default function Home() {
	return (
		<div
			className="text-white h-[100vh] flex justify-center items-center bg-cover"
			style={{ background: "url('/bg.jpg')" }}
		>
			<Login />
		</div>
	);
}
