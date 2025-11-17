const Blockchain = require('./Blockchain');
const Block = require('./Block');

/**
 * Layer 3: Student Blockchain (Child of Class Chain)
 * Each student has their own personal blockchain ledger
 * Genesis block uses class chain's latest block hash as prev_hash
 * Attendance blocks attach to this personal chain
 */
class StudentBlockchain extends Blockchain {
    constructor(studentId, studentName, rollNumber, classId, departmentId, classLatestHash) {
        super(`Student: ${studentName} (${rollNumber})`);
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.classId = classId;
        this.departmentId = departmentId;
        
        // Create genesis block with parent class's latest hash
        this.createGenesisBlock({
            type: 'STUDENT_GENESIS',
            studentId: this.studentId,
            studentName: this.studentName,
            rollNumber: this.rollNumber,
            classId: this.classId,
            departmentId: this.departmentId,
            action: 'CREATED',
            timestamp: Date.now()
        }, classLatestHash); // Key: uses parent class's hash
    }

    /**
     * Add student data
     */
    addStudent(studentData) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'STUDENT_ADD',
                studentId: this.studentId,
                studentName: this.studentName,
                rollNumber: this.rollNumber,
                classId: this.classId,
                departmentId: this.departmentId,
                data: studentData,
                action: 'CREATED',
                timestamp: Date.now()
            },
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        return newBlock;
    }

    /**
     * Update student - adds new block with updated data
     */
    updateStudent(updatedData) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'STUDENT_UPDATE',
                studentId: this.studentId,
                previousData: {
                    studentName: this.studentName,
                    rollNumber: this.rollNumber
                },
                updatedData: updatedData,
                action: 'UPDATED',
                timestamp: Date.now()
            },
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        
        // Update metadata
        if (updatedData.studentName) {
            this.studentName = updatedData.studentName;
        }
        if (updatedData.rollNumber) {
            this.rollNumber = updatedData.rollNumber;
        }
        
        return newBlock;
    }

    /**
     * Delete student - soft delete
     */
    deleteStudent() {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'STUDENT_DELETE',
                studentId: this.studentId,
                studentName: this.studentName,
                rollNumber: this.rollNumber,
                status: 'deleted',
                action: 'DELETED',
                timestamp: Date.now()
            },
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        return newBlock;
    }

    /**
     * Mark attendance - adds attendance block to student's personal chain
     * This is the core attendance functionality
     */
    markAttendance(attendanceStatus, date, markedBy = 'admin') {
        const attendanceData = {
            type: 'ATTENDANCE',
            studentId: this.studentId,
            studentName: this.studentName,
            rollNumber: this.rollNumber,
            classId: this.classId,
            departmentId: this.departmentId,
            status: attendanceStatus, // 'Present', 'Absent', 'Leave'
            date: date,
            markedBy: markedBy,
            timestamp: Date.now()
        };

        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            attendanceData,
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        return newBlock;
    }

    /**
     * Get attendance history for this student
     */
    getAttendanceHistory() {
        return this.chain
            .filter(block => block.transactions.type === 'ATTENDANCE')
            .map(block => ({
                index: block.index,
                timestamp: block.timestamp,
                date: block.transactions.date,
                status: block.transactions.status,
                markedBy: block.transactions.markedBy,
                hash: block.hash,
                prev_hash: block.prev_hash,
                nonce: block.nonce
            }));
    }

    /**
     * Get attendance for a specific date
     */
    getAttendanceByDate(date) {
        return this.chain
            .filter(block => 
                block.transactions.type === 'ATTENDANCE' && 
                block.transactions.date === date
            )
            .map(block => ({
                status: block.transactions.status,
                timestamp: block.timestamp,
                markedBy: block.transactions.markedBy,
                hash: block.hash
            }));
    }

    /**
     * Get current student status
     */
    getCurrentStatus() {
        if (this.chain.length === 0) {
            return { status: 'non-existent' };
        }

        // Check for deletion
        for (let i = this.chain.length - 1; i >= 0; i--) {
            const block = this.chain[i];
            
            if (block.transactions.status === 'deleted') {
                return { 
                    status: 'deleted', 
                    deletedAt: block.timestamp,
                    blockIndex: block.index 
                };
            }
        }

        // Get latest data
        let latestData = {
            studentId: this.studentId,
            studentName: this.studentName,
            rollNumber: this.rollNumber,
            classId: this.classId,
            departmentId: this.departmentId,
            status: 'active'
        };

        // Apply updates
        for (let i = 1; i < this.chain.length; i++) {
            const block = this.chain[i];
            if (block.transactions.type === 'STUDENT_UPDATE' && block.transactions.updatedData) {
                latestData = { ...latestData, ...block.transactions.updatedData };
            }
        }

        return latestData;
    }

    /**
     * Verify that genesis block is correctly linked to parent class
     */
    verifyParentLink(expectedParentHash) {
        if (this.chain.length === 0) return false;
        
        const genesis = this.chain[0];
        return genesis.prev_hash === expectedParentHash;
    }

    /**
     * Get full history including all transactions
     */
    getHistory() {
        return this.chain.map(block => ({
            index: block.index,
            timestamp: block.timestamp,
            transactions: block.transactions,
            hash: block.hash,
            prev_hash: block.prev_hash,
            nonce: block.nonce
        }));
    }

    /**
     * Calculate attendance statistics
     */
    getAttendanceStats() {
        const attendanceBlocks = this.chain.filter(
            block => block.transactions.type === 'ATTENDANCE'
        );

        const stats = {
            total: attendanceBlocks.length,
            present: 0,
            absent: 0,
            leave: 0
        };

        attendanceBlocks.forEach(block => {
            const status = block.transactions.status.toLowerCase();
            if (status === 'present') stats.present++;
            else if (status === 'absent') stats.absent++;
            else if (status === 'leave') stats.leave++;
        });

        if (stats.total > 0) {
            stats.presentPercentage = ((stats.present / stats.total) * 100).toFixed(2);
        } else {
            stats.presentPercentage = 0;
        }

        return stats;
    }
}

module.exports = StudentBlockchain;
