'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import ProspectEnrollTimeline from '@/components/ProspectEnrollTimeline';
import { logout } from '@/lib/auth';
import { getAuthToken } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

export default function UserPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectSetRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !redirectSetRef.current) {
      console.log(`stting redirrect: ${window.location.pathname}`);
      localStorage.setItem('redirectAfterSignIn', window.location.pathname);
      redirectSetRef.current = true;
    }
  }, []);


  useEffect(() => {
    const fetchperson = async () => {
      try {
        const response = await fetch(`/api/user/${id}`, {
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
          throw new Error('Failed to fetch person');
        }

        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error('Error fetching person:', error);
        setError(error.message);
      } finally {
        setFetching(false);
        const redirectUrl = localStorage.getItem('redirectAfterSignIn')
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterSignIn')
        } 
      }
    };

    if (!loading) {
      fetchperson();
    }

  }, [id, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  if (fetching) {
    return <div>Fetching...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {person ? (
             <ProspectEnrollTimeline data={person} width={800} height={400} />

      ) : (
        <div>Person not found</div>
      )}
    </div>
  );
}
