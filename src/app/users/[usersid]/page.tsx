"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "@/app/common.module.css";
import { UserTypes } from "@/app/types/userType";
import NotFound from "@/components/notFound";
import AuthUsers from "@/utils/auth";
import CompApi from "@/app/commonApi/compApi"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loading from "@/app/loading";
interface UpdateProps {
  params: {
    usersid: string;
  };
}
const UpdateUser:React.FC<UpdateProps> = ({ params: { usersid } }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {isAuthorized}= AuthUsers()
  const {allCompany}= CompApi()
const [loading,setLoading] = useState (true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);
  
  const [user, setUser] = useState<UserTypes>({
    _id:"",
    name: "",
    userName: "",
    email: "",
    role: "",
    isActive: false,
    assignedCompany: "",
    password:"", 
    companyId:"", 
    createdAt: new Date,
  });
  const [password, setPassword] = useState("");
  const handlePassword: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
  };
  // Fetch user details using userid
  useEffect(() => {
    const userDetails = async () => {
      try {
        const response = await axios.get(`/api/users/${usersid}`);
        const userData = response.data;
        setUser(userData);
        setLoading(false)
      } catch (error) {
        console.error(error);
        setLoading(false)

      }
    };
    if (usersid) {
      userDetails();
    }
  }, [usersid]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  // Reset the form fields when isFormSubmitted is true
  useEffect(() => {
    if (isFormSubmitted) {
      setUser({
        _id:"",
        name: "",
        userName: "",
        email: "",
        role: "",
        isActive: false,
        assignedCompany: "",
        password:"", 
        companyId:"", 
        createdAt: new Date,
      });
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);
  // Reset the form fields when Cancel Button clicked
  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthorized){

      router.push("/users");
    }else{
      router.push("/");
    }
  };

  // handleSubmit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = { ...user };
      if (password !== "") {
        updatedUser.password = password;
      }
      const response = await axios.put(`/api/users/${usersid}`, updatedUser);
      console.log(response.data);
      toast.success("User Updated successfully!");
      setIsFormSubmitted(true);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const isSuperAdmin = session && session.user.role === "superadmin";
  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  };
  if (!user || !user._id) {
    return (
      <>
        <NotFound />
      </>
    );
  };


    return (
      <>
      <Breadcrumb pageName="Update User" />
        <div className="flex item-center, justify-center text-2xl, font-medium mt-6 mb-8"> Update {user.name} Details</div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="flex flex-col">
            <span>Name</span>
            <input
              type="text"
              placeholder="Name"
              value={user.name ?? ""}
              className={styles.input}
              onChange={(e) =>
                setUser((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col">
            <span>User Name</span>
            <input
              type="text"
              placeholder="Username"
              value={user.userName ?? ""}
              className={styles.input}
              onChange={(e) =>
                setUser((prevState) => ({
                  ...prevState,
                  userName: e.target.value,
                }))
              }
            />
          </div>
         
          <div className="flex flex-col">
            <span>Email</span>
            <input
              type="email"
              placeholder="Email"
              value={user.email ?? ""}
              className={styles.input}
              onChange={(e) =>
                setUser((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <>
          <div className="flex flex-col">
            <span>Password: <small className="text-warning">use current password  if not changing!</small> </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              required={true}
              onChange={handlePassword}
              className={styles.input}
            />
          </div>
          </>
          {isSuperAdmin && (
            <>
            <div className="flex flex-col">
              <span>Role</span>
              <select
                value={user.role ?? "No Role"}
                onChange={(e) =>
                  setUser((prevState) => ({
                    ...prevState,
                    role: e.target.value as "" | "normal" | "admin" | "superadmin",
                  }))
                }
                className={styles.input}
              >
                <option value="">Select User Role</option>
                <option value="normal">Normal User</option>
                <option value="admin">Admin User</option>
                <option value="superadmin">Super Admin </option>
              </select>
              </div>
              <div className="flex flex-col">
                <span>Company</span>
                <select
                  value={user.assignedCompany ?? ""}
                  onChange={(e) =>
                    setUser((prevState) => ({
                      ...prevState,
                      assignedCompany: e.target.value,
                      companyId: allCompany.find((comp) => comp._id === e.target.value)?.companyId || "",
                    }))}
                    
                  className={styles.input}
                >
                  <option value="">Select Company</option>
                  {allCompany.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <span>Status</span>
                <label 
                  >
                  {/* Checkbox for isActive field */}
                  <input
                    type="checkbox"
                    checked={user.isActive ?? ""}
                    onChange={(e) =>
                      setUser((prevState) => ({
                        ...prevState,
                        isActive: e.target.checked, // Update 'isActive' in the user state
                      }))
                    }
                  />
                  Active
                </label>
              </div>
            </>
          )} 

          <div  className="flex py-2 px-2 mt-4 justify-center  gap-4 flex-col sm:flex-row">
          <button className={styles.saveButton}>Update</button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          </div>
        
        </form>
      </>
    );
};

export default UpdateUser;
