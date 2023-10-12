"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "@/app/common.module.css";
import NotFound from "@/components/notFound";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loading from "@/app/loading";
import AuthUsers from "@/utils/auth";
import UnAthorized from "@/components/unauthorized";

interface updatedCompanyProps {
  params: {
    companyid: string;
  };
}
const UpdateCompany: React.FC<updatedCompanyProps> = ({
  params: { companyid },
}) => {
  const router = useRouter();
  const { isSuperAdmin, session } = AuthUsers();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [formData, setFormData] = useState({
    _id: "",
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
    setIsDirty(true);
  };
  useEffect(() => {
    const getCompanyDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/company/${companyid}`);
        const companyData = response.data;
        // console.log(companyData);
        setFormData(companyData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (companyid) {
      getCompanyDetails();
    }
  }, [companyid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedForm = {
        ...formData,
        created_by: session?.data?.user.email,
      };

      const response = await axios.put(
        `/api/company/${companyid}`,
        updatedForm
      );
      if (response.status === 201) {
        toast.success("Company Updated successfully!");
        setIsDirty(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while updating Company data!");
    }
  };
  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/companies");
  };

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }
  if (!formData || !formData._id) {
    return (
      <>
        <NotFound />
      </>
    );
  }
  if (!isSuperAdmin) {
    return <UnAthorized />;
  }
  return (
    <>
      <Breadcrumb pageName="Update Company" />
      <div className="text-center text-2xl justify-center  mb-6 ">
        <h2>Update Company Details </h2>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
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
          <label htmlFor="name">Company ID:</label>
          <input
            type="text"
            className={styles.input}
            id="companyId"
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
            type="text"
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
          <label htmlFor="url">URL:</label>
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
          <label htmlFor="url">Logo:</label>
          <input
            type="text"
            className={styles.input}
            id="logo"
            name="logo"
            placeholder="Com. Logo"
            value={formData.logo}
            onChange={handleChange}
            required
          />
        </div>

        <br />
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={isDirty ? styles.saveButton : styles.disabledButton}
            disabled={!isDirty}
          >
            Update
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
    </>
  );
};

export default UpdateCompany;
