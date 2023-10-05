import Link from 'next/link';

export default function UnAthorized() {
  return (
    <>
      <div className='w-4/5 mx-auto mt-20 flex flex-col justify-center items-center space-y-4'>
        <h1 className='text-3xl font-semibold text-center'>Ooops.... 
         - Sorry Not Allowed -</h1>
        <h4 className='py-10 text-lg text-danger font-semibold capitalize'>
          The Danger Zone is here...
        </h4>
        <div className='space-x-4 text-xl'>
          <Link
            className='  hover:text-success duration-300'
            href='/'
          >
            Home
          </Link>
        
          <Link
            className='   hover:text-success duration-300'
            href='/contact'
          >
            Contact Us 
          </Link>
        </div>
      </div>
    </>
  );
}