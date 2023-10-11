import Link from "next/link";
import React from "react";

const Denied = () => {
  return (
    <>
      <div className='w-4/5 mx-auto p-50 flex flex-col justify-center items-center space-y-4'>
      <div className="flex text-5xl text-danger flex-col items-center justify-center mb-6">
        Unauthorized
      </div>
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
  );
};

export default Denied;
