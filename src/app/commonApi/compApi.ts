"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { CompanyTypes } from "../types/company";

const CompApi = () => {
  const session = useSession();
  const [companyData, setCompanyData] = useState<CompanyTypes>(); 
  const [allCompany, setAllcompany] = useState<CompanyTypes[]>([]); 

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          `/api/company/${session?.data?.user?.assignedCompany}`
        );
        setCompanyData(response.data);
        // console.log(response.data)
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    if (session?.status === "authenticated") {
      fetchCompanyData();
    }
  }, [session]);

  useEffect(() => {
    const getAllCompany = async () => {
      try {
        const response = await axios.get(
          `/api/company`
        );
        setAllcompany(response.data);
        // console.log(response.data)
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    if (session?.status === "authenticated") {
      getAllCompany();
    }
  }, [session]);

  return {
    companyData,
    allCompany,
  };
};
export default CompApi;
