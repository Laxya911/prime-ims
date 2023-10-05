"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { ConsignmentTypes } from "@/app/types/consignment";

const ConsignmentAPI = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
  }, [session.status, router]);

  const [consignment, setConsignment] = useState<ConsignmentTypes[]>([]);

  useEffect(() => {
    const fetchConsignments = async () => {
      try {
        const response = await fetch(`/api/consignment`);
        const data = await response.json();
  
        if (session.status === "authenticated" && session.data) {
  
          if (session.data.user.role === "superadmin") {
            // Display all consignments for superadmin
            const sortedConsignments = data.sort(
              (a: ConsignmentTypes, b: ConsignmentTypes) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            // console.log("Superadmin consignments:", sortedConsignments);
            setConsignment(sortedConsignments);
          } else {
            // Filter consignments by companyId
            const companyId = session?.data?.user.companyId;
  
            const filteredData = data.filter(
              (consignment: ConsignmentTypes) =>
                consignment.companyId === companyId
            );
            const sortedConsignments = filteredData.sort(
              (a: ConsignmentTypes, b: ConsignmentTypes) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            setConsignment(sortedConsignments);
          }
        }
      } catch (error) {
        console.error("Error fetching consignments:", error);
      }
    };
    fetchConsignments();
  }, [session.status, session.data]);
  

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined') {
    const shouldDelete = window.confirm("Are You Sure ??")
    if (shouldDelete){
    axios
      .delete(`/api/consignment/${id}`)
      .then((response) => {
        console.log(response.data); // Handle the response data
        toast.success("Consignment Deleted Successfully");
        setConsignment((prevInvoice) =>
          prevInvoice.filter((consignment) => consignment._id !== id)
        );
      })
      .catch((error) => {
        toast.error("Consignment Not Deleted");
        console.error(error); // Handle the error
      });
  };
}
};
  return {
    consignment,
    handleDelete,
  };
};
export default ConsignmentAPI;
