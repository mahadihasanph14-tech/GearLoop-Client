import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container empty">
      <h1>Page not found</h1>
      <p>The page may have moved.</p>
      <Link className="button" href="/">
        Back to home
      </Link>
    </div>
  );
}
