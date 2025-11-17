# Blockchain-Based Attendance Management System (BAMS)

## Overview

This is an advanced **multi-layered blockchain-based attendance management system** built with Node.js and vanilla JavaScript. The system implements a **three-tier hierarchical blockchain** structure where:

- **Layer 1**: Department Blockchain (independent chains)
- **Layer 2**: Class Blockchain (child of department chain)
- **Layer 3**: Student Blockchain (child of class chain, contains attendance records)

Each layer is cryptographically linked to its parent, creating a tamper-proof, immutable ledger system.

## Features

### Core Blockchain Features
- ✅ Custom-built blockchain implementation (no external blockchain libraries)
- ✅ SHA-256 hashing algorithm
- ✅ Proof of Work (PoW) mining with difficulty level 4 (hash must start with "0000")
- ✅ Three-layer hierarchical blockchain structure
- ✅ Complete chain validation system
- ✅ Immutable blocks (no deletion or modification)
- ✅ Soft-delete functionality (adds new blocks instead of deleting)

### System Features
- ✅ Full CRUD operations for Departments, Classes, and Students
- ✅ Attendance marking (Present, Absent, Leave)
- ✅ Real-time blockchain visualization
- ✅ Multi-level validation
- ✅ Search functionality
- ✅ Attendance statistics and history
- ✅ RESTful API
- ✅ Modern web interface

## Architecture

### Blockchain Hierarchy

```
Department Blockchain (Layer 1)
    └─> Genesis Block (prev_hash: '0')
         └─> Department Data Blocks

Class Blockchain (Layer 2)
    └─> Genesis Block (prev_hash: Department's latest hash)
         └─> Class Data Blocks

Student Blockchain (Layer 3)
    └─> Genesis Block (prev_hash: Class's latest hash)
         └─> Student Data Blocks
              └─> Attendance Blocks
```

### Block Structure

Each block contains:
- **index**: Block number in the chain
- **timestamp**: Block creation time
- **transactions**: Data payload (department/class/student/attendance info)
- **prev_hash**: Hash of the previous block (or parent chain's hash for genesis blocks)
- **nonce**: Proof of Work nonce value
- **hash**: SHA-256 hash of the block

### File Structure

```
FastTrack/
│
├── blockchain/
│   ├── Block.js                    # Core block implementation
│   ├── Blockchain.js               # Base blockchain class
│   ├── DepartmentBlockchain.js     # Layer 1: Department chain
│   ├── ClassBlockchain.js          # Layer 2: Class chain
│   ├── StudentBlockchain.js        # Layer 3: Student chain
│   ├── BlockchainValidator.js      # Multi-level validation
│   └── BlockchainManager.js        # Manages all chains
│
├── public/
│   ├── index.html                  # Frontend interface
│   ├── styles.css                  # Styling
│   └── app.js                      # Frontend logic
│
├── server.js                       # Express server & API
├── package.json                    # Dependencies
└── README.md                       # Documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup Instructions

1. **Clone or navigate to the project directory**
   ```bash
   cd /home/mubashir123/FastTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and go to: `http://localhost:5000`
   - API endpoint: `http://localhost:5000/api`

## Default Data

The system automatically initializes with:
- **2 Departments**: School of Computing, School of Software Engineering
- **5 Classes per department** (10 total)
- **35 Students per class** (350 total students)

You can reinitialize the system anytime from the Dashboard.

## API Documentation

### Department Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | Get all departments |
| GET | `/api/departments/:id` | Get specific department |
| POST | `/api/departments` | Create new department |
| PUT | `/api/departments/:id` | Update department |
| DELETE | `/api/departments/:id` | Soft delete department |
| GET | `/api/departments/search/:term` | Search departments |

**Create Department Example:**
```json
POST /api/departments
{
  "departmentId": "DEPT003",
  "departmentName": "School of Engineering",
  "additionalData": {}
}
```

### Class Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Get all classes |
| GET | `/api/classes/:id` | Get specific class |
| GET | `/api/departments/:deptId/classes` | Get classes by department |
| POST | `/api/classes` | Create new class |
| PUT | `/api/classes/:id` | Update class |
| DELETE | `/api/classes/:id` | Soft delete class |
| GET | `/api/classes/search/:term` | Search classes |

**Create Class Example:**
```json
POST /api/classes
{
  "classId": "CLASS001",
  "className": "CS101",
  "departmentId": "DEPT001"
}
```

### Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get specific student |
| GET | `/api/classes/:classId/students` | Get students by class |
| GET | `/api/departments/:deptId/students` | Get students by department |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Soft delete student |
| GET | `/api/students/search/:term` | Search students |

**Create Student Example:**
```json
POST /api/students
{
  "studentId": "STU001",
  "studentName": "John Doe",
  "rollNumber": "2024001",
  "classId": "CLASS001",
  "departmentId": "DEPT001"
}
```

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/mark` | Mark attendance for one student |
| POST | `/api/attendance/mark-bulk` | Mark attendance for multiple students |
| GET | `/api/students/:id/attendance` | Get student's attendance history |
| GET | `/api/classes/:classId/attendance/:date` | Get class attendance by date |
| GET | `/api/departments/:deptId/attendance/:date` | Get department attendance by date |

**Mark Attendance Example:**
```json
POST /api/attendance/mark
{
  "studentId": "STU001",
  "status": "Present",
  "date": "2024-11-17",
  "markedBy": "admin"
}
```

Status values: `Present`, `Absent`, `Leave`

### Blockchain Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blockchain/validate` | Validate entire blockchain system |
| GET | `/api/students/:id/blockchain` | Get student's blockchain details |
| GET | `/api/students/:id/hierarchy` | Get student's hierarchy (Dept→Class→Student) |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/info` | Get system statistics |
| POST | `/api/system/initialize` | Initialize with default data |

## Usage Guide

### 1. Dashboard
- View system statistics
- Monitor blockchain status
- Initialize or reset system data

### 2. Department Management
- Add new departments
- View department blockchain
- Update or soft-delete departments
- Search departments

### 3. Class Management
- Create classes under departments
- View class chains
- Update or soft-delete classes
- Search classes

### 4. Student Management
- Add students to classes
- View student information
- Update or soft-delete students
- View attendance statistics
- Search by name or roll number

### 5. Attendance Management
- Select department and class
- Choose date
- Mark individual or bulk attendance
- View attendance history

### 6. Blockchain Visualization
- Select a student
- View their complete blockchain
- See all blocks with hashes and nonces
- Verify cryptographic links

### 7. Validation
- Run complete system validation
- Check all three layers
- Verify parent-child links
- Detect tampering

## Blockchain Validation

The system performs comprehensive validation:

1. **Department Chain Validation**
   - Hash integrity check
   - PoW verification
   - Genesis block validation

2. **Class Chain Validation**
   - All department checks
   - Parent link verification (genesis prev_hash matches department hash)

3. **Student Chain Validation**
   - All previous checks
   - Parent link verification (genesis prev_hash matches class hash)
   - Attendance block validation

4. **Cascading Integrity**
   - If any parent block is tampered, all child chains become invalid
   - Demonstrates true hierarchical blockchain security

## Immutability & Soft Deletes

**Key Principle**: Blocks are NEVER modified or deleted.

### How Updates Work:
1. Original block remains unchanged
2. New block is added with updated data
3. System reads the most recent block for current state
4. Full history is preserved

### How Deletes Work:
1. Original blocks remain in chain
2. New block is added with `status: "deleted"`
3. System filters deleted items in queries
4. Can view full history including deletions

## Technical Implementation

### Hashing Algorithm
```javascript
hash = SHA256(index + timestamp + transactions + prev_hash + nonce)
```

### Proof of Work
- Difficulty: 4
- Target: Hash must start with "0000"
- Mining continues until target is met
- Nonce is incremented on each attempt

### Parent-Child Linking
```javascript
// Class genesis block links to department
classGenesisBlock.prev_hash = departmentChain.getLatestHash()

// Student genesis block links to class
studentGenesisBlock.prev_hash = classChain.getLatestHash()
```

## Testing the System

### Test Blockchain Integrity

1. **Create a student and mark attendance**
2. **View the student's blockchain** - all blocks should be valid
3. **Try to validate** - should show "VALID"
4. **Manually tamper with data** (in memory) - validation should fail

### Test Hierarchical Links

1. **Create Department → Class → Student**
2. **View student hierarchy** - should show all three layers
3. **Check validation** - all parent-child links should be verified

### Test Soft Deletes

1. **Create an entity (department/class/student)**
2. **Delete it** - new block is added with status "deleted"
3. **View blockchain** - both creation and deletion blocks are present
4. **List entities** - deleted entity won't appear (but exists in chain)

## Performance Considerations

- **Block Mining Time**: ~1-5 seconds (depending on PoW difficulty)
- **Chain Validation**: Increases with chain length
- **Bulk Attendance**: Processes each student sequentially
- **Recommended**: For production, consider adjustable difficulty

## Security Features

1. ✅ **Immutability**: Blocks cannot be altered
2. ✅ **Cryptographic Hashing**: SHA-256 ensures data integrity
3. ✅ **Proof of Work**: Prevents easy block creation
4. ✅ **Chain Validation**: Detects any tampering
5. ✅ **Hierarchical Security**: Parent tampering invalidates all children

## Future Enhancements

- [ ] User authentication & authorization
- [ ] Role-based access control
- [ ] Real-time notifications
- [ ] Export data to PDF/Excel
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Database persistence
- [ ] Distributed blockchain network

## Troubleshooting

### Server won't start
- Check if port 5000 is available
- Run: `lsof -i :5000` and kill the process if needed
- Try a different port: `PORT=3000 npm start`

### Dependencies not installing
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Frontend not loading
- Check if server is running
- Verify `http://localhost:5000` is accessible
- Check browser console for errors

### Blockchain validation fails
- This is expected if data was tampered
- Reinitialize system from Dashboard
- Check console logs for specific errors

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is configured for seamless deployment on Vercel with both frontend and backend support.

#### Quick Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

#### Manual Deploy
1. Push code to GitHub/GitLab
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Configure:
   - **Framework**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/dist`

📖 **Detailed Guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment instructions.

### Environment Variables
```bash
NODE_ENV=production
PORT=5000
```

### Project Structure (Deployment Ready)
```
FastTrack/
├── vercel.json           # Vercel configuration
├── server.js            # API server (Serverless function)
├── blockchain/          # Blockchain logic
├── client/             # React frontend
│   └── dist/           # Built assets
└── public/             # Static files
```

## Credits

**Developed by**: Mubashir
**Project**: Blockchain-Based Attendance Management System
**Technology**: Node.js, Express, React, TypeScript, Vite
**Institution**: FastTrack

## License

This project is created for educational purposes as part of an assignment on blockchain technology and distributed systems.

---

**Note**: This is a demonstration project using custom blockchain implementation. For production use, consider additional security measures, database integration, and scalability optimizations.
