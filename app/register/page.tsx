import React from "react";
import Link from "next/link";

const Register = () => (
  <div>
    <h1>Register</h1>
    <form action="">
      <div>
        <input type="text" />
        <label htmlFor="">Your Name</label>
      </div>
      <div>
        <input type="email" />
        <label htmlFor="">Your Email</label>
      </div>
      <div>
        <input type="password" />
        <label htmlFor="">Your Password</label>
      </div>
      <button type="submit">Register</button>
      <div>
        <span>
          Already have an account? <Link href="/">Login here</Link>
        </span>
      </div>
    </form>
  </div>
);

export default Register;
