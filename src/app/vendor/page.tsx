"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../common.module.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VendorTypes } from "@/app/types/vendor";
const Vendor = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const [vendor, setVendor] = useState({
    vName: "",
    contact_no: "",
    email: "",
    company: "",
    gst_vat_no: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    created_by: "",
    companyId: "",
    date_created: new Date(),
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  // Reset the form fields when isFormSubmitted is true
  useEffect(() => {
    if (isFormSubmitted) {
      setVendor({
        vName: "",
        gst_vat_no: "",
        contact_no: "",
        email: "",
        company: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zip: "",
        created_by: "",
        companyId: "",
        date_created: new Date(),
      });
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);
  const isGstVatNoValid = (inputValue: string) => {
    const regexPattern = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
    return regexPattern.test(inputValue);
  };
  // handleSubmit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isGstVatNoValid(vendor.gst_vat_no)) {
      toast.error("Invalid GST/VAT number");
      return;
    }
    const updatedVendor = {
      ...vendor,
      gst_vat_no: `${session?.data?.user.companyId}-${vendor.gst_vat_no}`,
      created_by: session?.data?.user.email,
      companyId: session?.data?.user.companyId,
      date_created: new Date(),
    };
    console.log(updatedVendor);
    axios
      .post("/api/vendor", updatedVendor)
      .then((res) => {
        console.log(res.data);
        toast.success("vendor saved successfully!");
        setIsFormSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error("vendor already exists or something wrong");
      });
  };

  const [allvendor, setAllVendor] = useState<VendorTypes[]>([]);
  const [filterItems, setFilterItems] = useState<VendorTypes[]>([]);
  const [itemonPage, setItemonPage] = useState(1);
  const itemPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("api/vendor");

        setAllVendor(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    if (session?.status === "authenticated") fetchVendors();
  }, [session]);

  useEffect(() => {
    // Filter po based on searchTerm
    const filteredData = allvendor.filter((vendor) => {
      // Check for matches in main vendor fields
      const mainFieldsMatch = Object.values(vendor).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      return mainFieldsMatch;
    });
    setFilterItems(filteredData);
    // Reset the po page to the first page whenever the searchTerm changes
    setItemonPage(1);
  }, [searchTerm, allvendor]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(""); // Track the selected vendor's _id

  // Enable editing and populate fields when a vendor is selected
  const handleVendorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedVendorId(selectedId);
    // Find the selected vendor's data and populate the input fields
    const selectedVendor = allvendor.find(
      (vendor) => vendor._id === selectedId
    );
    if (selectedVendor) {
      // Split and display only the gst_vat_no part
      const gst_vat_no = selectedVendor.gst_vat_no.split("-")[1];
      setVendor({ ...selectedVendor, gst_vat_no });
    }
  };
  const selectVendor = (selectedId: string) => {
    setSelectedVendorId(selectedId);
    // Find the selected vendor's data and populate the input fields
    const selectedVendor = allvendor.find(
      (vendor) => vendor._id === selectedId
    );
    if (selectedVendor) {
      // Split and display only the gst_vat_no part
      setVendor(selectedVendor);
    }
  };

  // Handle the update operation
  const handleUpdate = async () => {
    if (!isGstVatNoValid(vendor.gst_vat_no)) {
      toast.error("Invalid GST/VAT number");
      return;
    }
    const updatedVendor = {
      ...vendor,
      gst_vat_no: `${session?.data?.user.companyId}-${vendor.gst_vat_no}`,
      created_by: session?.data?.user.email,
      companyId: session?.data?.user.companyId,
      date_created: new Date(),
    };

    try {
      await axios.put(`/api/vendor/${selectedVendorId}`, updatedVendor);
      toast.success("Vendor updated successfully!");
      setIsEditing(false); // Disable edit mode
    } catch (error) {
      console.error("Error updating vendor data:", error);
      toast.error("Something went wrong while updating vendor data");
    }
  };

  const initialVendorState = {
    vName: "",
    contact_no: "",
    email: "",
    company: "",
    gst_vat_no: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    created_by: "",
    companyId: "",
    date_created: new Date(),
  };
  // Handle the delete operation
  
  const handleDelete = async () => {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm("Are you sure to Delete ??");
      if (shouldDelete) {
        try {
          await axios.delete(`/api/vendor/${selectedVendorId}`);
          toast.success("Vendor data deleted successfully!");
          setAllVendor((prevAllVendor) =>
            prevAllVendor.filter((vendor) => vendor._id !== selectedVendorId)
          );
          setIsEditing(false); // Disable edit mode
          setSelectedVendorId(""); // Clear selected vendor
          setVendor({ ...initialVendorState }); // Clear input fields
        } catch (error) {
          console.error("Error deleting vendor data:", error);
          toast.error("Something went wrong while deleting vendor data");
        }
      }
    }
  };
  const handleCancel = async () => {
    setAllVendor((prevAllVendor) =>
      prevAllVendor.filter((vendor) => vendor._id !== selectedVendorId)
    );
    setIsEditing(false); // Disable edit mode
    setSelectedVendorId(""); // Clear selected vendor
    setVendor({ ...initialVendorState }); // Clear input fields
  };

  // Pagination Logic
  const handleNext = () => {
    const pageCount = Math.ceil(allvendor.length / itemonPage);
    if (itemonPage === pageCount) return;
    setItemonPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (itemonPage === 1) return;
    setItemonPage((prevPage) => prevPage - 1);
  };
  const handlePageClick = (page: number) => {
    setItemonPage(page);
  };
  const itemStartIndex = (itemonPage - 1) * itemPerPage;
  const itemEndIndex = itemStartIndex + itemPerPage;
  const itemPage = filterItems.slice(itemStartIndex, itemEndIndex);
  const pageCount = Math.ceil(filterItems.length / itemPerPage);

  const dataLength = allvendor.length > 0;

  if (session.status === "authenticated") {
    return (
      <>
        <Breadcrumb pageName="Vendor Management" />
        <div className="mb-4 flex flex-col justify-center items-center gap-6 sm:flex-row text-center">
          <div className="px-4 py-1 text-2xl">Vendor Management</div>
          <div>
            <select
              onChange={handleVendorSelect}
              value={selectedVendorId}
              className="px-4 py-1 rounded text-black"
            >
              <option value="" >Select Vendor</option>
              {allvendor.map((vendor) => (
                <option key={vendor._id} value={vendor._id} >
                  {vendor.vName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="shadow-sm shadow-warning mt-2 rounded py-4">
        <form
          name="form"
          id="form"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          {selectedVendorId ? (
            <>
              <input
                type="text"
                name="name"
                className={styles.input}
                placeholder="vendor Name"
                value={vendor.vName ? vendor.vName : ""}
                readOnly={!isEditing}
                required={true}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    vName: e.target.value,
                  }))
                }
              />
              <input
                name="company"
                type="text"
                placeholder="Company Name"
                value={vendor.company ? vendor.company : ""}
                className={styles.input}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    company: e.target.value,
                  }))
                }
              />
              <input
                type="number"
                name="contact_no"
                placeholder="vendors Phone"
                value={vendor.contact_no ? vendor.contact_no : ""}
                className={styles.input}
                required={true}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    contact_no: e.target.value,
                  }))
                }
              />
              <input
                type="email"
                name="email"
                className={styles.input}
                placeholder="vendors Email"
                value={vendor.email ? vendor.email : ""}
                required={true}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
              <input
                name="gst_vat_no"
                type="text"
                placeholder="GST/VAT"
                className={styles.input}
                value={vendor.gst_vat_no ? vendor.gst_vat_no : ""}
                readOnly={!isEditing}
                required={true}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    gst_vat_no: e.target.value,
                  }))
                }
              />
              <input
                name="zip"
                type="text"
                placeholder="Pin Code"
                className={styles.input}
                value={vendor.zip ? vendor.zip : ""}
                readOnly={!isEditing}
                required={true}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    zip: e.target.value,
                  }))
                }
              />{" "}
              <input
                name="country"
                type="text"
                placeholder="country "
                className={styles.input}
                value={vendor.country ? vendor.country : ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    country: e.target.value,
                  }))
                }
              />
              <input
                name="state"
                type="text"
                placeholder="state "
                className={styles.input}
                value={vendor.state ? vendor.state : ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    state: e.target.value,
                  }))
                }
              />
              <input
                name="city"
                type="text"
                placeholder="city "
                className={styles.input}
                value={vendor.city ? vendor.city : ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
                    ...prevState,
                    city: e.target.value,
                  }))
                }
              />
              <input
                placeholder="Address"
                className={styles.input}
                value={vendor.address ? vendor.address : ""}
                readOnly={!isEditing}
                required={true}
                onChange={(e) =>
                  isEditing &&
                  setVendor((prevState) => ({
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
                placeholder="vendor Name"
                value={vendor.vName ? vendor.vName : ""}
                required={true}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    vName: e.target.value,
                  }))
                }
              />
              <input
                name="company"
                type="text"
                placeholder="Company Name"
                value={vendor.company ? vendor.company : ""}
                className={styles.input}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    company: e.target.value,
                  }))
                }
              />
              <input
                type="number"
                name="contact_no"
                placeholder="vendors Phone"
                value={vendor.contact_no ? vendor.contact_no : ""}
                className={styles.input}
                required={true}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    contact_no: e.target.value,
                  }))
                }
              />
              <input
                type="email"
                name="email"
                className={styles.input}
                placeholder="vendors Email"
                required={true}
                value={vendor.email ? vendor.email : ""}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
              <input
                name="gst_vat_no"
                type="text"
                placeholder="GST/VAT"
                className={styles.input}
                required={true}
                value={vendor.gst_vat_no ? vendor.gst_vat_no : ""}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    gst_vat_no: e.target.value,
                  }))
                }
              />
              <input
                name="zip"
                type="text"
                placeholder="Pin Code"
                className={styles.input}
                value={vendor.zip ? vendor.zip : ""}
                required={true}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    zip: e.target.value,
                  }))
                }
              />{" "}
              <input
                name="country"
                type="text"
                placeholder="country "
                className={styles.input}
                value={vendor.country ? vendor.country : ""}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    country: e.target.value,
                  }))
                }
              />{" "}
              <input
                name="state"
                type="text"
                placeholder="state "
                className={styles.input}
                value={vendor.state ? vendor.state : ""}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    state: e.target.value,
                  }))
                }
              />
              <input
                name="city"
                type="text"
                placeholder="city "
                className={styles.input}
                value={vendor.city ? vendor.city : ""}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    city: e.target.value,
                  }))
                }
              />
              <input
                placeholder="Address"
                className={styles.input}
                value={vendor.address ? vendor.address : ""}
                required={true}
                onChange={(e) =>
                  setVendor((prevState) => ({
                    ...prevState,
                    address: e.target.value,
                  }))
                }
              />
              {/* default button for creating new item disable if updating or deleting existing item*/}
              <button className={styles.saveButton}>Save</button>
              {/* Enable edit, update and delete button if vendor is selected from selsct option*/}
            </>
          )}
        </form>
        <div className="flex py-2 px-2 sm:px-50 gap-4 flex-col sm:flex-row">
          {/* Button to enable editing */}
          {selectedVendorId && (
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
          {/* Buttons for editing an existing vendor */}
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
        </div>
        <div className="relative mb-4 mt-6 shadow-md sm:rounded-lg">
          {dataLength ? (
            <>
            <div className="flex flex-col sm:flex-row justify-between py-2">
          <div className="flex justify-center text-center text-2xl m-2 sfont-medium">
            Vendors List
          </div>
          {/* Search Input */}
          <div className="flex flex-col items-center lg:flex-row-reverse lg:items-end gap-2 sm:gap-4 sm:text-center sm:mb-4 lg:mb-0 px-8 py-1">
            {/* <button
              className="bg-success text-white rounded  flex px-4 py-1"
              onClick={exportToExcel}
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
          </div>
          <div className=" overflow-x-auto">
            <table className="w-full border text-xs text-left ">
              <thead className="border-b">
                <tr className="bg-gray-2 rounded-md text-left dark:bg-meta-4">
                  <th className=" py-2 px-1 -md font-medium text-black dark:text-white">
                    Vendor Name
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    Vendor Contact
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    GST/VAT
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    Country
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    State
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    City
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    Address
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    Pin Code
                  </th>

                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    Created By
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    Added On
                  </th>
                  <th className=" py-2 px-1 font-medium text-black dark:text-white">
                    Updated On
                  </th>
                  {session?.data?.user.role === "superadmin" && (
                    <th className=" py-2 px-1 font-medium text-black dark:text-white">
                      CompID
                    </th>
                  )}
                  <th className="py-2 px-1 font-medium text-black dark:text-white ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemPage.map((vendor, _id) => (
                  <tr
                    key={_id}
                    className="w-full text-gray-800 border-b hover:bg-hoverl dark:hover:bg-dark-hover"
                  >
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.vName}
                    </td>

                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.contact_no}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.email}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.gst_vat_no.split("-")[1]}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.country}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.state}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.city}
                    </td>

                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.address}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.zip}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {vendor.created_by}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {new Date(vendor.createdAt).toDateString()}
                    </td>
                    <td className=" py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                      {new Date(vendor.updatedAt).toDateString()}
                    </td>

                    {session?.data?.user.role === "superadmin" && (
                      <td className="py-2 px-1 border-b dark:border-[#eee] border-strokedark">
                        {vendor.companyId}
                      </td>
                    )}
                    <td className=" py-2 px-1 flex items-center text-center dark:border-[#eee] border-strokedark">
                      <button
                        onClick={() => selectVendor(vendor._id)}
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
                {itemStartIndex + 1}-{Math.min(itemEndIndex, allvendor.length)}
              </span>{" "}
              of <span> {allvendor.length}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={handlePrevious}
                  disabled={itemonPage === 1}
                  className="block px-2 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray hover:text-black "
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
                      itemonPage === index + 1
                        ? "z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-100 hover:bg-blue-200 hover:text-blue-700"
                        : "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300  "
                      } hover:bg-secondary hover:text-gray dark:hover:bg-gray dark:hover:text-black`}>
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleNext}
                  disabled={itemEndIndex >= allvendor.length}
                  className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray hover:text-black"
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
              <p className="text-lg text-gray-500 p-10">No Vendors Entry Available</p>
            </div>
          )}
        </div>
      </>
    );
  }
};

export default Vendor;
