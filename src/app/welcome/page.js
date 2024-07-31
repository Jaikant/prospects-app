'use client';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth'; // adjust this import based on your project structure

function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/signin');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="p-4">
      <button onClick={handleLogout} className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  );
}

export default WelcomePage;
