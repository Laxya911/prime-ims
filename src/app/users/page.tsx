"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import UnAthorized from "@/components/unauthorized";
import AuthUser from '@/utils/auth'
import { UserTypes } from "../types/userType";
import { CompanyTypes } from "../types/company";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
interface CustomUser extends UserTypes {
  isActive: boolean;
  companyName: string;
  createdAt: Date; 
}
const UserLists = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session.status, router]);
  const [allusers, setAllusers] = useState<CustomUser[]>([]);
  const [userPage, setuserPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsersAndCompanies = async () => {
      try {
        // Fetch all companies
        const companiesResponse = await axios.get("/api/company");
        const companiesList = companiesResponse.data as CompanyTypes;

        // Create a map of company IDs to their names for efficient lookup
        const companyMap = new Map();
        companiesList.forEach((company: { _id: string; name: string; }) => {
          companyMap.set(company._id, company.name);
        });

        // Fetch all users
        const usersResponse = await axios.get("/api/users");
        const userList = usersResponse.data;
        // console.log(userList)
        // Modify the user list to include company names
        const usersWithCompanyNames = userList.map((user: { assignedCompany: string; }) => ({
          ...user,
          companyName: companyMap.get(user.assignedCompany) || "Not Assigned",
        }));
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all users for superadmin
            setAllusers(usersWithCompanyNames);
          } else {
            const filteredData = usersWithCompanyNames.filter(
              (userCompany: { companyId: string; }) =>
                userCompany.companyId === session.data.user.companyId
            );
            setAllusers(filteredData);
          }
        }
      } catch (error) {
        console.error(error); 
      }
    };
    fetchUsersAndCompanies();
  }, [session.status, session.data]);

  const handleUpdateUser = async (_id: string) => {
    try {
      const response = await axios.get(`/api/users/${_id}`);
      const userData = response.data;
      router.push(`/users/${_id}`, { state: { userData } }as any);
      // console.log(userData);
    } catch (error) {
      console.error(error);
    }
  };

  const handelDeleteUser = (_id: string) => {
    const shouldDelete = window.confirm("Are You Sure To Delete??")
    if (shouldDelete){
    axios
      .delete(`/api/users/${_id}`)
      .then((response) => {
        console.log(response.data); // Handle the response data
        toast.success("User Deleted Successfully");
        setAllusers((prevClients) =>
          prevClients.filter((user) => user._id !== _id)
        );
      })
      .catch((error) => {
        toast.error("User Not Deleted");
        console.error(error); // Handle the error
      });
  };
}
  // Pagination Logic

  const handleNextPage = () => {
    const pageCount = Math.ceil(allusers.length / usersPerPage);
    if (userPage === pageCount) return;
    setuserPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (userPage === 1) return;
    setuserPage((prevPage) => prevPage - 1);
  };
  const handlePageClick = (page: number) => {
    setuserPage(page);
  };
  const userStartIndex = (userPage - 1) * usersPerPage;
  const userEndIndex = userStartIndex + usersPerPage;
  const usersOnPage = allusers.slice(userStartIndex, userEndIndex);
  const pageCount = Math.ceil(allusers.length / usersPerPage);

  const {isAuthorized} = AuthUser();
  if (!isAuthorized) {
    // Display a message or redirect to another page
    return (
      <>
        <UnAthorized />
      </>
    );
  }

  if (session) {
    return (
      <>
      <Breadcrumb pageName="Users" />

        <div className="relative mb-10 overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex justify-center text-center text-2xl mb-6 font-medium">
            Users List
          </div>
          <div className=" overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 ">
              <thead className="text-sm  text-gray-700  bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    Users Name
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Status
                  </th>
                  {session?.data?.user.role === "superadmin" && (
                    <>
                      <th scope="col" className="px-4 py-2">
                        Assigned Company
                      </th>
                      <th scope="col" className="px-4 py-2">
                        Company ID
                      </th>
                    </>
                  )}
                  <th scope="col" className="px-4 py-2">
                    Added
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Edit
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersOnPage.map((user, _id) => (
                  <tr
                    key={_id}
                    className=" border-b  cursor-pointer hover:bg-hoverl dark:hover:bg-dark-hover"
                  >
                    <td className="px-4 py-2 ">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role} </td>
                    <td className="px-4 py-2">
                      {user.isActive ? "Active" : "Not Active"}
                    </td>
                    {session?.data?.user.role === "superadmin" && (
                      <>
                        <td className="px-4 py-2">{user.companyName}</td>
                        <td className="px-4 py-2">{user.companyId}</td>
                      </>
                    )}
                    <td className="px-4 py-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <FaEdit
                        onClick={() => handleUpdateUser(user._id)}
                        className="cursor-pointer text-warning"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FaTrash
                        onClick={() => handelDeleteUser(user._id)}
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
                {userStartIndex + 1}-{Math.min(userEndIndex, allusers.length)}
              </span>{" "}
              of <span>{allusers.length}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={handlePreviousPage}
                  disabled={userPage === 1}
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
                      userPage === index + 1
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
                  disabled={userEndIndex >= allusers.length}
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

export default UserLists;
