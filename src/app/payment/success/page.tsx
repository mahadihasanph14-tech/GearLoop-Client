import Link from "next/link";
export default function Success() {
  return (
    <div className="container empty">
      <h1>Payment submitted</h1>
      <p>
        Your payment is being confirmed securely by Stripe. Check My Rentals for
        the updated booking status.
      </p>
      <Link className="button" href="/dashboard/my-rentals">
        View My Rentals
      </Link>
    </div>
  );
}
