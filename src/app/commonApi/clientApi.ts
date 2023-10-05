"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { Client } from "../types/client";
const ClientAPI = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session.status, router]);

  const [senderClients, setSenderClients] = useState<Client[]>([]);
  const [receiverClients, setReceiverClients] = useState<Client[]>([]);

  useEffect(() => {
    // Fetch clients from server
    const fetchClients = async () => {
      try {
        const response = await fetch(`/api/client`);
        const data = await response.json();
        const sortedConsignments = data.sort(
          (a: Client, b: Client) =>
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
        );
        // Filter clients based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            setSenderClients(sortedConsignments.filter((client: Client) => client.type === 0));
            setReceiverClients(sortedConsignments.filter((client: Client) => client.type === 1));
          } else {
            const loggedInUserCompany = session.data.user.companyId;
            setSenderClients(
              sortedConsignments.filter(
                (client: Client) =>
                  client.type === 0 && client.companyId === loggedInUserCompany
              )
            );
            setReceiverClients(
              sortedConsignments.filter(
                (client: Client) =>
                  client.type === 1 && client.companyId === loggedInUserCompany
              )
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchClients();
  }, [session.status, session.data]);

  const handleDeleteClient = (_id: string) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this client?");
  
    if (shouldDelete) {
    axios
      .delete(`/api/client/${_id}`)
      .then((response) => {
        const deletedClient = response.data.deletedClient;
        // console.log(deletedClient);
        toast.success("Client Deleted Successfully");
        setSenderClients((prevClients) =>
          prevClients.filter((client) => client._id !== _id)
        );
        setReceiverClients((prevClients) =>
          prevClients.filter((client) => client._id !== _id)
        );
        axios
        .post("/api/activitylog", {
          deletedBy: session?.data?.user.email,
          userName:  session?.data?.user.name,
          deletedItem: deletedClient._id,
          deletedName: deletedClient.name,
          deletedEmail: deletedClient.email,
          itemType: "Client"
        })
        // .then(() => {
        //   console.log("Activity log added successfully");
        // })
        // .catch((error) => {
        //   console.error("Error adding activity log:", error);
        // });
      })
      .catch((error) => {
        toast.error("Client Not Deleted");
        console.error(error);
      });
  }

};
  return {
    senderClients,
    receiverClients,
    handleDeleteClient,
  };
};

export default ClientAPI;
