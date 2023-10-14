"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FaEdit,
  FaFileExcel,
  FaFilePdf,
  FaDownload,
  FaTrash,
} from "react-icons/fa";
import ReactPDF, { PDFDownloadLink } from "@react-pdf/renderer";
import { generatePrintableContent } from "./PrintableContent";
import ProductApi from "@/app/commonApi/productApi";
import { ProductTypes } from "@/app/types/product";
import { CompanyTypes } from "@/app/types/company";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loading from "@/app/loading";

const ProductList = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const { allProducts, handleDelete } = ProductApi();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilterProducts] = useState<ProductTypes[]>([]);
  const [productOnpage, setProductOnPage] = useState(1);
  const productPerPage = 10;

  const [companyData, setCompanyData] = useState<CompanyTypes | undefined>(
    {} as CompanyTypes
  );
  const [isCompanyDataLoaded, setIsCompanyDataLoaded] = useState(false);

  useEffect(() => {
    // Fetch company data for the logged-in user
    const fetchUserCompanyData = async () => {
      try {
        const response = await axios.get(
          `/api/company/${session?.data?.user.assignedCompany}`
        );
        setCompanyData(response.data);
        setIsCompanyDataLoaded(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user company data:", error);
        setLoading(false);
      }
    };
    if (session?.status === "authenticated") {
      if (session?.data?.user?.assignedCompany) {
        fetchUserCompanyData();
      }
    }
  }, [session]);

  useEffect(() => {
    // Filter po based on searchTerm
    const filteredData = allProducts.filter((invoice) => {
      // Check for matches in main invoice fields
      const mainFieldsMatch = Object.values(invoice).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Return true if there's a match in either the main fields or product details
      return mainFieldsMatch;
    });

    // Update the po with the filteredData
    setFilterProducts(filteredData);
    // Reset the po page to the first page whenever the searchTerm changes
    setProductOnPage(1);
  }, [searchTerm, allProducts]);

  const [selectedInvoiceData, setSelectedInvoiceData] =
    useState<ProductTypes>();
  const handlePrintInvoice = async (_id: string) => {
    try {
      const response = await fetch(`/api/product/${_id}`);
      const invoiceData = await response.json();
      // console.log(invoiceData);
      setSelectedInvoiceData(invoiceData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleUpdateInvoice = async (_id: string) => {
    try {
      const response = await axios.get(`/api/product/${_id}`);
      const productData = response.data;
      router.push(`/products/view/${_id}`, {
        state: { productData },
      } as any);
      // console.log(invoiceData);
    } catch (error) {
      console.error(error);
    }
  };
  // Pagination Logic
  const handleNextPage = () => {
    const pageCount = Math.ceil(allProducts.length / productPerPage);
    if (productOnpage === pageCount) return;
    setProductOnPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (productOnpage === 1) return;
    setProductOnPage((prevPage) => prevPage - 1);
  };
  const handlePageClick = (page: number) => {
    setProductOnPage(page);
  };
  const productStartIndex = (productOnpage - 1) * productPerPage;
  const productEndIndex = productStartIndex + productPerPage;
  const productOnPage = filteredProducts.slice(
    productStartIndex,
    productEndIndex
  );
  const pageCount = Math.ceil(filteredProducts.length / productPerPage);

  const exportToExcel = () => {
    const data = filteredProducts.map((product) => ({
      "Product Name": product.productName,
      "Product Code": product.productCode,
      Category: product.category,
      GST: product.gst,
      "Buying Price": product.buyingPrice,
      "Quantity In Stock": product.inStock,
      "Created By": product.created_by,
      "Added On": new Date(product.date_created).toDateString(),
      "Updated On": new Date(product.updatedAt).toDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, "Products.xlsx");
  };
  if (loading) {
    // Render a loading indicator while data is being fetched
    return <Loading />;
  }
  const dataLength = allProducts.length > 0;

  if (session) {
    return (
      <>
        <Breadcrumb pageName="Products" />
        <div className="relative mb-10 shadow-sm shadow-warning mt-2 px-1 rounded py-4 sm:rounded-lg">
          <div className="flex justify-center text-center shadow-md py-1 text-2xl sfont-medium">
            Products List
          </div>
          {dataLength ? (
            <>
              {/* Search Input */}
              <div className="flex flex-col items-center lg:flex-row-reverse lg:items-end gap-2 sm:gap-4 sm:text-center sm:mb-4 lg:mb-0 px-8 py-1">
                <button
                  className="bg-success text-white rounded  flex px-4 py-1"
                  onClick={exportToExcel}
                >
                  <FaFileExcel className="mr-2 mt-1" />
                  <span>Save As Excel</span>
                </button>
                <input
                  type="text"
                  placeholder="Search by any field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded border py-1"
                />
              </div>

              <div className=" overflow-x-auto ">
                <table className="w-full border text-xs text-left ">
                  <thead className=" border-b ">
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className=" py-2 font-medium text-black dark:text-white">
                        Product Name
                      </th>

                      <th className=" py-2 font-medium text-black dark:text-white">
                        Product Code
                      </th>
                      <th className=" py-2 font-medium text-black dark:text-white">
                        Category
                      </th>
                      <th className=" py-2 font-medium text-black dark:text-white">
                        Brand
                      </th>
                      <th className=" py-2 font-medium text-black dark:text-white">
                        In Stock
                      </th>
                      <th className=" py-2 font-medium text-black dark:text-white">
                        GST
                      </th>
                      <th className=" py-2 font-medium text-black dark:text-white">
                        Cost
                      </th>
                      <th className=" py-2 font-medium text-black dark:text-white">
                        Price
                      </th>

                      <th className=" py-2 font-medium text-black dark:text-white">
                        Created By
                      </th>
                      <th className=" py-2 font-medium text-black dark:text-white">
                        Added On
                      </th>
                      <th className=" py-2 font-medium text-black dark:text-white">
                        Updated On
                      </th>
                      {session?.data?.user.role === "superadmin" && (
                        <th className=" py-2 font-medium text-black dark:text-white">
                          CompID
                        </th>
                      )}
                      <th className=" pl-6 py-2 font-medium text-black dark:text-white ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productOnPage.map((product, _id) => (
                      <tr
                        key={_id}
                        className="w-full text-gray-800 border-b hover:bg-hoverl dark:hover:bg-dark-hover"
                      >
                        <td className=" py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.productName}
                        </td>

                        <td className=" py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.productCode}
                        </td>
                        <td className=" py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.category}
                        </td>
                        <td className=" py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.brand}
                        </td>
                        <td className=" px-2 py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.inStock}
                        </td>
                        <td className="px-2 py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.gst}
                        </td>
                        <td className=" px-2py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.buyingPrice}
                        </td>

                        <td className=" py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.sellingPrice}
                        </td>

                        <td className=" py-2 border-b dark:border-[#eee] border-strokedark">
                          {product.created_by}
                        </td>
                        <td className=" py-2 border-b dark:border-[#eee] border-strokedark">
                          {new Date(product.date_created).toLocaleString()}
                        </td>
                        <td className=" py-2 border-b dark:border-[#eee] border-strokedark">
                          {new Date(product.updatedAt).toLocaleString()}
                        </td>

                        {session?.data?.user.role === "superadmin" && (
                          <td className="py-2 border-b dark:border-[#eee] border-strokedark">
                            {product.companyId}
                          </td>
                        )}
                        <td className=" py-2 flex gap-7 dark:border-[#eee] border-strokedark">
                          {isCompanyDataLoaded ? (
                            selectedInvoiceData?._id === product._id ? (
                              <button
                                className="cursor-pointer  text-success flex"
                                type="button"
                              >
                                <PDFDownloadLink
                                  document={
                                    generatePrintableContent(
                                      selectedInvoiceData,
                                      companyData as CompanyTypes
                                    ) as React.ReactElement<ReactPDF.DocumentProps>
                                  }
                                  fileName={`${product.productName}.pdf`}
                                >
                                  {({ loading }: { loading: boolean }) =>
                                    loading ? "" : <FaFilePdf />
                                  }
                                </PDFDownloadLink>
                              </button>
                            ) : (
                              <FaDownload
                                onClick={() => handlePrintInvoice(product._id)}
                                className="cursor-pointer  text-success "
                              />
                            )
                          ) : null}

                          <FaEdit
                            onClick={() => handleUpdateInvoice(product._id)}
                            className="cursor-pointer  text-warning"
                          />
                          <FaTrash
                            onClick={() => handleDelete(product._id)}
                            className="cursor-pointer text-danger"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <nav
                className="flex items-center justify-between pt-4"
                aria-label="Table navigation"
              >
                <span className="text-md font-normal ">
                  Showing{" "}
                  <span>
                    {productStartIndex + 1}-
                    {Math.min(productEndIndex, allProducts.length)}
                  </span>{" "}
                  of <span> {allProducts.length}</span>
                </span>
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      onClick={handlePreviousPage}
                      disabled={productOnpage === 1}
                      className="block px-2 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray hover:text-black "
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </li>
                  {Array.from({ length: pageCount }).map((_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handlePageClick(index + 1)}
                        className={`block px-3 py-2 leading-tight text-gray-500 ${
                          productOnpage === index + 1
                            ? "z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-100 hover:bg-blue-200 hover:text-blue-700"
                            : "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300  "
                          } hover:bg-secondary hover:text-gray dark:hover:bg-gray dark:hover:text-black`}
                          >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleNextPage}
                      disabled={productEndIndex >= allProducts.length}
                      className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray hover:text-black "
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg text-gray-500 p-10">No data available</p>
            </div>
          )}
        </div>
      </>
    );
  }
};

export default ProductList;
