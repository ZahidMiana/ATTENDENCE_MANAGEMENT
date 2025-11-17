const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const BlockchainManager = require('./blockchain/BlockchainManager');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve client build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
}

// Initialize Blockchain Manager
const blockchainManager = new BlockchainManager();

// ==================== TEST ENDPOINTS ====================
/**
 * GET /api - Test API endpoint
 */
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Blockchain Attendance API is running!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// ==================== DEPARTMENT ENDPOINTS ====================

/**
 * GET /api/departments - Get all departments
 */
app.get('/api/departments', (req, res) => {
    try {
        const departments = blockchainManager.getAllDepartments();
        res.json({
            success: true,
            data: departments,
            count: departments.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/departments/:id - Get specific department
 */
app.get('/api/departments/:id', (req, res) => {
    try {
        const dept = blockchainManager.getDepartment(req.params.id);
        if (!dept) {
            return res.status(404).json({
                success: false,
                error: 'Department not found'
            });
        }

        res.json({
            success: true,
            data: {
                ...dept.getCurrentStatus(),
                chain: dept.getHistory()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/departments - Create new department
 */
app.post('/api/departments', (req, res) => {
    try {
        const { departmentId, departmentName, additionalData } = req.body;

        if (!departmentId || !departmentName) {
            return res.status(400).json({
                success: false,
                error: 'departmentId and departmentName are required'
            });
        }

        const dept = blockchainManager.createDepartment(
            departmentId,
            departmentName,
            additionalData || {}
        );

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: {
                departmentId: dept.departmentId,
                departmentName: dept.departmentName,
                latestHash: dept.getLatestHash()
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/departments/:id - Update department
 */
app.put('/api/departments/:id', (req, res) => {
    try {
        const block = blockchainManager.updateDepartment(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: 'Department updated successfully',
            block: {
                index: block.index,
                hash: block.hash,
                timestamp: block.timestamp
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/departments/:id - Soft delete department
 */
app.delete('/api/departments/:id', (req, res) => {
    try {
        const block = blockchainManager.deleteDepartment(req.params.id);

        res.json({
            success: true,
            message: 'Department marked as deleted',
            block: {
                index: block.index,
                hash: block.hash,
                timestamp: block.timestamp
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/departments/search/:term - Search departments
 */
app.get('/api/departments/search/:term', (req, res) => {
    try {
        const results = blockchainManager.searchDepartments(req.params.term);
        res.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== CLASS ENDPOINTS ====================

/**
 * GET /api/classes - Get all classes
 */
app.get('/api/classes', (req, res) => {
    try {
        const classes = blockchainManager.getAllClasses();
        res.json({
            success: true,
            data: classes,
            count: classes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/classes/:id - Get specific class
 */
app.get('/api/classes/:id', (req, res) => {
    try {
        const classChain = blockchainManager.getClass(req.params.id);
        if (!classChain) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        res.json({
            success: true,
            data: {
                ...classChain.getCurrentStatus(),
                chain: classChain.getHistory()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/departments/:deptId/classes - Get classes by department
 */
app.get('/api/departments/:deptId/classes', (req, res) => {
    try {
        const classes = blockchainManager.getClassesByDepartment(req.params.deptId);
        res.json({
            success: true,
            data: classes,
            count: classes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/classes - Create new class
 */
app.post('/api/classes', (req, res) => {
    try {
        const { classId, className, departmentId, additionalData } = req.body;

        if (!classId || !className || !departmentId) {
            return res.status(400).json({
                success: false,
                error: 'classId, className, and departmentId are required'
            });
        }

        const classChain = blockchainManager.createClass(
            classId,
            className,
            departmentId,
            additionalData || {}
        );

        res.status(201).json({
            success: true,
            message: 'Class created successfully',
            data: {
                classId: classChain.classId,
                className: classChain.className,
                departmentId: classChain.departmentId,
                latestHash: classChain.getLatestHash()
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/classes/:id - Update class
 */
app.put('/api/classes/:id', (req, res) => {
    try {
        const block = blockchainManager.updateClass(req.params.id, req.body);

        res.json({
            success: true,
            message: 'Class updated successfully',
            block: {
                index: block.index,
                hash: block.hash,
                timestamp: block.timestamp
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/classes/:id - Soft delete class
 */
app.delete('/api/classes/:id', (req, res) => {
    try {
        const block = blockchainManager.deleteClass(req.params.id);

        res.json({
            success: true,
            message: 'Class marked as deleted',
            block: {
                index: block.index,
                hash: block.hash,
                timestamp: block.timestamp
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/classes/search/:term - Search classes
 */
app.get('/api/classes/search/:term', (req, res) => {
    try {
        const results = blockchainManager.searchClasses(req.params.term);
        res.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== STUDENT ENDPOINTS ====================

/**
 * GET /api/students - Get all students
 */
app.get('/api/students', (req, res) => {
    try {
        const students = blockchainManager.getAllStudents();
        res.json({
            success: true,
            data: students,
            count: students.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/students/:id - Get specific student
 */
app.get('/api/students/:id', (req, res) => {
    try {
        const student = blockchainManager.getStudent(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: {
                ...student.getCurrentStatus(),
                stats: student.getAttendanceStats(),
                chain: student.getHistory()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/classes/:classId/students - Get students by class
 */
app.get('/api/classes/:classId/students', (req, res) => {
    try {
        const students = blockchainManager.getStudentsByClass(req.params.classId);
        res.json({
            success: true,
            data: students,
            count: students.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/departments/:deptId/students - Get students by department
 */
app.get('/api/departments/:deptId/students', (req, res) => {
    try {
        const students = blockchainManager.getStudentsByDepartment(req.params.deptId);
        res.json({
            success: true,
            data: students,
            count: students.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/students - Create new student
 */
app.post('/api/students', (req, res) => {
    try {
        const { studentId, studentName, rollNumber, classId, departmentId, additionalData } = req.body;

        if (!studentId || !studentName || !rollNumber || !classId || !departmentId) {
            return res.status(400).json({
                success: false,
                error: 'studentId, studentName, rollNumber, classId, and departmentId are required'
            });
        }

        const student = blockchainManager.createStudent(
            studentId,
            studentName,
            rollNumber,
            classId,
            departmentId,
            additionalData || {}
        );

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: {
                studentId: student.studentId,
                studentName: student.studentName,
                rollNumber: student.rollNumber,
                classId: student.classId,
                departmentId: student.departmentId,
                latestHash: student.getLatestHash()
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/students/:id - Update student
 */
app.put('/api/students/:id', (req, res) => {
    try {
        const block = blockchainManager.updateStudent(req.params.id, req.body);

        res.json({
            success: true,
            message: 'Student updated successfully',
            block: {
                index: block.index,
                hash: block.hash,
                timestamp: block.timestamp
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/students/:id - Soft delete student
 */
app.delete('/api/students/:id', (req, res) => {
    try {
        const block = blockchainManager.deleteStudent(req.params.id);

        res.json({
            success: true,
            message: 'Student marked as deleted',
            block: {
                index: block.index,
                hash: block.hash,
                timestamp: block.timestamp
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/students/search/:term - Search students
 */
app.get('/api/students/search/:term', (req, res) => {
    try {
        const results = blockchainManager.searchStudents(req.params.term);
        res.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== ATTENDANCE ENDPOINTS ====================

/**
 * POST /api/attendance/mark - Mark attendance for a student
 */
app.post('/api/attendance/mark', (req, res) => {
    try {
        const { studentId, status, date, markedBy } = req.body;

        if (!studentId || !status || !date) {
            return res.status(400).json({
                success: false,
                error: 'studentId, status, and date are required'
            });
        }

        const block = blockchainManager.markAttendance(
            studentId,
            status,
            date,
            markedBy || 'admin'
        );

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            block: {
                index: block.index,
                hash: block.hash,
                timestamp: block.timestamp,
                attendance: block.transactions
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/attendance/mark-bulk - Mark attendance for multiple students
 */
app.post('/api/attendance/mark-bulk', (req, res) => {
    try {
        const { attendanceRecords } = req.body;
        // attendanceRecords: [{ studentId, status, date, markedBy }]

        if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
            return res.status(400).json({
                success: false,
                error: 'attendanceRecords array is required'
            });
        }

        const results = [];
        const errors = [];

        for (const record of attendanceRecords) {
            try {
                const block = blockchainManager.markAttendance(
                    record.studentId,
                    record.status,
                    record.date,
                    record.markedBy || 'admin'
                );
                results.push({
                    studentId: record.studentId,
                    success: true,
                    blockHash: block.hash
                });
            } catch (error) {
                errors.push({
                    studentId: record.studentId,
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            message: `Marked attendance for ${results.length} students`,
            results: results,
            errors: errors
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/students/:id/attendance - Get attendance history for a student
 */
app.get('/api/students/:id/attendance', (req, res) => {
    try {
        const history = blockchainManager.getStudentAttendanceHistory(req.params.id);
        const student = blockchainManager.getStudent(req.params.id);

        res.json({
            success: true,
            data: {
                studentInfo: student.getCurrentStatus(),
                attendanceHistory: history,
                stats: student.getAttendanceStats()
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/classes/:classId/attendance/:date - Get attendance for a class on specific date
 */
app.get('/api/classes/:classId/attendance/:date', (req, res) => {
    try {
        const attendance = blockchainManager.getClassAttendanceByDate(
            req.params.classId,
            req.params.date
        );

        res.json({
            success: true,
            data: attendance,
            count: attendance.length,
            date: req.params.date
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/departments/:deptId/attendance/:date - Get attendance for department on specific date
 */
app.get('/api/departments/:deptId/attendance/:date', (req, res) => {
    try {
        const attendance = blockchainManager.getDepartmentAttendanceByDate(
            req.params.deptId,
            req.params.date
        );

        res.json({
            success: true,
            data: attendance,
            count: attendance.length,
            date: req.params.date
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== BLOCKCHAIN VALIDATION ENDPOINTS ====================

/**
 * GET /api/blockchain/validate - Validate entire blockchain system
 */
app.get('/api/blockchain/validate', (req, res) => {
    try {
        const report = blockchainManager.getValidationReport();

        res.json({
            success: true,
            validation: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/students/:id/blockchain - Get complete blockchain details for a student
 */
app.get('/api/students/:id/blockchain', (req, res) => {
    try {
        const details = blockchainManager.getStudentBlockchainDetails(req.params.id);

        res.json({
            success: true,
            data: details
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/students/:id/hierarchy - Get complete hierarchy for a student
 */
app.get('/api/students/:id/hierarchy', (req, res) => {
    try {
        const hierarchy = blockchainManager.getStudentHierarchy(req.params.id);

        res.json({
            success: true,
            data: hierarchy
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== SYSTEM INFORMATION ====================

/**
 * GET /api/system/info - Get system statistics
 */
app.get('/api/system/info', (req, res) => {
    try {
        const stats = {
            totalDepartments: blockchainManager.getAllDepartments().length,
            totalClasses: blockchainManager.getAllClasses().length,
            totalStudents: blockchainManager.getAllStudents().length,
            activeDepartments: blockchainManager.getAllDepartments().filter(d => d.status === 'active').length,
            activeClasses: blockchainManager.getAllClasses().filter(c => c.status === 'active').length,
            activeStudents: blockchainManager.getAllStudents().filter(s => s.status === 'active').length
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== INITIALIZATION ENDPOINT ====================

/**
 * POST /api/system/initialize - Initialize system with default data
 */
app.post('/api/system/initialize', (req, res) => {
    try {
        initializeDefaultData();
        
        res.json({
            success: true,
            message: 'System initialized with default data',
            stats: {
                departments: blockchainManager.getAllDepartments().length,
                classes: blockchainManager.getAllClasses().length,
                students: blockchainManager.getAllStudents().length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== INITIALIZATION FUNCTION ====================

function initializeDefaultData() {
    console.log('Initializing default data...');

    // Create 2 departments
    const departments = [
        { id: 'DEPT001', name: 'School of Computing' },
        { id: 'DEPT002', name: 'School of Software Engineering' }
    ];

    departments.forEach(dept => {
        try {
            blockchainManager.createDepartment(dept.id, dept.name);
        } catch (error) {
            console.log(`Department ${dept.id} already exists`);
        }
    });

    // Create 5 classes per department
    departments.forEach((dept, deptIndex) => {
        for (let i = 1; i <= 5; i++) {
            const classId = `${dept.id}_CLASS${i}`;
            const className = `${dept.name.split(' ')[2] || 'Class'} ${i}`;
            
            try {
                blockchainManager.createClass(classId, className, dept.id);
            } catch (error) {
                console.log(`Class ${classId} already exists`);
            }
        }
    });

    // Create 35 students per class
    departments.forEach((dept, deptIndex) => {
        for (let classNum = 1; classNum <= 5; classNum++) {
            const classId = `${dept.id}_CLASS${classNum}`;
            
            for (let studentNum = 1; studentNum <= 35; studentNum++) {
                const studentId = `${classId}_STU${String(studentNum).padStart(2, '0')}`;
                const rollNumber = `${dept.id.slice(-3)}${classNum}${String(studentNum).padStart(2, '0')}`;
                const studentName = `Student ${rollNumber}`;
                
                try {
                    blockchainManager.createStudent(
                        studentId,
                        studentName,
                        rollNumber,
                        classId,
                        dept.id
                    );
                } catch (error) {
                    console.log(`Student ${studentId} already exists`);
                }
            }
        }
    });

    console.log('Default data initialization complete!');
}

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Blockchain-Based Attendance Management System API',
        version: '1.0.0',
        endpoints: {
            departments: '/api/departments',
            classes: '/api/classes',
            students: '/api/students',
            attendance: '/api/attendance',
            validation: '/api/blockchain/validate',
            system: '/api/system/info',
            initialize: 'POST /api/system/initialize'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
    console.log('\nInitializing system with default data...');
    
    // Auto-initialize on first run
    try {
        initializeDefaultData();
    } catch (error) {
        console.log('Data already initialized or error occurred');
    }
});

// Catch-all handler: send back the React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

module.exports = { app, blockchainManager };
