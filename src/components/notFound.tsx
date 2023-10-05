import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <>
    <div className='w-4/5 mx-auto mt-20 flex flex-col justify-center items-center space-y-4'>
    <h1 className='text-3xl font-semibold text-center'>Ooops.... 
     - Sorry Given ID is Not Found -</h1>
    <h4 className='py-10 text-xl text-danger font-semibold capitalize'>
      Please check the given id...
    </h4>
    <div className='space-x-4 text-xl'>
      <Link
        className='  hover:text-success duration-300'
        href='/'
      >
        Home
      </Link>
    </div>
  </div>
  </>
  )
}

export default NotFound