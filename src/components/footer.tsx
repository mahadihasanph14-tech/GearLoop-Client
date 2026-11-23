import Link from "next/link";
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link href="/" className="brand">
          Gear<span>Loop</span>
        </Link>
        <p>Rent smarter. Build bigger.</p>
      </div>
      <p>
        © {new Date().getFullYear()} GearLoop. Equipment access, made simple.
      </p>
    </footer>
  );
}
