import { EmployeeRole } from "./enums";

export const BADGE_COLORS = {
  [EmployeeRole.Admin]: "bg-purple-100 text-purple-800",
  [EmployeeRole.Ops]: "bg-yellow-100 text-yellow-800",
  [EmployeeRole.Engineer]: "bg-green-100 text-green-800",
  [EmployeeRole.Finance]: "bg-red-100 text-red-800",
};
