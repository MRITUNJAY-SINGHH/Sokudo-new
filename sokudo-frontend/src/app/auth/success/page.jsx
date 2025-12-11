'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserAfterGoogle } from '../../features/user/UserSlice';

const AuthSuccess = () => {
   const dispatch = useDispatch();
   const router = useRouter();

   useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');

      if (!token) {
         router.replace('/login');
         return;
      }

      const fetchUser = async () => {
         try {
            const backend =
               process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${backend}/customers/me`, {
               headers: { Authorization: `Bearer ${token}` },
            });

            dispatch(
               setUserAfterGoogle({
                  user: res.data,
                  token: token,
               })
            );

            router.replace('/');
         } catch (err) {
            console.log('Google Auth Error:', err);
            router.replace('/login');
         }
      };

      fetchUser();
   }, [dispatch, router]);

   return <p className='text-center mt-8'>Logging you in…</p>;
};

export default AuthSuccess;
