import { EmployeeRole, EmployeeType } from "./enums";

export type EmployeeBasicInfo = {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: EmployeeRole;
};

export type EmployeeDetail = {
  id: string;
  photo: string;
  employeeType: EmployeeType;
  officeLocation: string;
  notes: string;
};
