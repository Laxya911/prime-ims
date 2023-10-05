"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { PurchaseProduct} from "@/app/types/product";


const Quotations = () => {
  const session = useSession();


  const [allQuotation, setAllQuotation] = useState<PurchaseProduct[]>([]);
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await fetch(`/api/quotation`);
        const data = await response.json();
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            if (data && Array.isArray(data) && data.length > 0) {
              const shortedPurchase = data.sort(
                (a: PurchaseProduct, b: PurchaseProduct) =>
                  new Date(b.date_created).getTime() -
                  new Date(a.date_created).getTime()
              );
              setAllQuotation(shortedPurchase);
            } else {
              console.error("Data or products array is undefined.");
            }
          } else {
            if (data && Array.isArray(data) && data.length > 0) {

              const filteredData = data.filter(
                (po: { companyId: string }) =>
                  po.companyId === session.data.user.companyId
              );
              const shortedPurchase = filteredData.sort(
                (a: PurchaseProduct, b: PurchaseProduct) =>
                  new Date(b.date_created).getTime() -
                  new Date(a.date_created).getTime()
              );
              setAllQuotation(shortedPurchase);
            } else {
              console.error("Data or products array is undefined.");
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuotations();
  }, [session.status, session.data]);

  const handleDelete = (_id: string) => {
    const shouldDelete = window.confirm("Are You Sure to Delete??");
    if (shouldDelete) {
      axios
        .delete(`/api/quotation/${_id}`)
        .then((response) => {
            toast.success("Quotation Deleted Successfully");
            setAllQuotation((prevInvoice) =>
            prevInvoice.filter(
              (allQuotationOrder) => allQuotationOrder._id !== _id
              )
              );
        })
        .catch((error) => {
          toast.error("Quotation Not Deleted");
          console.error(error); // Handle the error
        });
    }
  };
  return {
    allQuotation,
    // allQuotationOrder,
    handleDelete,
  };
};
export default Quotations;