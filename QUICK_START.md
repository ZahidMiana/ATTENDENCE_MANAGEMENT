# 🚀 Quick Start Guide

## Get Started in 3 Steps

### 1. Start the Server
```bash
cd /home/mubashir123/FastTrack
npm start
```

### 2. Open Your Browser
```
http://localhost:5000
```

### 3. Start Using the System!

## 📱 What You Can Do

### Dashboard
- View system statistics
- See total departments, classes, students
- Monitor blockchain status

### Manage Departments
- Add new departments
- View department blockchain
- Search departments

### Manage Classes  
- Create classes under departments
- View class blockchain
- Link classes to parent departments

### Manage Students
- Add students to classes
- View student information
- See attendance statistics

### Mark Attendance
1. Select department
2. Select class
3. Choose date
4. Mark Present/Absent/Leave for students
5. View blockchain confirmation

### View Blockchain
1. Select a student
2. See their complete blockchain
3. View all blocks with hashes
4. Verify cryptographic security

### Validate System
- Click "Validate Entire System"
- See comprehensive validation report
- Verify all 362 blockchains
- Check parent-child links

## 🧪 Test the API

Run the test script:
```bash
./test-api.sh
```

Or test manually:
```bash
# Get system info
curl http://localhost:5000/api/system/info

# Get all students
curl http://localhost:5000/api/students

# Mark attendance
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -d '{"studentId":"DEPT001_CLASS1_STU01","status":"Present","date":"2025-11-17"}'

# Validate blockchain
curl http://localhost:5000/api/blockchain/validate
```

## 📊 Current System Data

- **2 Departments**: School of Computing, School of Software Engineering
- **10 Classes**: 5 per department
- **350 Students**: 35 per class
- **362 Blockchains**: All interconnected and validated

## 🎯 Try These Features

### 1. Add a New Student
- Go to Students tab
- Click "Add New Student"
- Fill in details
- Watch blockchain mine!

### 2. Mark Class Attendance
- Go to Attendance tab
- Select department and class
- Choose today's date
- Mark all present (or individually)

### 3. View Blockchain
- Go to Blockchain View tab
- Select any student
- See their genesis block linked to class
- View attendance blocks

### 4. Validate System
- Go to Validation tab
- Click "Validate Entire System"
- See that all 362 chains are VALID
- View detailed validation report

## 🔍 Understanding the Blockchain

Each student has a personal blockchain:

```
Block 0 (Genesis)
├─ Type: STUDENT_GENESIS
├─ Linked to: Parent class's latest hash
└─ Hash: 0000abc...

Block 1 (Attendance)
├─ Type: ATTENDANCE  
├─ Status: Present
├─ Date: 2025-11-17
├─ Previous Hash: Block 0's hash
└─ Hash: 0000def...

Block 2 (Attendance)
├─ Type: ATTENDANCE
├─ Status: Absent
├─ Date: 2025-11-18
├─ Previous Hash: Block 1's hash
└─ Hash: 0000ghi...
```

## 💡 Tips

- **Mining takes time**: Each block needs ~1-5 seconds to mine (Proof of Work)
- **All blocks are permanent**: Deleting creates a new "deleted" block
- **Validation is instant**: Check integrity anytime
- **Search is powerful**: Find students by name or roll number
- **Bulk marking**: Mark entire class attendance at once

## 🆘 Troubleshooting

**Server won't start?**
```bash
# Check if port is in use
lsof -i :5000

# Kill existing process if needed
kill -9 <PID>

# Try different port
PORT=3000 npm start
```

**Page not loading?**
- Ensure server is running
- Check http://localhost:5000 (not https)
- Clear browser cache

**API errors?**
- Check server console for errors
- Verify request format matches documentation
- Ensure all required fields are provided

## 📖 Full Documentation

See `README.md` for complete documentation including:
- Detailed API reference
- Architecture explanation
- Technical implementation details
- Security features
- Performance considerations

## 🎉 You're Ready!

Your blockchain-based attendance management system is fully operational. Explore the interface, test the features, and see real blockchain technology in action!

**Access the system**: http://localhost:5000

---

**Need Help?** Check the README.md or PROJECT_SUMMARY.md files for more details.
