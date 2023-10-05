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
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ReactPDF, { PDFDownloadLink } from "@react-pdf/renderer";
import { generatePrintableContent } from "./PrintableContent";
import PurchaseOrder from "@/app/commonApi/purchaseApi";
import { CompanyTypes } from "@/app/types/company";
import { PurchaseProduct, Products } from "@/app/types/product";

const PoList = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const { allPurchase, handleDelete } = PurchaseOrder();

  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseData, setPurchaseData] = useState<PurchaseProduct>(
    {} as PurchaseProduct
  );
  const [filteredProducts, setFilteredProducts] = useState<Products[]>(
    []
  );
  const [filterPurchase, setFilterPurchase] = useState<PurchaseProduct[]>([]);
  const [productPage, setProductPage] = useState(1);
  const productPerPage = 10;
  const [purchasePage, setPurchasePage] = useState(1);
  const purchasePerPage = 10;

  useEffect(() => {
    // Filter products based on searchTerm
    const filteredProductsData = allPurchase
      .flatMap((purchase) => purchase.products)
      .filter((product) => {
        return Object.values(product).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      const sortedPurchaseOrder = filteredProductsData.sort(
        (a: Products, b: Products) =>
          new Date(b.date_created).getTime() -
          new Date(a.date_created).getTime()
      );
    setFilteredProducts(sortedPurchaseOrder);

    // Filter direct purchase objects based on searchTerm
    const filteredPurchasesData = allPurchase.filter((purchase) => {
      return Object.values(purchase).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilterPurchase(filteredPurchasesData);
    setProductPage(1)
    setPurchasePage(1)
  }, [searchTerm, allPurchase]);

  // Pagination Start for Produts
  const handleNextPage = () => {
    const pageCount = Math.ceil(filteredProducts.length / productPerPage);
    if (productPage === pageCount) return;
    setProductPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (productPage === 1) return;
    setProductPage((prevPage) => prevPage - 1);
  };

  const handlePageClick = (page: number) => {
    setProductPage(page);
  };

  const productStartIndex = (productPage - 1) * productPerPage;
  const productEndIndex = productStartIndex + productPerPage;
  const productsOnPage = filteredProducts.slice(
    productStartIndex,
    productEndIndex
  );

  const pageCount = Math.ceil(filteredProducts.length / productPerPage);

  const exportToExcel = () => {
    const data = filteredProducts.map((invoice) => ({
      "Vendor Name": invoice.vName,
      "PO Number": invoice.po_Number,
      "Product Code": invoice.productCode,
      "Product Name": invoice.productName,
      Rate: invoice.total,
      "Total amount": invoice.total,
      "Order Qty": invoice.newOrder,
      "Received ": invoice.recvQty,
      Balance: invoice.balQty,
      " Status": invoice.status,
      "Created By": invoice.created_by,
      "Purchase Date": new Date(invoice.date_created).toDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchases");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, "Purchases.xlsx");
  };

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
      } catch (error) {
        console.error("Error fetching user company data:", error);
      }
    };
    if (session?.status === "authenticated") {
      if (session?.data?.user?.assignedCompany) {
        fetchUserCompanyData();
      }
    }
  }, [session]);

  const handlePrint = async (_id: string) => {
    try {
      const response = await axios.get(`/api/purchase/${_id}`);
      const data = response.data;
      setPurchaseData(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdate = async (_id: string | undefined) => {
    try {
      const response = await axios.get(`/api/purchase/${_id}`);
      const invoiceData = response.data;
      router.push(`/purchase/view/${_id}`, { state: { invoiceData } } as any);
    } catch (error) {
      console.error(error);
    }
  };

  // Pagination Start for Purchases
  const handleNext = () => {
    const pageCount = Math.ceil(filterPurchase.length / purchasePerPage);
    if (purchasePage === pageCount) return;
    setPurchasePage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (purchasePage === 1) return;
    setPurchasePage((prevPage) => prevPage - 1);
  };
  const handleClick = (page: number) => {
    setPurchasePage(page);
  };
  const purchaseStartIndex = (purchasePage - 1) * purchasePerPage;
  const purchaseEndIndex = purchaseStartIndex + purchasePerPage;
  const purchaseOnPage = filterPurchase.slice(
    purchaseStartIndex,
    purchaseEndIndex
  );
  const pageCounts = Math.ceil(filterPurchase.length / purchasePerPage);


  if (session) {
    return (
      <>
        <Breadcrumb pageName="Purchase Orders" />
        <div className="relative mb-10 shadow-md sm:rounded-lg">
          <div className="flex justify-center text-center text-2xl m-2 sfont-medium">
            Purchase Orders List
          </div>

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

          <div className=" overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-700 ">
              <thead className="border-b text-gray-700  bg-gray-50 ">
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
               
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    V. Name
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    PO Number
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    P Name
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    P Code
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    Order
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    Received
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    Balance
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    Rate
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    GST
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    Total
                  </th>

                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    Remarks
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    PO Date
                  </th>
                  <th className=" py-2 px-4 font-medium text-black dark:text-white">
                    Added By
                  </th>
                  {session?.data?.user.role === "superadmin" && (
                    <th className=" py-2 px-4 font-medium text-black dark:text-white">
                      CompID
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {productsOnPage.map((product, _id,) => (
                  
                  <tr
                    key={_id}
                    className=" text-gray-800  hover:bg-hoverl dark:hover:bg-dark-hover"
                  >
                 
                    <td className=" py-2 px-4 border-b dark:border-[#eee] border-strokedark ">
                      {product.vName}
                    </td>

                    <td className=" py-2 px-4 border-b dark:border-[#eee] border-strokedark">
                      {product.po_Number?.toString()}
                    </td>

                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.productName}
                    </td>

                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.productCode}
                    </td>

                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.newOrder}
                    </td>
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.recvQty?.toString()}
                    </td>
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.balQty?.toString()}
                    </td>
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.buyingPrice}
                    </td>
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.gst}
                    </td>
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.total}
                    </td>

                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.status}
                    </td>
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.remark}
                    </td>
                    <td className=" py-2 px-0 border-b dark:border-[#eee] border-strokedark">
                      {new Date(product.date_created).toDateString()}
                    </td>
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.created_by}
                    </td>

                    {session?.data?.user.role === "superadmin" && (
                      <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                        {product.companyId}
                      </td>
                    )}
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
                {Math.min(productEndIndex, filteredProducts.length)}
              </span>{" "}
              of <span> {filteredProducts.length}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={handlePreviousPage}
                  disabled={productPage === 1}
                  className="block px-2 py-2  ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 "
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
                    className={`block px-3 py-2  leading-tight text-gray-500 ${
                      productPage === index + 1
                        ? "z-10 px-3 py-2  leading-tight text-blue-600 border border-blue-300 bg-blue-100 hover:bg-blue-200 hover:text-blue-700"
                        : "px-3 py-2  leading-tight text-gray-500 bg-white border border-gray-300  "
                    } hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleNextPage}
                  disabled={productEndIndex >= filteredProducts.length}
                  className="block px-3 py-2  leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 "
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

          <div className="flex flex-col text-lg underline items-center lg:mb-0 py-1 mt-4">
            <p>Purchases</p>
          </div>
          <div className=" overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-700 ">
              <thead className=" border-b text-gray-700  bg-gray-50 ">
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className=" py-2 px-3 font-medium text-black dark:text-white">
                    V. Name
                  </th>
                  <th className=" py-2 px-3 font-medium text-black dark:text-white">
                    PO Number
                  </th>
                  <th className=" py-2 px-3 font-medium text-black dark:text-white">
                    Sub Total
                  </th>
                  <th className=" py-2 px-3 font-medium text-black dark:text-white">
                    Total Gst
                  </th>
                  <th className=" py-2 px-3 font-medium text-black dark:text-white">
                    Grand Total
                  </th>

                  <th className=" py-2 px-3 font-medium text-black dark:text-white">
                    PO Date
                  </th>
                  <th className=" py-2 px-3 font-medium text-black dark:text-white">
                    Added By
                  </th>
                  {session?.data?.user.role === "superadmin" && (
                    <th className=" py-2 px-3 font-medium text-black dark:text-white">
                      CompID
                    </th>
                  )}
                  <th className=" py-2 px-3 font-medium text-black dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseOnPage.map((product, _id) => (
                  <tr
                    key={_id}
                    className=" text-gray-800  hover:bg-hoverl dark:hover:bg-dark-hover"
                  >
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark ">
                      {product.vName}
                    </td>

                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.po_Number?.toString()}
                    </td>

                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.subTotal}
                    </td>

                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.totalGst}
                    </td>

                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.grandTotal}
                    </td>
                    <td className=" py-2 px-0 border-b dark:border-[#eee] border-strokedark">
                      {new Date(product.date_created).toDateString()}
                    </td>
                    <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                      {product.created_by}
                    </td>
                    {session?.data?.user.role === "superadmin" && (
                      <td className=" py-2 px-3 border-b dark:border-[#eee] border-strokedark">
                        {product.companyId}
                      </td>
                    )}
                    <td className="py-3 flex gap-6 border-b dark:border-[#eee] border-strokedark">
                      {isCompanyDataLoaded ? (
                        purchaseData?._id === product._id ? (
                          <button
                            className="cursor-pointer  text-success "
                            type="button"
                          >
                            <PDFDownloadLink
                              document={
                                generatePrintableContent(
                                  purchaseData,
                                  companyData as CompanyTypes
                                ) as React.ReactElement<ReactPDF.DocumentProps>
                              }
                              fileName={`${product.vName}_${product.po_Number}.pdf`}
                            >
                              {({ loading }: { loading: boolean }) =>
                                loading ? "" : <FaFilePdf />
                              }
                            </PDFDownloadLink>
                          </button>
                        ) : (
                          <FaDownload
                            onClick={() => handlePrint(product._id)}
                            className="cursor-pointer  text-success"
                          />
                        )
                      ) : null}

                      <FaEdit
                        onClick={() => handleUpdate(product._id)}
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
                {purchaseStartIndex + 1}-
                {Math.min(productEndIndex, filterPurchase.length)}
              </span>{" "}
              of <span> {filterPurchase.length}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={handlePrevious}
                  disabled={productPage === 1}
                  className="block px-2 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 "
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
              {Array.from({ length: pageCounts }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleClick(index + 1)}
                    className={`block px-3 py-2 leading-tight text-gray-500 ${
                      purchasePage === index + 1
                        ? "z-10 px-3 py-2  leading-tight text-blue-600 border border-blue-300 bg-blue-100 hover:bg-blue-200 hover:text-blue-700"
                        : "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300  "
                    } hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleNext}
                  disabled={purchaseEndIndex >= filterPurchase.length}
                  className="block px-3 py-2  leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 "
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
        </div>
      </>
    );
  }
};

export default PoList;
