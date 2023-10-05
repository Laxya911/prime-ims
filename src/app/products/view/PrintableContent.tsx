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
import { ProductTypes } from "@/app/types/product";
const generatePrintableContent = (
  invoiceData: ProductTypes,
  companyData: CompanyTypes
) => {
  if (!invoiceData || !companyData) {
    return null;
  }

  // Create the PDF content using react-pdf/renderer
  const MyDocument = () => (
    <Document>
      <Page>
        <View style={styles.container}>
          
            {/* Display Left side */}
            <View style={styles.companyDetails}>
              <View>
              <Image
                src={
                  companyData.logo
                    ? companyData.logo
                    : "/images/fastline_logo.png"
                }
                style={{
                  width: "150px",
                  height: "70px",
                  padding: 12,
                  marginBottom: 10,
                }}
              />
              </View>
               <View>
              <Text style={styles.companyText}>Company: {companyData.name} </Text>
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
            </View>
            {/* Display Right side */}
            <View style={styles.heading}>
            <Text style={styles.title}>Product Details</Text>
            <Text style={styles.invoiceNumber}>
              Item ID: {invoiceData._id}
            </Text>
          </View>

          {/* Display Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Item Name</Text>
              <Text style={styles.tableHeader}>Item Code</Text>
              <Text style={styles.tableHeader}>Category</Text>
              <Text style={styles.tableHeader}>In Stock</Text>
              <Text style={styles.tableHeader}>Rate</Text>
              <Text style={styles.tableHeader}>GST</Text>
              <Text style={styles.tableHeader}>Unit</Text>
              <Text style={styles.tableHeader}>Added On</Text>
            </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{invoiceData.productName}</Text>
                <Text style={styles.tableCell}>{invoiceData.productCode}</Text>
                <Text style={styles.tableCell}>{invoiceData.category}</Text>
                <Text style={styles.tableCell}>{invoiceData.inStock}</Text>
                <Text style={styles.tableCell}>{invoiceData.buyingPrice}</Text>
                <Text style={styles.tableCell}>{invoiceData.gst}</Text>
                <Text style={styles.tableCell}>{invoiceData.unit}</Text>
                <Text style={styles.tableCell}>{new Date(invoiceData.date_created).toDateString()}</Text>
              </View>
          </View>

          {/* Display Calculation */}
          <View style={styles.companyDetails}>
            <View style={styles.companyDetails}>
              <Text style={styles.amount}>
                {" "}
                Note:- taxes will be calculate as percentage base if applicable
              </Text>
            </View>
            <View style={styles.calculation}>
              <Text style={styles.amount}>
                Rate: {invoiceData.buyingPrice}
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
                3. Fastlines laibility is as per the clause specified in
                Airwaybill.
              </Text>
            </View>
            <View style={styles.bankDetails}>
              <Text>BANK DETAILS: </Text>
              <Text>A/C NO: {companyData.account_no} </Text>
              <Text>Bank Name: {companyData.bank_name}</Text>
              <Text>Bank Address: {companyData.b_address}</Text>
              <Text>Branch: {companyData.b_branch}</Text>
              <Text>IFSC: {companyData.ifsc_code}</Text>
              <Text>A/C Type: Current</Text>
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
    padding: 25,
    margin: 15,
  },
  heading: {
    display: "flex",
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: "80px",
    marginLeft: "50px",
    paddingBottom: "10px",
  },
  title: {
    alignSelf: "flex-end",
    fontSize: "16px",
  },
  invoiceNumber: {
    fontSize: "10px",
    alignSelf: "flex-end",
  },
  logo: {
    height: 30,
    width: 90,
    marginLeft: 50,
    justifyContent: "center",
    textAlign: "center",
  },

  companyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "15px",
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
    fontSize: "10px",
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

const PrintableContent = ({ invoiceData, companyData }: any) => {
  if (!invoiceData || !invoiceData.clientDetails || !companyData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      {/* Add a button to download the PDF */}
      <PDFDownloadLink
        document={
          <Document>
            {generatePrintableContent(invoiceData, companyData)}
          </Document>
        }
        fileName="invoice.pdf"
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
