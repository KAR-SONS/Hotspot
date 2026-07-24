import { redirect } from "next/navigation";

// Google sign-in creates the account on first login, so signup and login
// are the same screen. Keep this route so links/buttons on the homepage
// that point to /signup still work.
export default function SignupPage() {
  redirect("/login");
}