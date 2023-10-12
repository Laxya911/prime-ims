"use client";
import { redirect } from "next/navigation";
import Link from "next/link";
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

  if (session.status === "authenticated" && session.data && session.data.user) {
    return (
      <>
        <div className="flex  md:flex-row justify-center text-center py-2 mb-4 gap-2 lg:gap-8">
          <h3 className=" text-xl"> Welcome {session.data.user.name}, Good Day 🙏</h3>
        </div>
        <div className=" shadow-2xl shadow-black px-1 rounded dark:shadow-white py-2  grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-8 2xl:gap-7.5">
          <div className="flex shadow flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Quotations {totalQuotations}
            </span>
            <div className="flex  gap-10 mt-2 ">
              <Link
                href="/quotation"
                className="inline-flex items-center  p-1.5   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/quotation/view"
                className="inline-flex items-center p-1.5 rounded  hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Invoices {totalInvoices}
            </span>
            <div className="flex  gap-10 mt-2 ">
              <Link
                href="/invoice"
                className="inline-flex items-center  p-1.5   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/invoice/view"
                className="inline-flex items-center p-1.5 rounded  hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Vendors {totalVendor}
            </span>
            <div className="flex  gap-10 mt-2 ">
              <Link
                href="/vendor"
                className="inline-flex items-center  p-1.5   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/vendor"
                className="inline-flex items-center p-1.5 rounded  hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow   flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Customers {totalCustomers}
            </span>
            <div className="flex  gap-10 mt-2 ">
              <Link
                href="/customer"
                className="inline-flex  items-center  p-1.5   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/customer"
                className="inline-flex items-center p-1.5 rounded    hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow   flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Products {totalProducts}
            </span>
            <div className="flex  gap-10 mt-2 ">
              <Link
                href="/products"
                className="inline-flex  items-center  p-1.5   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/products/view"
                className="inline-flex items-center p-1.5 rounded    hover:bg-success"
              >
                <FaEye />
              </Link>
            </div>
          </div>
          <div className="flex shadow   flex-col items-center py-2 border  rounded-lg hover:scale-105 transition-transform duration-300   ">
            <span className="text-md py-1  font-medium">
              Purchases {totalPurchase}
            </span>
            <div className="flex  gap-10 mt-2 ">
              <Link
                href="/purchase"
                className="inline-flex  items-center  p-1.5   rounded hover:bg-success  "
              >
                <FaUserPlus />
              </Link>
              <Link
                href="/purchase/view"
                className="inline-flex items-center p-1.5 rounded    hover:bg-success"
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
                <div className="flex  gap-10 mt-2 ">
                  <Link
                    href="/auth/signup"
                    className="inline-flex  items-center  p-1.5   rounded hover:bg-success  "
                  >
                    <FaUserPlus />
                  </Link>
                  <Link
                    href="/users"
                    className="inline-flex items-center p-1.5 rounded    hover:bg-success"
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
                <div className="flex  gap-10 mt-2 ">
                  <Link
                    href="/company"
                    className="inline-flex  items-center  p-1.5   rounded hover:bg-success  "
                  >
                    <FaUserPlus />
                  </Link>
                  <Link
                    href="/company/viewCompany"
                    className="inline-flex items-center p-1.5 rounded    hover:bg-success"
                  >
                    <FaEye />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
};

export default FirstSec;