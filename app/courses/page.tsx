import Navbar from "@/components/Navbar/Navbar";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div> You are not logged in </div>;
  }

  return (
    <div>
      <h1>Welcome</h1>
      <ul>
        <li>
          <span>First Name:</span> {user.firstName}
        </li>
        <li>
          <span>Last Name:</span> {user.lastName}
        </li>
      </ul>
    </div>
  );
}
