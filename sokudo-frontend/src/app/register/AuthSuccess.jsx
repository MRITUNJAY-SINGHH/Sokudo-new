'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/user/UserSlice.js';

export default function AuthSuccess() {
   const router = useRouter();
   const dispatch = useDispatch();

   useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');
      const name = searchParams.get('name');
      const email = searchParams.get('email');
      const avatar = searchParams.get('avatar');

      if (!token) {
         console.error('No token found in URL');
         return;
      }

      localStorage.setItem('token', token);
      if (name) localStorage.setItem('name', name);
      if (email) localStorage.setItem('email', email);
      if (avatar) localStorage.setItem('avatar', avatar);

      dispatch(
         setCredentials({
            token,
            user: { name, email, avatar },
         })
      );

      router.replace('/account');
   }, [dispatch, router]);

   return <div>Logging you in...</div>;
}
