'use client';
import React from 'react';

const ForumPage: React.FC = () => {
  return (
    <div className="relative w-full h-screen">
      <div className="bg-purple-500 text-white text-center p-2 shadow-lg">
        <a 
          href="/" 
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