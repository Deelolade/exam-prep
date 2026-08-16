
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-black">Welcome to Exam Prep</h1>
      <Link href="/auth/sign-up">
        <button>Get Started</button>
      </Link>
    </div>
  );
}
