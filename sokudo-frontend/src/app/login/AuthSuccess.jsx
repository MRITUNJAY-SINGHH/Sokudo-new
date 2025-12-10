'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserAfterGoogle } from '../features/user/UserSlice';

const AuthSuccess = () => {
   const dispatch = useDispatch();
   const router = useRouter();

   useEffect(() => {
      const token = new URLSearchParams(window.location.search).get('token');

      if (!token) {
         router.replace('/login');
         return;
      }

      const fetchUser = async () => {
         try {
            const backend = process.env.NEXT_PUBLIC_API_URL;

            const res = await axios.get(`${backend}/customers/me`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            dispatch(
               setUserAfterGoogle({
                  user: res.data,
                  token: token,
               })
            );

            router.replace('/');
         } catch (err) {
            console.log(err);
            router.replace('/login');
         }
      };

      fetchUser();
   }, [dispatch, router]);

   return <p className='text-center mt-8'>Logging you in…</p>;
};

export default AuthSuccess;
