"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "@/app/common.module.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AuthUsers from "@/utils/auth";
import UnAthorized from "@/components/unauthorized";

const AddCompany = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);
  


  const [formData, setFormData] = useState({
    logo: "",
    name: "",
    contact: "",
    email: "",
    companyId: "",
    company_Url: "",
    doj: "",
    pancard: "",
    gstNo: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    bank_name: "",
    account_no: "",
    account_type: "",
    ifsc_code: "",
    b_branch: "",
    b_address: "",
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedForm = {
        ...formData,
        created_by: session?.data?.user?.id,
      };

      const response = await axios.post("/api/company", updatedForm);
      if (response.status === 201) {
        toast.success("Company Added successfully!");
        setFormData({
          logo: "",
          name: "",
          contact: "",
          email: "",
          company_Url: "",
          companyId: "",
          doj: "",
          pancard: "",
          gstNo: "",
          address: "",
          country: "",
          state: "",
          city: "",
          zip: "",
          bank_name: "",
          account_no: "",
          account_type: "",
          ifsc_code: "",
          b_branch: "",
          b_address: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while saving Company data!");
    }
  };
  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  const { isSuperAdmin } = AuthUsers();
  if (!isSuperAdmin) {
    return <UnAthorized />;
  }
  return (
    <>
      <Breadcrumb pageName="Company" />
      <div className="text-center text-2xl justify-center  mb-6 ">
        <h2>Add New Company </h2>
      </div>
      <div className={styles.employee}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Company Name:</label>
            <input
              type="text"
              className={styles.input}
              id="name"
              name="name"
              placeholder="Com. Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="companyId">Company Id:</label>
            <input
              type="text"
              className={styles.input}
              id="CompanyId"
              name="companyId"
              placeholder="Com. Name"
              value={formData.companyId}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Contact Number:</label>

            <input
              type="number"
              className={styles.input}
              id="contact"
              name="contact"
              placeholder="Com. Number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>

            <input
              type="text"
              className={styles.input}
              id="email"
              name="email"
              placeholder="Com. Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dob">DOJ:</label>
            <input
              type="date"
              className={styles.input}
              id="doj"
              name="doj"
              value={formData.doj}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="pancard">Pan No:</label>
            <input
              type="text"
              className={styles.input}
              id="pancard"
              name="pancard"
              placeholder="Com. Pan"
              value={formData.pancard}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gst">GST No:</label>
            <input
              type="text"
              className={styles.input}
              id="gstNo"
              name="gstNo"
              placeholder="Com. GST"
              value={formData.gstNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address:</label>

            <input
              type="text"
              className={styles.input}
              id="address"
              name="address"
              placeholder="Com. Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              className={styles.input}
              id="country"
              name="country"
              placeholder="Com. country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="state">State:</label>
            <input
              type="text"
              className={styles.input}
              id="state"
              name="state"
              placeholder="Com. state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="city">City:</label>
            <input
              type="text"
              className={styles.input}
              id="city"
              name="city"
              placeholder="Com. city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="zip">Zip:</label>
            <input
              type="text"
              className={styles.input}
              id="zip"
              name="zip"
              placeholder="Com. Zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bank_name">Bank Name:</label>

            <input
              type="text"
              className={styles.input}
              id="bank_name"
              name="bank_name"
              placeholder="Bank Name"
              value={formData.bank_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="account_no">Account Number:</label>

            <input
              type="text"
              className={styles.input}
              id="account_no"
              name="account_no"
              placeholder="Account Number"
              value={formData.account_no}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="account_type">Account Type:</label>
            <input
              type="text"
              className={styles.input}
              id="account_type"
              name="account_type"
              placeholder="Account Type"
              value={formData.account_type}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="ifsc_code">IFSC Code:</label>

            <input
              type="text"
              className={styles.input}
              id="ifsc_code"
              name="ifsc_code"
              placeholder="IFSC Code"
              value={formData.ifsc_code}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="b_branch">Bank Branch:</label>
            <input
              type="text"
              className={styles.input}
              id="b_branch"
              name="b_branch"
              placeholder="Bank Branch"
              value={formData.b_branch}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="b_address">Bank Address:</label>

            <input
              type="text"
              className={styles.input}
              id="b_address"
              name="b_address"
              placeholder="Bank Address"
              value={formData.b_address}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="url">Website:</label>
            <input
              type="text"
              className={styles.input}
              id="url"
              name="company_Url"
              placeholder="Com. url"
              value={formData.company_Url}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="url">Company Logo:</label>
            <input
              type="text"
              className={styles.input}
              id="logo"
              name="logo"
              placeholder="Logo"
              value={formData.logo}
              onChange={handleChange}
              required
            />
          </div>

          <br />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCompany;
