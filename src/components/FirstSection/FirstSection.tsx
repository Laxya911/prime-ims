"use client";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaEye, FaUserPlus } from "react-icons/fa";
import Api from "@/app/commonApi/dashApi";
import AuthUser from "@/utils/auth";

const FirstSec = () => {
  const { isSuperAdmin, isAuthorized, session } = AuthUser();
  if (session.status === "unauthenticated") {
    redirect("/auth/signin");
  }
  const {
    totalInvoices,
    totalVendor,totalQuotations,
    totalCustomers,
    totalProducts,
    totalUsers,
    totalCompanies,
    totalPurchase,
  } = Api();
  // console.log(session);


  const router = useRouter();
  const handleUpdateUser = async (id: string) => {
    try {
      const response = await axios.get(`/api/users/${session?.data?.user.id}`);
      const userData = response.data;
      router.push(`/users/${id}`, { state: { userData } } as any);
      // console.log(userData);
    } catch (error) {
      console.error(error);
    }
  };

  if (session.status === "authenticated" && session.data && session.data.user) {
    return (
      <div>
        <div className="flex  md:flex-row justify-center text-center py-4 gap-2 lg:gap-8">
          <h3 className=" text-xl"> Welcome {session.data.user.name} </h3>
          <button
            type="button"
            onClick={() => handleUpdateUser(session?.data?.user.id)}
            className="shadow-lg px-3 py-1 rounded-full bg-amber text-gray"
          >
            Update Profile
          </button>
        </div>

        <div className="  grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-8 2xl:gap-7.5">
          <div className="flex shadow flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Quotations {totalQuotations}
            </span>
            <div className="flex  gap-12 mt-2 ">
              <Link
                href="/quotation"
                className="inline-flex items-center  px-3 py-2   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/quotation/view"
                className="inline-flex items-center px-3 py-2 rounded  hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Invoices {totalInvoices}
            </span>
            <div className="flex  gap-12 mt-2 ">
              <Link
                href="/invoice"
                className="inline-flex items-center  px-3 py-2   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/invoice/view"
                className="inline-flex items-center px-3 py-2 rounded  hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Vendors {totalVendor}
            </span>
            <div className="flex  gap-12 mt-2 ">
              <Link
                href="/vendor"
                className="inline-flex items-center  px-3 py-2   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/vendor"
                className="inline-flex items-center px-3 py-2 rounded  hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow   flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Customer {totalCustomers}
            </span>
            <div className="flex  gap-12 mt-2 ">
              <Link
                href="/customer"
                className="inline-flex  items-center  px-3 py-2   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/customer"
                className="inline-flex items-center px-3 py-2 rounded    hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow   flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Products {totalProducts}
            </span>
            <div className="flex  gap-12 mt-2 ">
              <Link
                href="/products"
                className="inline-flex  items-center  px-3 py-2   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/products/view"
                className="inline-flex items-center px-3 py-2 rounded    hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow   flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Purchases {totalPurchase}
            </span>
            <div className="flex  gap-12 mt-2 ">
              <Link
                href="/purchase"
                className="inline-flex  items-center  px-3 py-2   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/purchase/view"
                className="inline-flex items-center px-3 py-2 rounded    hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>

          {isAuthorized && (
            <>
              <div className="flex shadow   flex-col items-center py-2 border rounded-lg hover:scale-105 transition-transform duration-300   ">
                <span className="text-md py-1  font-medium">
                  Users {totalUsers}
                </span>
                <div className="flex  gap-12 mt-2 ">
                  <Link
                    href="/auth/signup"
                    className="inline-flex  items-center  px-3 py-2   rounded hover:bg-success  "
                  >
                    <FaUserPlus />
                  </Link>
                  <Link
                    href="/users"
                    className="inline-flex items-center px-3 py-2 rounded    hover:bg-success"
                  >
                    <FaEye />
                  </Link>
                </div>
              </div>
            </>
          )}
          {isSuperAdmin && (
            <>
              <div className="flex shadow   flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
                <span className="text-md py-1  font-medium">
                  Companies {totalCompanies}
                </span>
                <div className="flex  gap-12 mt-2 ">
                  <Link
                    href="/company"
                    className="inline-flex  items-center  px-3 py-2   rounded hover:bg-success  "
                  >
                    <FaUserPlus />
                  </Link>
                  <Link
                    href="/company/viewCompany"
                    className="inline-flex items-center px-3 py-2 rounded    hover:bg-success"
                  >
                    <FaEye />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default FirstSec;