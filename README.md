# Employee Wizard Form

A Next.js application with TypeScript for managing employee information using a multi-step wizard form.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **ESLint & Prettier**
- **Jest & React Testing Library**
- **json-server** - Mock REST APIs

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd wizard-form
```

2. Install dependencies:

```bash
yarn install
```

### Running Locally

#### Run All Services (Recommended)

Start the Next.js app and both mock API servers simultaneously:

```bash
yarn dev:all
```

This will start:

- **Frontend**: http://localhost:3000
- **Basic Info API**: http://localhost:4001
- **Details API**: http://localhost:4002

## API Endpoints

### Basic Info API (Port 4001)

Base URL: `http://localhost:4001`

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | `/basicInfo`     | Get all employees       |
| GET    | `/basicInfo/:id` | Get employee by ID      |
| POST   | `/basicInfo`     | Create new employee     |
| PUT    | `/basicInfo/:id` | Update employee         |
| PATCH  | `/basicInfo/:id` | Partial update employee |
| DELETE | `/basicInfo/:id` | Delete employee         |

**Employee Basic Info Schema:**

```json
{
  "id": "ENG-001",
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "department": "4",
  "role": "ENGINEER"
}
```

**Fields:**

- `id` (string): Employee ID in format `<DEPT_CODE>-<SEQ>` (e.g., ENG-001, LEN-001, OPE-001, FUN-001)
- `fullName` (string): Employee's full name
- `email` (string): Employee's email address
- `department` (string): Department ID (reference to departments endpoint)
- `role` (enum): Employee role - `ADMIN`, `OPS`, `ENGINEER`, or `FINANCE`

**Additional Endpoints:**

| Method | Endpoint                    | Description                               |
| ------ | --------------------------- | ----------------------------------------- |
| GET    | `/departments`              | Get all departments                       |
| GET    | `/departments/:id`          | Get department by ID                      |
| GET    | `/departments?name_like=:q` | Search departments by name (autocomplete) |

**Department Schema:**

```json
{
  "id": "1",
  "name": "Lending"
}
```

**Available Departments:**

- Lending (ID: "1") - Prefix: LEN
- Funding (ID: "2") - Prefix: FUN
- Operations (ID: "3") - Prefix: OPE
- Engineering (ID: "4") - Prefix: ENG

### Details API (Port 4002)

Base URL: `http://localhost:4002`

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| GET    | `/details`     | Get all employee details    |
| GET    | `/details/:id` | Get employee details by ID  |
| POST   | `/details`     | Create new employee details |
| PUT    | `/details/:id` | Update employee details     |
| PATCH  | `/details/:id` | Partial update details      |
| DELETE | `/details/:id` | Delete employee details     |

**Employee Details Schema:**

```json
{
  "id": "ENG-001",
  "photo": "https://i.pravatar.cc/150?img=1",
  "employeeType": "FULL_TIME",
  "officeLocation": "1",
  "notes": "Experienced software engineer with expertise in full-stack development."
}
```

**Fields:**

- `id` (string): Employee ID in format `<DEPT_CODE>-<SEQ>` (e.g., ENG-001, LEN-001)
- `photo` (string): Base64 encoded image or URL to employee photo
- `employeeType` (enum): Employment type - `FULL_TIME`, `PART_TIME`, `CONTRACT`, or `INTERN`
- `officeLocation` (string): Office location ID (reference to locations endpoint)
- `notes` (string): Additional notes about the employee

**Additional Endpoints:**

| Method | Endpoint                  | Description                             |
| ------ | ------------------------- | --------------------------------------- |
| GET    | `/locations`              | Get all office locations                |
| GET    | `/locations/:id`          | Get location by ID                      |
| GET    | `/locations?name_like=:q` | Search locations by name (autocomplete) |

**Location Schema:**

```json
{
  "id": "1",
  "name": "Jakarta"
}
```

**Available Locations:**

- Jakarta (ID: "1")
- Depok (ID: "2")
- Surabaya (ID: "3")

## Example API Usage

```bash
# Get all employees (Basic Info)
curl http://localhost:4001/basicInfo

# Get specific employee (Basic Info)
curl http://localhost:4001/basicInfo/LEN-001

# Get all departments
curl http://localhost:4001/departments

# Search departments by name (autocomplete with 500ms debounce)
curl "http://localhost:4001/departments?name_like=Lend"

# Get all employee details
curl http://localhost:4002/details

# Get details for specific employee
curl http://localhost:4002/details/LEN-001

# Get all locations
curl http://localhost:4002/locations

# Search locations by name (autocomplete with 500ms debounce)
curl "http://localhost:4002/locations?name_like=Jak"

# Create new employee (Basic Info)
curl -X POST http://localhost:4001/basicInfo \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ENG-002",
    "fullName": "Alice Anderson",
    "email": "alice.anderson@company.com",
    "department": "4",
    "role": "ENGINEER"
  }'

# Create employee details
curl -X POST http://localhost:4002/details \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ENG-002",
    "photo": "data:image/jpeg;base64,...",
    "employeeType": "FULL_TIME",
    "officeLocation": "1",
    "notes": "New hire - Frontend specialist"
  }'
```

## Available Scripts

```bash
yarn dev          # Start Next.js development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn test         # Run Jest tests
yarn test:watch   # Run Jest in watch mode
yarn dev:all      # Start all services (Next.js + Mock APIs)
yarn server:mock  # Start both mock API servers
yarn server:basic-info  # Start basic info API (port 4001)
yarn server:details     # Start details API (port 4002)
```

## Project Structure

```
wizard-form/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout (centered container)
│   ├── page.tsx           # Home page - Employee List
│   └── wizard/
│       └── page.tsx       # Wizard form page
├── components/            # React components
├── lib/                   # Utility functions
├── mock-api/              # Mock API data
│   ├── basic-info/
│   │   └── db.json       # Employee basic info data
│   └── details/
│       └── db.json       # Employee details data
├── public/                # Static assets
└── ...config files
```

## Development Notes

- The mock APIs use json-server which provides a full fake REST API
- Data is automatically saved to the JSON files when modified
- All APIs support standard REST operations (GET, POST, PUT, PATCH, DELETE)
- CORS is enabled by default on json-server for local development
- Employee IDs are auto-generated based on department (e.g., ENG-001, LEN-002, OPE-001, FUN-001)
- Department and location autocomplete uses debounced search (500ms) with `name_like` query parameter
- Photos are stored as base64 encoded strings in the database
- Draft data is persisted in localStorage with 2-second debounce

## License

MIT
