
export interface Products {
  awb: string;
  date: string;
  dest: string;
  network: string;
  docType: string;
  weight: string;
  amount: number;
}
export interface InvoiceType {
    _id: string;
    products : Products[];
    sender: String;
    senderEmail: String;
    senderName: String;
    senderContact: number;
    senderGst: String;
    senderAddress: String;
    senderZip: String;
    senderCity: String;
    senderState: String;
    senderCountry: String;
    hsnCode: String;
    totalInWords: String;
    paymentStatus: String;
    invoiceNumber: String;
    igst: number;
    cgst: number;
    sgst: number;
    currency: String;
    subTotal: number;
    grandTotal: String;
    created_by: string;
    date_created: Date;
    companyId: String;
  }