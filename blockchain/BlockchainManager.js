const DepartmentBlockchain = require('./DepartmentBlockchain');
const ClassBlockchain = require('./ClassBlockchain');
const StudentBlockchain = require('./StudentBlockchain');
const BlockchainValidator = require('./BlockchainValidator');

/**
 * Blockchain Manager
 * Manages all three layers of the hierarchical blockchain system
 */
class BlockchainManager {
    constructor() {
        this.departments = {}; // departmentId -> DepartmentBlockchain
        this.classes = {};     // classId -> ClassBlockchain
        this.students = {};    // studentId -> StudentBlockchain
        this.validator = new BlockchainValidator();
    }

    // ==================== DEPARTMENT OPERATIONS ====================

    /**
     * Create a new department
     */
    createDepartment(departmentId, departmentName, additionalData = {}) {
        if (this.departments[departmentId]) {
            throw new Error(`Department ${departmentId} already exists`);
        }

        const deptChain = new DepartmentBlockchain(departmentId, departmentName);
        
        // Add additional data if provided
        if (Object.keys(additionalData).length > 0) {
            deptChain.addDepartment(additionalData);
        }

        this.departments[departmentId] = deptChain;
        
        console.log(`Department created: ${departmentName} (${departmentId})`);
        return deptChain;
    }

    /**
     * Get department by ID
     */
    getDepartment(departmentId) {
        return this.departments[departmentId];
    }

    /**
     * Get all departments
     */
    getAllDepartments() {
        const result = [];
        for (const [id, chain] of Object.entries(this.departments)) {
            const status = chain.getCurrentStatus();
            result.push({
                departmentId: id,
                ...status,
                chainLength: chain.getChainLength(),
                latestHash: chain.getLatestHash()
            });
        }
        return result;
    }

    /**
     * Update department
     */
    updateDepartment(departmentId, updatedData) {
        const dept = this.departments[departmentId];
        if (!dept) {
            throw new Error(`Department ${departmentId} not found`);
        }

        return dept.updateDepartment(updatedData);
    }

    /**
     * Delete department (soft delete)
     */
    deleteDepartment(departmentId) {
        const dept = this.departments[departmentId];
        if (!dept) {
            throw new Error(`Department ${departmentId} not found`);
        }

        return dept.deleteDepartment();
    }

    /**
     * Search departments by name
     */
    searchDepartments(searchTerm) {
        const results = [];
        for (const [id, chain] of Object.entries(this.departments)) {
            const status = chain.getCurrentStatus();
            if (status.departmentName && 
                status.departmentName.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                    departmentId: id,
                    ...status
                });
            }
        }
        return results;
    }

    // ==================== CLASS OPERATIONS ====================

    /**
     * Create a new class under a department
     */
    createClass(classId, className, departmentId, additionalData = {}) {
        if (this.classes[classId]) {
            throw new Error(`Class ${classId} already exists`);
        }

        const dept = this.departments[departmentId];
        if (!dept) {
            throw new Error(`Department ${departmentId} not found`);
        }

        // Check if department is deleted
        const deptStatus = dept.getCurrentStatus();
        if (deptStatus.status === 'deleted') {
            throw new Error(`Cannot create class under deleted department ${departmentId}`);
        }

        // Get parent department's latest hash for genesis block
        const parentHash = dept.getLatestHash();

        const classChain = new ClassBlockchain(
            classId,
            className,
            departmentId,
            parentHash
        );

        // Add additional data if provided
        if (Object.keys(additionalData).length > 0) {
            classChain.addClass(additionalData);
        }

        this.classes[classId] = classChain;
        
        console.log(`Class created: ${className} (${classId}) under department ${departmentId}`);
        return classChain;
    }

    /**
     * Get class by ID
     */
    getClass(classId) {
        return this.classes[classId];
    }

    /**
     * Get all classes
     */
    getAllClasses() {
        const result = [];
        for (const [id, chain] of Object.entries(this.classes)) {
            const status = chain.getCurrentStatus();
            result.push({
                classId: id,
                ...status,
                chainLength: chain.getChainLength(),
                latestHash: chain.getLatestHash()
            });
        }
        return result;
    }

    /**
     * Get classes by department
     */
    getClassesByDepartment(departmentId) {
        const result = [];
        for (const [id, chain] of Object.entries(this.classes)) {
            if (chain.departmentId === departmentId) {
                const status = chain.getCurrentStatus();
                result.push({
                    classId: id,
                    ...status,
                    chainLength: chain.getChainLength()
                });
            }
        }
        return result;
    }

    /**
     * Update class
     */
    updateClass(classId, updatedData) {
        const classChain = this.classes[classId];
        if (!classChain) {
            throw new Error(`Class ${classId} not found`);
        }

        return classChain.updateClass(updatedData);
    }

    /**
     * Delete class (soft delete)
     */
    deleteClass(classId) {
        const classChain = this.classes[classId];
        if (!classChain) {
            throw new Error(`Class ${classId} not found`);
        }

        return classChain.deleteClass();
    }

    /**
     * Search classes
     */
    searchClasses(searchTerm) {
        const results = [];
        for (const [id, chain] of Object.entries(this.classes)) {
            const status = chain.getCurrentStatus();
            if (status.className && 
                status.className.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                    classId: id,
                    ...status
                });
            }
        }
        return results;
    }

    // ==================== STUDENT OPERATIONS ====================

    /**
     * Create a new student
     */
    createStudent(studentId, studentName, rollNumber, classId, departmentId, additionalData = {}) {
        if (this.students[studentId]) {
            throw new Error(`Student ${studentId} already exists`);
        }

        const classChain = this.classes[classId];
        if (!classChain) {
            throw new Error(`Class ${classId} not found`);
        }

        // Check if class is deleted
        const classStatus = classChain.getCurrentStatus();
        if (classStatus.status === 'deleted') {
            throw new Error(`Cannot create student under deleted class ${classId}`);
        }

        // Get parent class's latest hash for genesis block
        const parentHash = classChain.getLatestHash();

        const studentChain = new StudentBlockchain(
            studentId,
            studentName,
            rollNumber,
            classId,
            departmentId,
            parentHash
        );

        // Add additional data if provided
        if (Object.keys(additionalData).length > 0) {
            studentChain.addStudent(additionalData);
        }

        this.students[studentId] = studentChain;
        
        console.log(`Student created: ${studentName} (${rollNumber}) in class ${classId}`);
        return studentChain;
    }

    /**
     * Get student by ID
     */
    getStudent(studentId) {
        return this.students[studentId];
    }

    /**
     * Get all students
     */
    getAllStudents() {
        const result = [];
        for (const [id, chain] of Object.entries(this.students)) {
            const status = chain.getCurrentStatus();
            const stats = chain.getAttendanceStats();
            result.push({
                studentId: id,
                ...status,
                chainLength: chain.getChainLength(),
                attendanceStats: stats
            });
        }
        return result;
    }

    /**
     * Get students by class
     */
    getStudentsByClass(classId) {
        const result = [];
        for (const [id, chain] of Object.entries(this.students)) {
            if (chain.classId === classId) {
                const status = chain.getCurrentStatus();
                const stats = chain.getAttendanceStats();
                result.push({
                    studentId: id,
                    ...status,
                    attendanceStats: stats
                });
            }
        }
        return result;
    }

    /**
     * Get students by department
     */
    getStudentsByDepartment(departmentId) {
        const result = [];
        for (const [id, chain] of Object.entries(this.students)) {
            if (chain.departmentId === departmentId) {
                const status = chain.getCurrentStatus();
                const stats = chain.getAttendanceStats();
                result.push({
                    studentId: id,
                    ...status,
                    attendanceStats: stats
                });
            }
        }
        return result;
    }

    /**
     * Update student
     */
    updateStudent(studentId, updatedData) {
        const student = this.students[studentId];
        if (!student) {
            throw new Error(`Student ${studentId} not found`);
        }

        return student.updateStudent(updatedData);
    }

    /**
     * Delete student (soft delete)
     */
    deleteStudent(studentId) {
        const student = this.students[studentId];
        if (!student) {
            throw new Error(`Student ${studentId} not found`);
        }

        return student.deleteStudent();
    }

    /**
     * Search students by name or roll number
     */
    searchStudents(searchTerm) {
        const results = [];
        for (const [id, chain] of Object.entries(this.students)) {
            const status = chain.getCurrentStatus();
            if ((status.studentName && 
                 status.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (status.rollNumber && 
                 status.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))) {
                results.push({
                    studentId: id,
                    ...status
                });
            }
        }
        return results;
    }

    // ==================== ATTENDANCE OPERATIONS ====================

    /**
     * Mark attendance for a student
     */
    markAttendance(studentId, attendanceStatus, date, markedBy = 'admin') {
        const student = this.students[studentId];
        if (!student) {
            throw new Error(`Student ${studentId} not found`);
        }

        // Check if student is deleted
        const studentStatus = student.getCurrentStatus();
        if (studentStatus.status === 'deleted') {
            throw new Error(`Cannot mark attendance for deleted student ${studentId}`);
        }

        // Validate attendance status
        if (!['Present', 'Absent', 'Leave'].includes(attendanceStatus)) {
            throw new Error(`Invalid attendance status: ${attendanceStatus}`);
        }

        return student.markAttendance(attendanceStatus, date, markedBy);
    }

    /**
     * Get attendance history for a student
     */
    getStudentAttendanceHistory(studentId) {
        const student = this.students[studentId];
        if (!student) {
            throw new Error(`Student ${studentId} not found`);
        }

        return student.getAttendanceHistory();
    }

    /**
     * Get attendance for a specific date and class
     */
    getClassAttendanceByDate(classId, date) {
        const students = this.getStudentsByClass(classId);
        const results = [];

        for (const studentInfo of students) {
            const student = this.students[studentInfo.studentId];
            const attendance = student.getAttendanceByDate(date);
            
            results.push({
                studentId: studentInfo.studentId,
                studentName: studentInfo.studentName,
                rollNumber: studentInfo.rollNumber,
                attendance: attendance.length > 0 ? attendance[0].status : 'Not Marked'
            });
        }

        return results;
    }

    /**
     * Get attendance for entire department by date
     */
    getDepartmentAttendanceByDate(departmentId, date) {
        const students = this.getStudentsByDepartment(departmentId);
        const results = [];

        for (const studentInfo of students) {
            const student = this.students[studentInfo.studentId];
            const attendance = student.getAttendanceByDate(date);
            
            results.push({
                studentId: studentInfo.studentId,
                studentName: studentInfo.studentName,
                rollNumber: studentInfo.rollNumber,
                classId: studentInfo.classId,
                attendance: attendance.length > 0 ? attendance[0].status : 'Not Marked'
            });
        }

        return results;
    }

    // ==================== VALIDATION OPERATIONS ====================

    /**
     * Validate the entire blockchain system
     */
    validateSystem() {
        return this.validator.validateEntireSystem(this);
    }

    /**
     * Get validation report
     */
    getValidationReport() {
        this.validator.validateEntireSystem(this);
        return this.validator.generateReport();
    }

    /**
     * Get blockchain details for a student (for visualization)
     */
    getStudentBlockchainDetails(studentId) {
        const student = this.students[studentId];
        if (!student) {
            throw new Error(`Student ${studentId} not found`);
        }

        return {
            studentInfo: student.getCurrentStatus(),
            chain: student.getHistory(),
            isValid: student.isChainValid(),
            stats: student.getAttendanceStats()
        };
    }

    /**
     * Get complete hierarchy for a student (Department -> Class -> Student)
     */
    getStudentHierarchy(studentId) {
        const student = this.students[studentId];
        if (!student) {
            throw new Error(`Student ${studentId} not found`);
        }

        const classChain = this.classes[student.classId];
        const deptChain = this.departments[student.departmentId];

        return {
            department: deptChain ? deptChain.getCurrentStatus() : null,
            class: classChain ? classChain.getCurrentStatus() : null,
            student: student.getCurrentStatus(),
            links: {
                studentToClass: student.verifyParentLink(classChain.getLatestHash()),
                classToDepartment: classChain.verifyParentLink(deptChain.getLatestHash())
            }
        };
    }
}

module.exports = BlockchainManager;
