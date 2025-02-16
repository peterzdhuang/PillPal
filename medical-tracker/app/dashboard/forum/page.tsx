'use client';
import { useGlobalContext } from '@/app/layout';
import React from 'react';

const ForumPage: React.FC = () => {
    const {user} = useGlobalContext()
  return (
    <div className="relative w-full h-screen">
      <div className="bg-teal-500 text-white text-center p-2 shadow-lg">
        <a 
          href={`/dashboard/${user}`} 
          className="text-white text-lg font-bold hover:text-white transition-colors"
        >
          ← Back to Main Website
        </a>
      </div>

      <iframe
        src="https://capsulecorner.freeflarum.com"
        className="absolute top-0 left-0 w-full h-full mt-10"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default ForumPage;