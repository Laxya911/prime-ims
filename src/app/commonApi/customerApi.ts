"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerTypes } from "@/app/types/vendor";

const CustomerApi = () => {
  const session = useSession();

  const [allCustomers, setAllCustomers] = useState<CustomerTypes[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`/api/customer`);
        const data = await response.json();
        // console.log(data)
        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin
            const sortedPurchaseOrder = data.sort(
              (a: CustomerTypes, b: CustomerTypes) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllCustomers(sortedPurchaseOrder);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (po: { companyId: string }) =>
                po.companyId === session.data.user.companyId
            );
            const sortedPurchaseOrder = filteredData.sort(
              (a: CustomerTypes, b: CustomerTypes) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllCustomers(sortedPurchaseOrder);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomers();
  }, [session.status, session.data]);

  const handleDelete = (_id: string) => {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm("Are You Sure to Delete??");
      if (shouldDelete) {
        axios
          .delete(`/api/customer/${_id}`)
          .then((response) => {
            console.log(response.data); // Handle the response data
            toast.success("Customer Deleted Successfully");
            setAllCustomers((prevInvoice) =>
              prevInvoice.filter((allCustomers) => allCustomers._id !== _id)
            );
          })
          .catch((error) => {
            toast.error("Customer Not Deleted");
            console.error(error); // Handle the error
          });
      }
    }
  };
  return {
    allCustomers,
    handleDelete,
  };
};
export default CustomerApi;
