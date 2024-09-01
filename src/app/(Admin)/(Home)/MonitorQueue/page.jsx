"use client";
import Sidebar from '@/components/Sidebar'
import WaitingTime from '@/components/WaitingTime'
import React from 'react'

export default function index() {
  return (
    <div className='flex min-h-screen'>
        <WaitingTime />
        <a className='text-blue-400 hover:underline fixed top-0' href='/AdminHome'>go back to Admin Page</a>
    </div>
  )
}
