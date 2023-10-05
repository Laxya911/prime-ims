export interface UserTypes {
    _id: string;
    name: string;
    userName: string; 
    email: string;
    password: string; 
    role: 'superadmin' | 'admin' | 'normal' | ''; 
    isActive: boolean; // Boolean type
    companyId: string;
    assignedCompany: string;
    createdAt: Date;
}