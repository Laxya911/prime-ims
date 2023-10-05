export interface CompanyTypes {
    forEach(arg0: (company: { _id: string; name: string; }) => void): unknown;
    _id: string;
    logo: string ;
    name: string ;
    companyId: string ;
    contact: number ;
    email: string ;
    company_Url: string ;
    doj: string ;
    pancard: string ;
    gstNo: string ;
    address: string ;
    country: string ;
    state: string ;
    city: string ;
    zip: string ;
    bank_name: string ;
    account_no: string ;
    ifsc_code: string ;
    b_branch: string ;
    b_address: string ;
    created_by : string;
    date_created: Date;
  }