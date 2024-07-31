'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { getAuthToken } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${await getAuthToken()}` // We'll create this function
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized, redirect to login
            router.push('/signin');
            return;
          }
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    if (!loading) {
      fetchUsers();
    }
  }, [user, loading, router]);

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

      <h1 className="text-2xl font-bold">User List</h1>
      {users && users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users &&
            users.map((user) => (
              <li key={user.id} className="py-2 border-b">
                {user.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default UsersPage;
