import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { CompanyTypes } from "@/app/types/company";
import { PurchaseProduct } from "@/app/types/product";
const generatePrintableContent = (
  purchaseData: PurchaseProduct,
  companyData: CompanyTypes
) => {
  if (!purchaseData || !companyData) {
    return null;
  }
  const removeCompanyID = purchaseData.qNumber.split("-");
  const newInvoiceNumber = removeCompanyID.slice(1).join("-");
  // Create the PDF content using react-pdf/renderer
  const MyDocument = () => (
    <Document>
      <Page>
        <View style={styles.container}>
          <View style={styles.topHeading}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={
                companyData.logo
                  ? companyData.logo
                  : "/images/fastline_logo.png"
              }
              style={styles.logo}
            />
            <View>
              <Text style={styles.title}>Quotation Details</Text>
            </View>
            <View style={styles.invoiceNumber}>
              <Text>
                Date: {new Date(purchaseData.date_created).toDateString()}
              </Text>
              <Text>Invoice Number: {newInvoiceNumber}</Text>
            </View>
          </View>
          <View style={styles.Details}>
            {/* Display Left side */}
            <View style={styles.companyDetails}>
              <Text style={styles.companyText}>
                Buyer Name: {companyData.name}{" "}
              </Text>
              <Text style={styles.companyText}>
                Number: {companyData.contact}{" "}
              </Text>
              <Text style={styles.companyText}>
                Email: {companyData.email}{" "}
              </Text>
              <Text style={styles.companyText}>
                Add: {companyData.address}{" "}
              </Text>
              <Text style={styles.companyText}>
                GST No. {companyData.gstNo}{" "}
              </Text>
              {/* <Text style={styles.companyText}>
                PAN No. {companyData.pancard}{" "}
              </Text> */}
            </View>

            <View style={styles.customerDetails}>
              <Text style={styles.detailsText}>
                Customer Name: {purchaseData.customerName}
              </Text>
              <Text style={styles.detailsText}>
                Contact: {purchaseData.contact_no}
              </Text>
              <Text style={styles.detailsText}>
                Email: {purchaseData.email}
              </Text>
              <Text style={styles.detailsText}>
                Address: {purchaseData.address}
              </Text>
              {/* <Text style={styles.detailsText}>
                GST No: {purchaseData.gst_vat_no}
              </Text> */}
            </View>
          </View>

          {/* Display Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Item</Text>
              <Text style={styles.tableHeader}>Item code</Text>
              <Text style={styles.tableHeader}>Quantity.</Text>
              <Text style={styles.tableHeader}>Unit</Text>
              <Text style={styles.tableHeader}>Rate</Text>
              <Text style={styles.tableHeader}>GST</Text>
              <Text style={styles.tableHeader}>Total</Text>
            </View>
            {purchaseData.products.map((product, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{product.productName}</Text>
                <Text style={styles.tableCell}>
                  {product.productCode.split("-")[1]}
                </Text>
                <Text style={styles.tableCell}>{product.newOrder}</Text>
                <Text style={styles.tableCell}>{product.unit}</Text>
                <Text style={styles.tableCell}>{product.sellingPrice}</Text>
                <Text style={styles.tableCell}>{product.gst}</Text>
                <Text style={styles.tableCell}>{product.total}</Text>
              </View>
            ))}
          </View>

          {/* Display Calculation */}
          <View style={styles.Details}>
            <View style={styles.companyDetails}>
              <Text style={styles.note}>
                Note:- taxes will be calculate as percentage base if applicable!
              </Text>
            </View>
            <View style={styles.calculation}>
              <Text style={styles.amount}>
                Sub Total: &nbsp;&nbsp;Rs.{purchaseData.subTotal}
              </Text>
              <Text style={styles.amount}>
                Total GST: &nbsp; Rs.{purchaseData.totalGst}
              </Text>
              <Text style={styles.amount}>
                Grand Total: Rs.{purchaseData.grandTotal}
              </Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />

          <View style={styles.conditions}>
            <View>
              <Text>Terms & Conditions :</Text>
              <Text> 1. Payment due on receipt of this bill. </Text>
              <Text>
                2. All disputes are subject to Delhi Jurisdiction only.
              </Text>
              <Text>
                3. {companyData.name}&rsquo;s slaibility is as per the clause
                specified in Airwaybill.
              </Text>
            </View>
            <View style={styles.bankDetails}>
              <Text>BANK DETAILS: </Text>
              <Text>Name: &nbsp; {companyData.bank_name}</Text>
              <Text>A/C NO: &nbsp; {companyData.account_no}</Text>
              <Text>IFSC : &nbsp; {companyData.ifsc_code}</Text>
              <Text>A/C Type: &nbsp; {companyData.account_type}</Text>
              <Text>Branch: &nbsp; {companyData.b_branch}</Text>
              <Text>Address: &nbsp; {companyData.b_address}</Text>
            </View>
          </View>
          <View style={styles.terms}>
            <View>
              <Text>For {companyData.name}</Text>
              <Text>Authorised Signatory</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footer}>Thank You For Your Business</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
  return <MyDocument />;
};
const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 10,
  },
  topHeading: {
    flexDirection: "row",
    marginRight: 35,
    marginLeft: 35,
    justifyContent: "space-between",
  },

  heading: {
    display: "flex",
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: "80px",
    marginLeft: "50px",
    paddingBottom: "4px",
  },
  title: {
    textAlign: "center",
    marginLeft: 20,
    fontSize: "12px",
  },

  invoiceNumber: {
    fontSize: "10px",
    textAlign: "left",
    marginRight: 10,
    marginTop: 15,
    padding: 1,
  },

  logo: {
    height: 36,
    justifyContent: "center",
    marginBottom: "10px",
    textAlign: "center",
  },

  Details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  companyDetails: {
    width: "50%",
    textAlign: "center",
  },
  customerDetails: {
    width: "50%",
    textAlign: "center",
  },
  companyText: {
    fontSize: "10px",
    marginLeft: 40,
    textAlign: "left",
    flexWrap: "wrap",
    padding: 2,
  },
  detailsText: {
    fontSize: "10px",
    marginLeft: 80,
    textAlign: "left",
    flexWrap: "wrap",
    padding: 2,
  },
  table: {
    flexDirection: "column",
    marginBottom: "5px",
    borderTop: 1,
    borderRight: 1,
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    // borderBottom: 1,
    width: "100%",
  },
  tableHeader: {
    flex: 1,
    fontWeight: "bold",
    padding: 2,
    borderBottom: 1,
    borderLeft: 1,
    textAlign: "center",
    width: "100%",
    fontSize: "8px",
  },
  tableCell: {
    flex: 1,
    padding: 2,
    borderBottom: 1,
    borderLeft: 1,
    textAlign: "center",
    width: "100%",
    fontSize: "8px",
  },

  calculation: {
    maxHeight: "240px",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-end",
  },
  note: {
    fontSize: "10px",
    textAlign: "center",
    marginTop: 10,
  },
  amount: {
    fontSize: "8px",
    marginLeft: 90,
    padding: 3,
    alignItems: "flex-end",
    width: "50%",
  },
  totalInWords: {
    fontSize: "12px",
    marginBottom: "2px",
    padding: 3,
    width: "100%",
  },
  terms: {
    marginTop: "12px",
    marginBottom: "14px",
    display: "flex",
    flexDirection: "column",
    fontSize: 10,
  },
  conditions: {
    marginTop: "12px",
    marginBottom: "4px",
    fontSize: 10,
    display: "flex",
    flexDirection: "row",
  },
  bankDetails: {
    marginTop: "8px",
    marginLeft: "210px",
    fontSize: 10,
    width: "50%",
    textAlign: "left",
    alignSelf: "flex-end",
  },

  footer: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  horizontalLine: {
    borderTop: 1,
    borderColor: "black",
    marginTop: 5,
    marginBottom: 5,
  },
});

const PrintableContent = ({ purchaseData, companyData }: any) => {
  if (!purchaseData || !purchaseData.clientDetails || !companyData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      {/* Add a button to download the PDF */}
      <PDFDownloadLink
        document={
          <Document>
            {generatePrintableContent(purchaseData, companyData)}
          </Document>
        }
        fileName="quotation.pdf"
      >
        {({ loading }: { loading: boolean }) =>
          loading ? "Generating" : "Save As PDF"
        }
      </PDFDownloadLink>
    </div>
  );
};
export default PrintableContent;
export { generatePrintableContent };
