import { getEmployeeId } from "./utils";
import { EmployeeRole } from "@/definitions/enums";
import { EmployeeBasicInfo } from "@/definitions/types";

describe("getEmployeeId", () => {
  it("should generate correct ID for first employee of a department", () => {
    const employees: EmployeeBasicInfo[] = [];
    const result = getEmployeeId(employees, "4", "Engineering");
    expect(result).toBe("ENG-001");
  });

  it("should generate correct ID for subsequent employees of the same department", () => {
    const employees: EmployeeBasicInfo[] = [
      {
        id: "ENG-001",
        fullName: "John Doe",
        email: "john@example.com",
        department: "4",
        role: EmployeeRole.Engineer,
      },
      {
        id: "ENG-002",
        fullName: "Jane Smith",
        email: "jane@example.com",
        department: "4",
        role: EmployeeRole.Engineer,
      },
    ];
    const result = getEmployeeId(employees, "4", "Engineering");
    expect(result).toBe("ENG-003");
  });

  it("should handle different departments independently", () => {
    const employees: EmployeeBasicInfo[] = [
      {
        id: "ENG-001",
        fullName: "John Doe",
        email: "john@example.com",
        department: "4",
        role: EmployeeRole.Engineer,
      },
      {
        id: "LEN-001",
        fullName: "Jane Admin",
        email: "jane@example.com",
        department: "1",
        role: EmployeeRole.Admin,
      },
    ];
    const resultEngineering = getEmployeeId(employees, "4", "Engineering");
    const resultLending = getEmployeeId(employees, "1", "Lending");
    expect(resultEngineering).toBe("ENG-002");
    expect(resultLending).toBe("LEN-002");
  });

  it("should generate correct ID for Lending department", () => {
    const employees: EmployeeBasicInfo[] = [];
    const result = getEmployeeId(employees, "1", "Lending");
    expect(result).toBe("LEN-001");
  });

  it("should generate correct ID for Operations department", () => {
    const employees: EmployeeBasicInfo[] = [];
    const result = getEmployeeId(employees, "3", "Operations");
    expect(result).toBe("OPE-001");
  });

  it("should generate correct ID for Funding department", () => {
    const employees: EmployeeBasicInfo[] = [];
    const result = getEmployeeId(employees, "2", "Funding");
    expect(result).toBe("FUN-001");
  });

  it("should pad ID numbers correctly for double digits", () => {
    const employees: EmployeeBasicInfo[] = Array.from(
      { length: 9 },
      (_, i) => ({
        id: `ENG-${String(i + 1).padStart(3, "0")}`,
        fullName: `Engineer ${i + 1}`,
        email: `eng${i + 1}@example.com`,
        department: "4",
        role: EmployeeRole.Engineer,
      })
    );
    const result = getEmployeeId(employees, "4", "Engineering");
    expect(result).toBe("ENG-010");
  });

  it("should pad ID numbers correctly for triple digits", () => {
    const employees: EmployeeBasicInfo[] = Array.from(
      { length: 99 },
      (_, i) => ({
        id: `ENG-${String(i + 1).padStart(3, "0")}`,
        fullName: `Engineer ${i + 1}`,
        email: `eng${i + 1}@example.com`,
        department: "4",
        role: EmployeeRole.Engineer,
      })
    );
    const result = getEmployeeId(employees, "4", "Engineering");
    expect(result).toBe("ENG-100");
  });

  it("should only count employees with matching department", () => {
    const employees: EmployeeBasicInfo[] = [
      {
        id: "ENG-001",
        fullName: "John Engineer",
        email: "john@example.com",
        department: "4",
        role: EmployeeRole.Engineer,
      },
      {
        id: "LEN-001",
        fullName: "Jane Admin",
        email: "jane@example.com",
        department: "1",
        role: EmployeeRole.Admin,
      },
      {
        id: "OPE-001",
        fullName: "Bob Ops",
        email: "bob@example.com",
        department: "3",
        role: EmployeeRole.Ops,
      },
      {
        id: "ENG-002",
        fullName: "Alice Engineer",
        email: "alice@example.com",
        department: "4",
        role: EmployeeRole.Engineer,
      },
    ];
    const result = getEmployeeId(employees, "4", "Engineering");
    expect(result).toBe("ENG-003");
  });

  it("should use first 3 characters of department name in uppercase", () => {
    const employees: EmployeeBasicInfo[] = [];
    const departments = [
      { id: "4", name: "Engineering", expected: "ENG" },
      { id: "1", name: "Lending", expected: "LEN" },
      { id: "3", name: "Operations", expected: "OPE" },
      { id: "2", name: "Funding", expected: "FUN" },
    ];

    departments.forEach(({ id, name, expected }) => {
      const result = getEmployeeId(employees, id, name);
      expect(result.split("-")[0]).toBe(expected);
    });
  });

  it("should handle empty employee array", () => {
    const employees: EmployeeBasicInfo[] = [];
    const result = getEmployeeId(employees, "4", "Engineering");
    expect(result).toBe("ENG-001");
  });
});
