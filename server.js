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

// Initialize Blockchain Manager (lazy initialization for serverless)
let blockchainManager = null;
let isInitialized = false;

function getBlockchainManager() {
    if (!blockchainManager) {
        if (!process.env.VERCEL) console.log('Creating blockchain manager...');
        blockchainManager = new BlockchainManager();
        if (!process.env.VERCEL) console.log('Blockchain manager created successfully');
    }
    return blockchainManager;
}

function ensureInitialized() {
    try {
        const manager = getBlockchainManager();
        if (!isInitialized) {
            if (!process.env.VERCEL) console.log('Initializing blockchain data...');
            initializeMinimalData();
            isInitialized = true;
            if (!process.env.VERCEL) console.log('Blockchain data initialized');
        }
        return manager;
    } catch (error) {
        console.error('Error in ensureInitialized:', error);
        throw error;
    }
}

// ==================== TEST ENDPOINTS ====================
/**
 * GET /api - Test API endpoint (no blockchain operations)
 */
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Blockchain Attendance API is running!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
        serverless: process.env.VERCEL ? true : false
    });
});

/**
 * GET /api/health - Health check endpoint (super lightweight)
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// ==================== DEPARTMENT ENDPOINTS ====================

/**
 * GET /api/departments - Get all departments
 */
app.get('/api/departments', (req, res) => {
    try {
        // Serverless mode - return static data
        if (process.env.VERCEL) {
            res.json({
                success: true,
                data: [{ 
                    id: 'DEPT001', 
                    name: 'Computing Department',
                    status: 'active',
                    serverlessMode: true 
                }],
                count: 1
            });
            return;
        }

        const departments = ensureInitialized().getAllDepartments();
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
        const dept = getBlockchainManager().getDepartment(req.params.id);
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

        const dept = getBlockchainManager().createDepartment(
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
        const block = getBlockchainManager().updateDepartment(
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
        const block = getBlockchainManager().deleteDepartment(req.params.id);

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
        const results = getBlockchainManager().searchDepartments(req.params.term);
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
        const classes = getBlockchainManager().getAllClasses();
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
        const classChain = getBlockchainManager().getClass(req.params.id);
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
        const classes = getBlockchainManager().getClassesByDepartment(req.params.deptId);
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

        const classChain = getBlockchainManager().createClass(
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
        const block = getBlockchainManager().updateClass(req.params.id, req.body);

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
        const block = getBlockchainManager().deleteClass(req.params.id);

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
        const results = getBlockchainManager().searchClasses(req.params.term);
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
        const students = getBlockchainManager().getAllStudents();
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
        const student = getBlockchainManager().getStudent(req.params.id);
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
        const students = getBlockchainManager().getStudentsByClass(req.params.classId);
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
        const students = getBlockchainManager().getStudentsByDepartment(req.params.deptId);
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

        const student = getBlockchainManager().createStudent(
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
        const block = getBlockchainManager().updateStudent(req.params.id, req.body);

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
        const block = getBlockchainManager().deleteStudent(req.params.id);

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
        const results = getBlockchainManager().searchStudents(req.params.term);
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

        const block = getBlockchainManager().markAttendance(
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
                const block = getBlockchainManager().markAttendance(
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
        const history = getBlockchainManager().getStudentAttendanceHistory(req.params.id);
        const student = getBlockchainManager().getStudent(req.params.id);

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
        const attendance = getBlockchainManager().getClassAttendanceByDate(
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
        const attendance = getBlockchainManager().getDepartmentAttendanceByDate(
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
        const report = getBlockchainManager().getValidationReport();

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
        const details = getBlockchainManager().getStudentBlockchainDetails(req.params.id);

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
        const hierarchy = getBlockchainManager().getStudentHierarchy(req.params.id);

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
        // For serverless, return static response to avoid timeouts
        if (process.env.VERCEL) {
            res.json({
                success: true,
                data: {
                    totalDepartments: 1,
                    totalClasses: 1,
                    totalStudents: 1,
                    activeDepartments: 1,
                    activeClasses: 1,
                    activeStudents: 1,
                    serverlessMode: true,
                    message: "Blockchain system ready in serverless mode"
                }
            });
            return;
        }

        const manager = ensureInitialized();
        const stats = {
            totalDepartments: manager.getAllDepartments().length,
            totalClasses: manager.getAllClasses().length,
            totalStudents: manager.getAllStudents().length,
            activeDepartments: manager.getAllDepartments().filter(d => d.status === 'active').length,
            activeClasses: manager.getAllClasses().filter(c => c.status === 'active').length,
            activeStudents: manager.getAllStudents().filter(s => s.status === 'active').length
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
                departments: getBlockchainManager().getAllDepartments().length,
                classes: getBlockchainManager().getAllClasses().length,
                students: getBlockchainManager().getAllStudents().length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== INITIALIZATION FUNCTIONS ====================

function initializeMinimalData() {
    const manager = getBlockchainManager();
    
    // For serverless - skip heavy blockchain operations initially
    try {
        // Only create if doesn't exist AND not in serverless
        if (Object.keys(manager.getAllDepartments()).length === 0) {
            if (process.env.VERCEL) {
                // In serverless, just create empty structure without mining
                console.log('Serverless mode - skipping blockchain mining');
                return;
            }
            
            manager.createDepartment('DEPT001', 'Computing');
            const classChain = manager.createClass('CLASS001', 'Sample Class', 'DEPT001');
            manager.createStudent('STU001', 'Sample Student', 'CLASS001');
            console.log('Minimal data initialized: 1 dept, 1 class, 1 student');
        }
    } catch (error) {
        console.log('Minimal initialization error:', error.message);
    }
}

function initializeDefaultData() {
    console.log('Initializing default data...');
    
    // Skip heavy initialization in serverless environment
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        console.log('Serverless environment detected - using minimal initialization');
        initializeMinimalData();
        return;
    }

    // Create 2 departments
    const departments = [
        { id: 'DEPT001', name: 'School of Computing' },
        { id: 'DEPT002', name: 'School of Software Engineering' }
    ];

    departments.forEach(dept => {
        try {
            getBlockchainManager().createDepartment(dept.id, dept.name);
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
                getBlockchainManager().createClass(classId, className, dept.id);
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
                    getBlockchainManager().createStudent(
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
// Only start server in non-serverless environments
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}`);
        console.log('\nBlockchain system ready - data will be initialized on first API call');
    });
}

// Catch-all handler: send back the React app in production (only for non-API routes)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'client/dist/index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
}

// Export the app for Vercel as a function
module.exports = (req, res) => {
    return app(req, res);
};
