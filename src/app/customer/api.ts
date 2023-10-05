'use client'
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomerTypes } from "@/app/types/vendor";

const CustomerApi = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const [customer, setCustomer] = useState({
    customerName: "",
    contact_no: "",
    email: "",
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
      setCustomer({
        customerName: "",
        contact_no: "",
        email: "",
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

  const [allCustomer, setAllCustomer] = useState<CustomerTypes[]>([]);
  const [filterCustomer, setFilterCustomer] = useState<CustomerTypes[]>([]);
  const [customerOnPage, setCustomerOnPage] = useState(1);
  const customerPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

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
  }, [session.status, session.data, setAllCustomer]);

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
  }, [searchTerm, allCustomer, setFilterCustomer, setCustomerOnPage]);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState(""); // Track the selected vendor's _id

  // Enable editing and populate fields when a vendor is selected
  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedCustomerId(selectedId);
    // Find the selected vendor's data and populate the input fields
    const selectedVendor = allCustomer.find(
      (vendor) => vendor._id === selectedId
    );
    if (selectedVendor) {
      // Split and display only the gst_vat_no part
      setCustomer(selectedVendor);
    }
  };
  const selectCustomer = (selectedId: string) => {
    setSelectedCustomerId(selectedId);
    // Find the selected customer's data and populate the input fields
    const selectedCustomer = allCustomer.find(
      (customer) => customer._id === selectedId
    );
    if (selectedCustomer) {
      // Split and display only the gst_vat_no part
      setCustomer(selectedCustomer);
    }
  };

  const initialCustomerState = {
    customerName: "",
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
  // Handle the update operation
  const handleUpdate = async () => {
    const updatedVendor = {
      ...customer,
      created_by: session?.data?.user.email,
      companyId: session?.data?.user.companyId,
      date_created: new Date(),
    };

    try {
      await axios.put(`/api/customer/${selectedCustomerId}`, updatedVendor);
      toast.success("Customer updated successfully!");
      setIsEditing(false); // Disable edit mode
      setSelectedCustomerId(""); // Clear selected vendor
      setCustomer({ ...initialCustomerState }); // Clear input fields

      const updatedResponse = await axios.get("api/customer");
      setAllCustomer(updatedResponse.data);
    } catch (error) {
      console.error("Error updating Customer data:", error);
      toast.error("Something went wrong while updating Customer");
    }
  };

  // Handle the delete operation
  const handleDelete = async () => {
    const shouldDelete = window.confirm("Are you sure to Delete ??");
    if (shouldDelete) {
      try {
        await axios.delete(`/api/customer/${selectedCustomerId}`);
        toast.success("Customer deleted successfully!");
        setAllCustomer((prevallCustomer) =>
          prevallCustomer.filter((vendor) => vendor._id !== selectedCustomerId)
        );
        setIsEditing(false); // Disable edit mode
        setSelectedCustomerId(""); // Clear selected vendor
        setCustomer({ ...initialCustomerState }); // Clear input fields
      } catch (error) {
        console.error("Error deleting vendor data:", error);
        toast.error("Something went wrong while deleting vendor data");
      }
    }
  };
  const handleCancel = async () => {
    setIsEditing(false); // Disable edit mode
    setSelectedCustomerId(""); // Clear selected vendor
    setCustomer({ ...initialCustomerState }); // Clear input fields
  };

  return {
    customer,allCustomer,setCustomer,setFilterCustomer,setIsEditing,setSearchTerm,setCustomerOnPage,setAllCustomer,filterCustomer,customerOnPage,customerPerPage, searchTerm,handleCancel,handleDelete,handleUpdate,selectCustomer,handleCustomerSelect,isEditing,selectedCustomerId,setSelectedCustomerId,isFormSubmitted, setIsFormSubmitted
  }
};
export default CustomerApi