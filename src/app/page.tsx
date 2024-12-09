import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Криптовалютные Курсы</h1>
      <nav className="space-x-4">
        <Link href="/pairs" className="text-blue-500">Управление парами</Link>
        <Link href="/analytics" className="text-blue-500">Аналитика</Link>
      </nav>
    </div>
  );
};

export default HomePage;
