"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { CompanyTypes } from "@/app/types/company";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UnAthorized from "@/components/unauthorized";
import AuthUsers from "@/utils/auth";
const MessageList = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session.status, router]);

  const {isSuperAdmin}= AuthUsers();
  // if (!isSuperAdmin) {
  //   return(
  //     <UnAthorized/>
  //   )
  // }

  const [allCompany, setAllCompany] = useState<CompanyTypes[]>([]);
  const [companyPage, setCompanyPage] = useState(1);
  const companyPerPage = 10;

  useEffect(() => {
    // Fetch clients from server
    fetch(`/api/company`)
      .then((response) => response.json())
      .then((data) => {
        setAllCompany(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleUpdate = async (_id: string) => {
    try {
      const response = await axios.get(`/api/company/${_id}`);
      const compData = response.data;
      router.push(`/company/viewCompany/${_id}`, {
        state: { compData },
      } as any);
      console.log(compData);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = (_id: string) => {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm("Are you sure you want to delete?");
      if (shouldDelete) {
        axios
          .delete(`/api/company/${_id}`)
          .then((response) => {
            console.log(response.data);
            toast.success("Company Deleted Successfully");
            setAllCompany((prevCompany) =>
              prevCompany.filter((company) => company._id !== _id)
            );
          })
          .catch((error) => {
            toast.error("Company Not Deleted");
            console.error(error); // Handle the error
          });
      }
    }
  };

  // Pagination Logic

  const handleNextPage = () => {
    const pageCount = Math.ceil(allCompany.length / companyPerPage);
    if (companyPage === pageCount) return;
    setCompanyPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (companyPage === 1) return;
    setCompanyPage((prevPage) => prevPage - 1);
  };
  const handlePageClick = (page: SetStateAction<number>) => {
    setCompanyPage(page);
  };
  const companyStartIndex = (companyPage - 1) * companyPerPage;
  const companyEndIndex = companyStartIndex + companyPerPage;
  const conpanyOnPage = allCompany.slice(companyStartIndex, companyEndIndex);
  const pageCount = Math.ceil(allCompany.length / companyPerPage);
  if (session) {
    return (
      <>
        <Breadcrumb pageName="Companies" />
        <div className=" shadow-md sm:rounded-lg">
          <div className="flex justify-center text-center text-2xl mb-4 sm:mb-10 font-medium">
            Company List
          </div>
          <div className=" overflow-x-auto">
            <table className="w-full text-sm  text-gray-700 ">
              <thead className=" border-b text-gray-700 text-left bg-gray-50 ">
                <tr>
                  <th className=" py-1">
                    Name
                  </th>
                  <th className=" py-1">
                    ID
                  </th>
                  <th className=" px-2 py-1">
                    Logo
                  </th>
                  <th className=" py-1">
                    Website
                  </th>
                  <th className=" py-1">
                    Email
                  </th>
                  <th className=" py-1">
                    Contact
                  </th>
                  <th className=" py-1">
                    GST
                  </th>
                  <th className=" py-1">
                    Pancard
                  </th>
                  <th className=" py-1">
                    Address
                  </th>
                  <th className=" py-1">
                    State
                  </th>
                  <th className=" py-1">
                    Country
                  </th>
                  <th className=" py-1">
                    Joined
                  </th>
                  <th className=" py-1">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {conpanyOnPage.map((company, _id) => (
                  <tr
                    key={_id}
                    className="border-b text-gray-800 cursor-pointer hover:bg-hoverl dark:hover:bg-dark-hover"
                  >
                    <td className=" py-1">{company.name}</td>
                    <td className=" py-1">{company.companyId}</td>
                    <td className=" p-2">
                      <Image
                        className=" rounded"
                        src={company.logo ? company.logo : "/images/logo.png"}
                        width={48}
                        height={54}
                        alt="Logo"
                      />
                    </td>
                    <td className=" py-1">{company.company_Url}</td>
                    <td className=" py-1">{company.email}</td>
                    <td className=" py-1">{company.contact}</td>
                    <td className=" py-1">{company.gstNo}</td>
                    <td className=" py-1">{company.pancard}</td>
                    <td className=" py-1">{company.address}</td>
                    <td className=" py-1">{company.state}</td>
                    <td className=" py-1">{company.country}</td>
                    <td className=" py-1">
                      {new Date(company.createdAt).toDateString()}
                    </td>
                    <td className=" flex justify-between  py-2">
                      <FaEdit
                        onClick={() => handleUpdate(company._id)}
                        className="cursor-pointer text-warning"
                      />
                      <FaTrash
                        onClick={() => handleDelete(company._id)}
                        className="cursor-pointer text-danger"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <nav
            className="flex items-center justify-between pt-4 px-1"
            aria-label="Table navigation"
          >
            <span className="text-md font-normal ">
              Showing{" "}
              <span>
                {companyStartIndex + 1}-
                {Math.min(companyEndIndex, allCompany.length)}
              </span>{" "}
              of <span> {allCompany.length}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={handlePreviousPage}
                  disabled={companyPage === 1}
                  className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
              {Array.from({ length: pageCount }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageClick(index + 1)}
                    className={`block px-3 py-2 leading-tight text-gray-500 ${
                      companyPage === index + 1
                        ? "z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-100 hover:bg-blue-200 hover:text-blue-700"
                        : "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300  "
                    } hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleNextPage}
                  disabled={companyEndIndex >= allCompany.length}
                  className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 "
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </>
    );
  }
};

export default MessageList;
