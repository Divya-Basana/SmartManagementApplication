export interface User {
  id?: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phone: string;
  employeeType: string;
  companyName: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}
