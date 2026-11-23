import Link from "next/link";
export default function Cancel() {
  return (
    <div className="container empty">
      <h1>Checkout cancelled</h1>
      <p>
        No successful payment was recorded. You can return to the equipment
        listing and try again.
      </p>
      <Link className="button" href="/equipment">
        Browse equipment
      </Link>
    </div>
  );
}
