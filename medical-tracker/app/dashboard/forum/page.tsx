'use client';
import { useGlobalContext } from '@/app/layout';
import React from 'react';

const ForumPage: React.FC = () => {
    const {user} = useGlobalContext()
  return (
    <div className="relative w-full h-screen">

      <iframe
        src="https://capsulecorner.freeflarum.com"
        className="absolute top-0 left-0 w-full h-full mt-10"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default ForumPage;