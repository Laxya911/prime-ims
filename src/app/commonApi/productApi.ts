"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import {ProductTypes} from "@/app/types/product"

const ProductApi = () => {
  const session = useSession();

  const [allProducts, setAllProducts] = useState<ProductTypes[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`/api/product`);
        const data = await response.json();
        // console.log(data)
        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin
            const sortedPurchaseOrder = data.sort(
              (a: ProductTypes, b: ProductTypes) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllProducts(sortedPurchaseOrder);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (po: { companyId: string; }) =>
                po.companyId === session.data.user.companyId
            );
            const sortedPurchaseOrder = filteredData.sort(
              (a: ProductTypes, b: ProductTypes) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllProducts(sortedPurchaseOrder);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchInvoices();
  }, [session.status, session.data]);

  const handleDelete = (_id: string) => {
    const shouldDelete = window.confirm("Are You Sure to Delete??")
    if (shouldDelete){
    axios
      .delete(`/api/product/${_id}`)
      .then((response) => {
        console.log(response.data); // Handle the response data
        toast.success("Product Deleted Successfully");
        setAllProducts((prevInvoice) =>
          prevInvoice.filter((allProducts) => allProducts._id !== _id)
        );
      })
      .catch((error) => {
        toast.error("Product Not Deleted");
        console.error(error); // Handle the error
      });
  };
};
  return {
    allProducts,
    handleDelete,
  };
};
export default ProductApi;
