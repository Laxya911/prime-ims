"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { InvoiceType } from "@/app/types/invoice";
import { PurchaseProduct } from "../types/product";
import { CustomerTypes } from "../types/vendor";

const Api = () => {
  const session = useSession();
  if (session.status === "unauthenticated") {
    redirect("/auth/signin");
  }
  // console.log(session.data);
  const [totalUsers, setTotalUsers] = useState("");
  const [totalCompanies, setTotalCompanies] = useState("");
  const [totalCustomers, setTotalCustomers] = useState("");
  const [totalVendor, setTotalVendor] = useState("");
  const [totalProducts, setTotalProducts] = useState("");
  const [totalPurchase, setTotalPurchase] = useState("");
  const [totalQuotations, setTotalQuotations] = useState("");

  const [totalMessages, setTotalMessages] = useState("");
  const [totalEmployees, setTotalEmployees] = useState("");
  const [totalInvoices, setTotalInvoices] = useState("");

  // Employee
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("/api/employees", {
  //         cache: "no-store",
  //       });

  //       if (!res.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       const result = await res.json();
  //       // console.log(result)
  //       setTotalEmployees(result.length);

  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //     fetchData();

  // }, []);

   // Purchases
   useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const response = await fetch(`/api/purchase`);
        const data = await response.json();

        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin
            setTotalPurchase(data.length);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (purchase: { companyId: string; }) => purchase.companyId === session.data.user.companyId
            );
            setTotalPurchase(filteredData.length);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPurchase();
  }, [session.status, session.data]);

  // customer
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customer`);
        const data = await response.json();

        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin

            setTotalCustomers(data.length);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (customer: CustomerTypes) =>
              customer.companyId === session.data.user.companyId
            );
            setTotalCustomers(filteredData.length);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomer();
  }, [session.status, session.data]);

  // messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/messages", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await res.json();
        // console.log(result)
        setTotalMessages(result.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
// Quotations
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`/api/quotation`);
        const data = await response.json();

        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin

            setTotalQuotations(data.length);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (Invoice: PurchaseProduct) =>
                Invoice.companyId === session.data.user.companyId
            );
            setTotalQuotations(filteredData.length);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchInvoices();
  }, [session.status, session.data]);
// invoice
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`/api/primeinvoice`);
        const data = await response.json();

        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin

            setTotalInvoices(data.length);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (Invoice: PurchaseProduct) =>
                Invoice.companyId === session.data.user.companyId
            );
            setTotalInvoices(filteredData.length);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchInvoices();
  }, [session.status, session.data]);
  // console.log("Total Invoices", totalInvoices)
// vendors
  useEffect(() => {
    const FetchClients = async () => {
      try {
        const response = await fetch(`/api/vendor`);
        const data = await response.json();

        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin

            setTotalVendor(data.length);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (client: { companyId: string; }) => client.companyId === session.data.user.companyId
            );
            setTotalVendor(filteredData.length);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    FetchClients();
  }, [session.status, session.data]);
// Product
  useEffect(() => {
    const fetchConsignment = async () => {
      try {
        const response = await fetch(`/api/product`);
        const data = await response.json();

        // Filter consignment based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all consignment for superadmin
            setTotalProducts(data.length);
          } else {
            // Filter consignment to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (consignment: PurchaseProduct) =>
                consignment.companyId === session.data.user.companyId
            );
            setTotalProducts(filteredData.length);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchConsignment();
  }, [session.status, session.data]);
  // user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await res.json();
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all consignment for superadmin
            setTotalUsers(result.length);
          } else {
            // Filter consignment to display only the ones created by the logged-in user
            const filteredData = result.filter(
              (allUsers: { companyId: string; }) => allUsers.companyId === session.data.user.companyId
            );
            setTotalUsers(filteredData.length);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [session.status, session.data]);
  // company
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/company", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await res.json();
        // console.log(result)
        setTotalCompanies(result.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);

    return {
      totalVendor,
      totalCustomers,
      totalUsers,
      totalCompanies,
      totalProducts,
      totalMessages,
      totalEmployees,
      totalQuotations,
      totalInvoices,
      totalPurchase,
    };
};
export default Api;
