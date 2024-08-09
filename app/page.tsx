import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="font-bold text-center mt-10">Home page</h1>
      <Link href="/sign-up">Sign up</Link>
      <Link href="/sign-in">Sign in</Link>
    </div>
  );
}
