import Link from "next/link";

const Navbar = () => {
  return (
    <>
        <nav className="space-x-4">
        <Link href="/pairs" className="text-blue-500">Управление парами</Link>
        <Link href="/analytics" className="text-blue-500">Аналитика</Link>
      </nav>
    </>
  );
};

export default Navbar;