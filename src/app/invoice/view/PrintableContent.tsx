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

  // Create the PDF content using react-pdf/renderer
  const MyDocument = () => (
    <Document>
      <Page>
        <View style={styles.container}>
          <View>
             {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={
                companyData.logo
                  ? companyData.logo
                  : "/images/fastline_logo.png"
              }
              style={styles.logo}
            />
          </View>
          <View style={styles.heading}>
            <View>
              <Text style={styles.title}>Purchase Details</Text>
            </View>
            <View>
            <Text style={styles.invoiceNumber}>
                Date: {new Date(purchaseData.date_created).toDateString()}
              </Text>

              <Text style={styles.invoiceNumber}>
                PO Number: {purchaseData.invoiceNumber}
              </Text>
            
            </View>
          </View>
          <View style={styles.Details}>
            {/* Display Left side */}
            <View style={styles.companyDetails}>
              <Text  style={styles.companyText}>Buyer Name: {companyData.name} </Text>
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
              <Text style={styles.companyText}>
                PAN No. {companyData.pancard}{" "}
              </Text>
            </View>

            {/* Display Right side */}

            <View style={styles.customerDetails}>
              <Text style={styles.detailsText}>Customer Details: {purchaseData.customerName}</Text>
              <Text style={styles.detailsText}>
                Contact: {purchaseData.contact_no}
              </Text>
              <Text style={styles.detailsText}>Email: {purchaseData.email}</Text>
              <Text style={styles.detailsText}>
                Address: {purchaseData.address}
              </Text>
              <Text style={styles.detailsText}>
                GST No: {purchaseData.gst_vat_no}
              </Text>
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
                <Text style={styles.tableCell}>{product.productCode}</Text>
                <Text style={styles.tableCell}>{product.newOrder}</Text>
                <Text style={styles.tableCell}>{product.unit}</Text>
                <Text style={styles.tableCell}>{product.sellingPrice}</Text>
                <Text style={styles.tableCell}>{product.gst}</Text>
                <Text style={styles.tableCell}>{product.total}</Text>
              </View>
            ))}
          </View>
          {/* // html example */}

          {/* Display Calculation */}
          <View style={styles.Details}>
            <View style={styles.companyDetails}>
              <Text style={styles.amount}>
                {" "}
                Note:- taxes will be calculate as percentage base if applicable
              </Text>
            </View>
            <View style={styles.calculation}>
              <Text style={styles.amount}>
                Sub Total: {purchaseData.subTotal}
              </Text>
              {/* <Text style={styles.amount}>GST: {purchaseData.gst}</Text> */}

              <Text style={styles.amount}>
                Total GST: &nbsp;
                {purchaseData.totalGst}
              </Text>
              <Text style={styles.amount}>
                Grand Total: &nbsp;
                {purchaseData.grandTotal}
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
              3. {companyData.name}&rsquo;s slaibility is as per the clause specified in
                Airwaybill.
              </Text>
            </View>
            <View style={styles.bankDetails}>
              <Text>BANK DETAILS: </Text>
              <Text>A/C NO. {companyData.account_no}</Text>
              <Text>Bank Name: {companyData.bank_name}</Text>
              <Text>IFSC CODE: {companyData.ifsc_code}</Text>
              <Text>A/C TYPE : {companyData.account_type}</Text>
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
    alignSelf: "flex-end",
    fontSize: "16px",
  },
  invoiceNumber: {
    fontSize: "10px",
    marginBottom: "4px",
    alignSelf: "flex-end",
  },
  logo: {
    height: 36,
    width: "100%",
    justifyContent: "center",
    paddingLeft: "220px",
    paddingRight: "220px",
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
  },
  companyText: {
    fontSize: "10px",
    marginLeft: 50,
    textAlign: "left",
    flexWrap: "wrap",
    padding: 2,
  },
  detailsText: {
    fontSize: "10px",
    marginRight: 10,
    textAlign: "center",
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
    justifyContent: "center", // Change justifyContent to "flex-start"
    alignItems: "center", // Change alignItems to "flex-start"
    width: "50%",
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-end",
  },
  amount: {
    fontSize: "8px",
    marginLeft: 90,
    padding: 3,
    alignItems: "flex-end",
    width: "50%", // Add width: "100%" to make the text take full width
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
    marginLeft: "225px",
    fontSize: 10,
    width: "50%",
    alignSelf: "flex-end",
  },

  footer: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  horizontalLine: {
    borderTop: 1, // Adjust the thickness as needed
    borderColor: "black", // Adjust the color as needed
    marginTop: 5, // Adjust the spacing before the line
    marginBottom: 5, // Adjust the spacing after the line
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
