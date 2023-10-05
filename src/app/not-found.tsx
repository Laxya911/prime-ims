import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div className='w-4/5 mx-auto mt-20 flex flex-col justify-center items-center space-y-4'>
        <h1 className='text-3xl font-semibold'>404 - Page Not Found</h1>
        <h4 className='py-10 text-2xl  font-semibold capitalize'>
          The Loneliness and Emptiness is here...
        </h4>
     
        <div className='space-x-4'>
          <Link
            className='underline text-primary hover:text-success duration-300'
            href='/'
          >
            Homepage
          </Link>
      
        </div>
      </div>
    </>
  );
}