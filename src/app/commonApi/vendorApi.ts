"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorTypes } from "@/app/types/vendor";

const VendorApi = () => {
  const session = useSession();

  const [allVendors, setAllVendors] = useState<VendorTypes[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`/api/vendor`);
        const data = await response.json();
        // console.log(data)
        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin
            const sortedPurchaseOrder = data.sort(
              (a: VendorTypes, b: VendorTypes) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllVendors(sortedPurchaseOrder);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (po: { companyId: string }) =>
                po.companyId === session.data.user.companyId
            );
            const sortedPurchaseOrder = filteredData.sort(
              (a: VendorTypes, b: VendorTypes) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllVendors(sortedPurchaseOrder);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchVendors();
  }, [session.status, session.data]);

  const handleDelete = (_id: string) => {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm("Are You Sure to Delete??");
      if (shouldDelete) {
        axios
          .delete(`/api/vendor/${_id}`)
          .then((response) => {
            console.log(response.data); // Handle the response data
            toast.success("Vendor Deleted Successfully");
            setAllVendors((prevInvoice) =>
              prevInvoice.filter((allVendors) => allVendors._id !== _id)
            );
          })
          .catch((error) => {
            toast.error("Vendor Not Deleted");
            console.error(error); // Handle the error
          });
      }
    }
  };
  return {
    allVendors,
    handleDelete,
  };
};
export default VendorApi;
