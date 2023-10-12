"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../common.module.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import { FaEdit, FaFileExcel, FaTrash } from "react-icons/fa";
import CustomerApi from "./api";

const Customer = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const {
    customer,
    allCustomer,
    setCustomer,
    filterCustomer,
    customerOnPage,
    customerPerPage,
    searchTerm,
    handleCancel,
    handleDelete,
    handleUpdate,
    setFilterCustomer,
    selectCustomer,
    setSearchTerm,
    selectedCustomerId,
    handleCustomerSelect,
    isEditing,
    setCustomerOnPage,
    setAllCustomer,
    setIsEditing,
    setIsFormSubmitted,
  } = CustomerApi();

  // handleSubmit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCustomer = {
      ...customer,
      created_by: session?.data?.user.email,
      companyId: session?.data?.user.companyId,
      date_created: new Date(),
    };
    axios
      .post("/api/customer", updatedCustomer)
      .then(async (res) => {
        console.log(res.data);
        toast.success("Customer saved successfully!");
        setIsFormSubmitted(true);
        const updatedResponse = await axios.get("api/customer");
        setAllCustomer(updatedResponse.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("customer already exists or something wrong");
      });
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get("api/customer");
        setAllCustomer(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    if (session?.status === "authenticated") fetchCustomer();
  }, [session.status, session.data,setAllCustomer]);

  useEffect(() => {
    // Filter po based on searchTerm
    const filteredData = allCustomer.filter((customer) => {
      // Check for matches in main customer fields
      const mainFieldsMatch = Object.values(customer).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      return mainFieldsMatch;
    });
    setFilterCustomer(filteredData);
    // Reset the po page to the first page whenever the searchTerm changes
    setCustomerOnPage(1);
  }, [searchTerm, allCustomer,setCustomerOnPage, setFilterCustomer]);

  // Pagination Logic
  const handleNextPage = () => {
    const pageCount = Math.ceil(allCustomer.length / customerOnPage);
    if (customerOnPage === pageCount) return;
    setCustomerOnPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (customerOnPage === 1) return;
    setCustomerOnPage((prevPage) => prevPage - 1);
  };
  const handlePageClick = (page: number) => {
    setCustomerOnPage(page);
  };
  const productStartIndex = (customerOnPage - 1) * customerPerPage;
  const customerEndIndex = productStartIndex + customerPerPage;
  const customerPage = filterCustomer.slice(
    productStartIndex,
    customerEndIndex
  );
  const pageCount = Math.ceil(filterCustomer.length / customerPerPage);

  const dataLength = allCustomer.length > 0;
  if (session.status === "authenticated") {
    return (
      <>
        <Breadcrumb pageName="Vendor" />
        <div className="mb-4 flex flex-col justify-center items-center gap-6 sm:flex-row text-center">
          <div className="px-4 py-1 text-2xl">Customer Management</div>
          <div>
            <select
              onChange={handleCustomerSelect}
              value={selectedCustomerId}
              className="px-4 py-1 rounded"
            >
              <option value="">Select Customer</option>
              {allCustomer.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <form
          name="form"
          id="form"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          {selectedCustomerId ? (
            <>
              <input
                type="text"
                name="name"
                className={styles.input}
                placeholder="Customer Name"
                value={customer.customerName ? customer.customerName : ""}
                readOnly={!isEditing}
                required={true}
                onChange={(e) =>
                  isEditing &&
                  setCustomer((prevState) => ({
                    ...prevState,
                    customerName: e.target.value,
                  }))
                }
              />
              <input
                type="number"
                name="contact_no"
                placeholder="Customer Phone"
                value={customer.contact_no ? customer.contact_no : ""}
                className={styles.input}
                required={true}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setCustomer((prevState) => ({
                    ...prevState,
                    contact_no: e.target.value,
                  }))
                }
              />
              <input
                type="email"
                name="email"
                className={styles.input}
                placeholder="Customer Email"
                value={customer.email ? customer.email : ""}
                required={true}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setCustomer((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
              <input
                name="zip"
                type="text"
                placeholder="Pin Code"
                className={styles.input}
                value={customer.zip ? customer.zip : ""}
                readOnly={!isEditing}
                required={true}
                onChange={(e) =>
                  isEditing &&
                  setCustomer((prevState) => ({
                    ...prevState,
                    zip: e.target.value,
                  }))
                }
              />{" "}
              <input
                name="country"
                type="text"
                placeholder="Customer Country "
                className={styles.input}
                value={customer.country ? customer.country : ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setCustomer((prevState) => ({
                    ...prevState,
                    country: e.target.value,
                  }))
                }
              />
              <input
                name="state"
                type="text"
                placeholder="Customer state "
                className={styles.input}
                value={customer.state ? customer.state : ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setCustomer((prevState) => ({
                    ...prevState,
                    state: e.target.value,
                  }))
                }
              />
              <input
                name="city"
                type="text"
                placeholder="Customer city "
                className={styles.input}
                value={customer.city ? customer.city : ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setCustomer((prevState) => ({
                    ...prevState,
                    city: e.target.value,
                  }))
                }
              />
              <input
                placeholder="Customer Address"
                className={styles.input}
                value={customer.address ? customer.address : ""}
                readOnly={!isEditing}
                required={true}
                onChange={(e) =>
                  isEditing &&
                  setCustomer((prevState) => ({
                    ...prevState,
                    address: e.target.value,
                  }))
                }
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="name"
                className={styles.input}
                placeholder="Customer Name"
                value={customer.customerName ? customer.customerName : ""}
                required={true}
                onChange={(e) =>
                  setCustomer((prevState) => ({
                    ...prevState,
                    customerName: e.target.value,
                  }))
                }
              />
              <input
                type="number"
                name="contact_no"
                placeholder="Customer Phone"
                value={customer.contact_no ? customer.contact_no : ""}
                className={styles.input}
                required={true}
                onChange={(e) =>
                  setCustomer((prevState) => ({
                    ...prevState,
                    contact_no: e.target.value,
                  }))
                }
              />
              <input
                type="email"
                name="email"
                className={styles.input}
                placeholder="Customer Email"
                required={true}
                value={customer.email ? customer.email : ""}
                onChange={(e) =>
                  setCustomer((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
              <input
                name="zip"
                type="text"
                placeholder="Customer Pin Code"
                className={styles.input}
                value={customer.zip ? customer.zip : ""}
                required={true}
                onChange={(e) =>
                  setCustomer((prevState) => ({
                    ...prevState,
                    zip: e.target.value,
                  }))
                }
              />{" "}
              <input
                name="country"
                type="text"
                placeholder="Customer country "
                className={styles.input}
                value={customer.country ? customer.country : ""}
                onChange={(e) =>
                  setCustomer((prevState) => ({
                    ...prevState,
                    country: e.target.value,
                  }))
                }
              />{" "}
              <input
                name="state"
                type="text"
                placeholder="Customer state "
                className={styles.input}
                value={customer.state ? customer.state : ""}
                onChange={(e) =>
                  setCustomer((prevState) => ({
                    ...prevState,
                    state: e.target.value,
                  }))
                }
              />
              <input
                name="city"
                type="text"
                placeholder="Customer city "
                className={styles.input}
                value={customer.city ? customer.city : ""}
                onChange={(e) =>
                  setCustomer((prevState) => ({
                    ...prevState,
                    city: e.target.value,
                  }))
                }
              />
              <input
                placeholder="Customer Address"
                className={styles.input}
                value={customer.address ? customer.address : ""}
                required={true}
                onChange={(e) =>
                  setCustomer((prevState) => ({
                    ...prevState,
                    address: e.target.value,
                  }))
                }
              />
              {/* default button for creating new item disable if updating or deleting existing item*/}
              <button className={styles.saveButton}>Save</button>
              {/* Enable edit, update and delete button if customer is selected from selsct option*/}
            </>
          )}
        </form>
        <div className="flex py-2 px-2 mt-2 sm:px-80 gap-4 flex-col sm:flex-row">
          {/* Button to enable editing */}
          {selectedCustomerId && (
            <>
              <button
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
          {/* Buttons for editing an existing customer */}
          {isEditing && (
            <>
              <button className={styles.updateButton} onClick={handleUpdate}>
                Update
              </button>
              <button className={styles.deleteButton} onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
        <div className="relative shadow-md sm:rounded-lg mt-4">
        {dataLength ? (
            <>
          {/* Search Input */}
          <div className="flex flex-col justify-between lg:flex-row lg:items-end gap-2 sm:gap-4 sm:text-center sm:mb-4 lg:mb-2 px-8 py-1">
            <div className="text-center text-2xl  font-medium">
              Customer List
            </div>
            {/* <button
              className="bg-success text-white rounded  flex px-4 py-1"
              // onClick={exportToExcel}
            >
              <FaFileExcel className="mr-2 mt-1" />
              <span>Save As Excel</span>
            </button> */}
            <input
              type="text"
              placeholder="Search by any field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded border py-1"
            />
          </div>

          <div className=" overflow-x-auto">
            <table className="w-full border text-xs text-left">
              <thead className=" border-b ">
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-1 py-2 font-medium text-black dark:text-white">
                    Customer Name
                  </th>

                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    Customer Contact
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    GST/VAT
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    Country
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    State
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    City
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    Address
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    Pin Code
                  </th>

                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    Created By
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    Added On
                  </th>
                  <th className=" py-2 px-1  font-medium text-black dark:text-white">
                    Updated On
                  </th>
                  {session?.data?.user.role === "superadmin" && (
                    <th className=" py-2 px-1  font-medium text-black dark:text-white">
                      CompID
                    </th>
                  )}
                  <th className="py-2 px-1  font-medium text-black dark:text-white ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {customerPage.map((customer, _id) => (
                  <tr
                    key={_id}
                    className="w-full text-gray-800 border-b hover:bg-hoverl dark:hover:bg-dark-hover"
                  >
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.customerName}
                    </td>

                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.contact_no}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.email}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.gst_vat_no}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.country}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.state}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.city}
                    </td>

                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.address}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.zip}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {customer.created_by}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {new Date(customer.createdAt).toDateString()}
                    </td>
                    <td className=" py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                      {new Date(customer.updatedAt).toDateString()}
                    </td>

                    {session?.data?.user.role === "superadmin" && (
                      <td className="py-2 px-1  border-b dark:border-[#eee] border-strokedark">
                        {customer.companyId}
                      </td>
                    )}
                    <td className=" py-2 px-1  flex items-center text-center dark:border-[#eee] border-strokedark">
                      <button
                        onClick={() => selectCustomer(customer._id)}
                        className="cursor-pointer border px-1 rounded text-warning"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <nav
            className="flex items-center justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-md font-normal ">
              Showing{" "}
              <span>
                {productStartIndex + 1}-
                {Math.min(customerEndIndex, allCustomer.length)}
              </span>{" "}
              of <span> {allCustomer.length}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={handlePreviousPage}
                  disabled={customerOnPage === 1}
                  className="block px-2 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 "
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
                      customerOnPage === index + 1
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
                  disabled={customerEndIndex >= allCustomer.length}
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
          </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg text-gray-500 p-10">No Customers Entry Available</p>
            </div>
          )}
        </div>
      </>
    );
  }
};

export default Customer;
