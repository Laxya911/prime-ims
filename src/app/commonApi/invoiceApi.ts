"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { InvoiceType } from "@/app/types/invoice";

const InvoiceAPI = () => {
  const session = useSession();

  const [allInvoices, setAllInvoices] = useState<InvoiceType[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`/api/primeinvoice`);
        const data = await response.json();
        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin
            const sortedInvoices = data.sort(
              (a: InvoiceType, b: InvoiceType) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllInvoices(sortedInvoices);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (consignment: { companyId: string }) =>
                consignment.companyId === session.data.user.companyId
            );
            const sortedInvoices = filteredData.sort(
              (a: InvoiceType, b: InvoiceType) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllInvoices(sortedInvoices);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchInvoices();
  }, [session.status, session.data]);

  const handelDeleteInvoice = (_id: string) => {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm("Are You Sure to Delete??");
      if (shouldDelete) {
        axios
          .delete(`/api/primeinvoice/${_id}`)
          .then((response) => {
            console.log(response.data); // Handle the response data
            toast.success("Invoice Deleted Successfully");
            setAllInvoices((prevInvoice) =>
              prevInvoice.filter((allInvoices) => allInvoices._id !== _id)
            );
          })
          .catch((error) => {
            toast.error("Invoice Not Deleted");
            console.error(error); // Handle the error
          });
      }
    }
  };
  return {
    allInvoices,
    handelDeleteInvoice,
  };
};
export default InvoiceAPI;
