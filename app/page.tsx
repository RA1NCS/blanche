import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();
  const user = await currentUser();

  if (userId) {
    // Redirect the user to the /courses page
    redirect("/courses");
    return null;
  }

  return (
    <div>
      <h1 className="font-bold text-center mt-10">Home page</h1>
      <div className="text-center">
        <Link href="/sign-up">Sign up</Link>
        <br />
        <Link href="/sign-in">Sign in</Link>
      </div>
    </div>
  );
}
