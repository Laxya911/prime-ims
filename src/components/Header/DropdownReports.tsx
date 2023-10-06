import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const DropdownReports = () => {
  const session = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  if (session.status === "authenticated" && session.data && session.data.user) {
    return (
      <div className="relative">
        <button
          ref={trigger}
          onClick={(e) => {
            e.preventDefault();
            setDropdownOpen(!dropdownOpen);
          }}
          aria-label="report dropdown"
          className="flex items-center gap-4"
        >
          <span className=" text-right ">
            <span className="block text-sm font-medium text-black dark:text-white">
             Reports
            </span>
          </span>
         
          <svg
            className=" fill-current "
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
              fill=""
            />
          </svg>
        </button>

        {/* <!-- Dropdown Start --> */}
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute right-0 mt-5 flex w-34.5 flex-col rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
            dropdownOpen === true ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col gap-4 border-b border-stroke px-4 py-1.5 dark:border-strokedark">
            <li>
              <Link
                href="/invoice/view"
                className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                Invoices
              </Link>
            </li>
            {/* <li>
              <Link
                href="/consignment/viewConsignments"
                className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
               Consignments
              </Link>
            </li> */}
            <li>
              <Link
                href="/vendor"
                className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
               Vendor
              </Link>
            </li>
            <li>
              <Link
                href="/customer"
                className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
               Customer
              </Link>
            </li>
            <li>
              <Link
                href="/purchase"
                className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
               New Purchase
              </Link>
            </li>
            <li>
              <Link
                href="/purchase/view"
                className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
               View Purchase
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
               Add Product
              </Link>
            </li>
            <li>
              <Link
                href="/products/view"
                className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
              View Products
              </Link>
            </li>
          </ul>
        </div>
        {/* <!-- Dropdown End --> */}
      </div>
    );
  }
  };
export default DropdownReports;
