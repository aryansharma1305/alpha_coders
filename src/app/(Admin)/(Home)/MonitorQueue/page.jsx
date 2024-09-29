"use client";
import WaitingTime from '@/components/WaitingTime'
import React from 'react'
import { useRouter } from 'next/navigation';

export default function index() {
  const router = useRouter();
  return (
    <div className='flex flex-col min-h-screen'>
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center w-full">
        <h1 className="text-3xl font-semibold">Monitor Patient Queue</h1>
        <button
          className="mt-2 text-md bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          onClick={() => router.push('/AdminHome')}
        >
          Back to Admin Home
        </button>
      </header>
        <WaitingTime />
    </div>
  )
}
