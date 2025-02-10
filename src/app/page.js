import Logo from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <div
      style={{
        backgroundImage: 'url(/flash/flashbg.jfif)', // Ensure the path is correct
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
      }}
      className="min-h-screen flex justify-center items-center text-white"
    >
      <main className="flex flex-col items-center justify-between p-6 md:p-24 gap-10">

        <Logo textwhite={true} />
        <div className="text-center max-w-[354px] px-4">
          <h1 className="text-[32px] font-bold">Rimcollian Alumnus Community</h1>
          <p className="mt-4 text-[16px]">
            Connecting alumni, fostering bonds, and celebrating the legacy of Rimcollians worldwide.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/signup" className="bg-[#131A45] text-center hover:bg-[#1a2154] text-white text-sm font-bold py-3 w-[150px] px-10 rounded-lg">
            Join
          </Link>
          <Link href="/login" className="bg-[#FFFFFF] text-center hover:bg-gray-200 text-[#131A45] text-sm font-bold py-3 px-10 w-[150px] rounded-lg">
            Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Page;