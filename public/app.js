// API Base URL
const API_URL = 'http://localhost:5000/api';

// Current state
let currentTab = 'dashboard';
let departments = [];
let classes = [];
let students = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSystemInfo();
    loadDepartments();
    loadClasses();
    loadStudents();
    setupFormHandlers();
    
    // Set default date to today
    const dateInput = document.getElementById('attendance-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
});

// Tab Navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    currentTab = tabName;
    
    // Load data for specific tabs
    if (tabName === 'departments') loadDepartments();
    if (tabName === 'classes') loadClasses();
    if (tabName === 'students') loadStudents();
    if (tabName === 'attendance') loadAttendanceDropdowns();
    if (tabName === 'blockchain') loadBlockchainDropdown();
}

// Setup Form Handlers
function setupFormHandlers() {
    // Add Department Form
    document.getElementById('addDepartmentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const departmentId = document.getElementById('dept-id').value;
        const departmentName = document.getElementById('dept-name').value;
        
        try {
            const response = await fetch(`${API_URL}/departments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ departmentId, departmentName })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Department added successfully!', 'success');
                e.target.reset();
                loadDepartments();
            } else {
                showNotification(data.error, 'error');
            }
        } catch (error) {
            showNotification('Error adding department', 'error');
        }
    });
    
    // Add Class Form
    document.getElementById('addClassForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const classId = document.getElementById('class-id').value;
        const className = document.getElementById('class-name').value;
        const departmentId = document.getElementById('class-dept').value;
        
        try {
            const response = await fetch(`${API_URL}/classes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId, className, departmentId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Class added successfully!', 'success');
                e.target.reset();
                loadClasses();
            } else {
                showNotification(data.error, 'error');
            }
        } catch (error) {
            showNotification('Error adding class', 'error');
        }
    });
    
    // Add Student Form
    document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = document.getElementById('student-id').value;
        const studentName = document.getElementById('student-name').value;
        const rollNumber = document.getElementById('student-roll').value;
        const classId = document.getElementById('student-class').value;
        const departmentId = document.getElementById('student-dept').value;
        
        try {
            const response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, studentName, rollNumber, classId, departmentId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Student added successfully!', 'success');
                e.target.reset();
                loadStudents();
            } else {
                showNotification(data.error, 'error');
            }
        } catch (error) {
            showNotification('Error adding student', 'error');
        }
    });
}

// Load System Info
async function loadSystemInfo() {
    try {
        const response = await fetch(`${API_URL}/system/info`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('stat-departments').textContent = data.data.activeDepartments;
            document.getElementById('stat-classes').textContent = data.data.activeClasses;
            document.getElementById('stat-students').textContent = data.data.activeStudents;
            document.getElementById('stat-blockchain').textContent = '✓ Active';
        }
    } catch (error) {
        console.error('Error loading system info:', error);
    }
}

// Initialize System
async function initializeSystem() {
    if (!confirm('This will initialize the system with default data. Continue?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/system/initialize`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('System initialized successfully!', 'success');
            loadSystemInfo();
            loadDepartments();
            loadClasses();
            loadStudents();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification('Error initializing system', 'error');
    }
}

// Load Departments
async function loadDepartments() {
    try {
        const response = await fetch(`${API_URL}/departments`);
        const data = await response.json();
        
        if (data.success) {
            departments = data.data;
            displayDepartments(data.data);
            updateDepartmentDropdowns();
        }
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}

function displayDepartments(depts) {
    const container = document.getElementById('departments-list');
    
    if (depts.length === 0) {
        container.innerHTML = '<p>No departments found.</p>';
        return;
    }
    
    container.innerHTML = depts.map(dept => `
        <div class="data-item">
            <div class="data-item-info">
                <h4>${dept.departmentName}</h4>
                <p>ID: ${dept.departmentId}</p>
                <p>Status: <span class="status-badge status-${dept.status}">${dept.status}</span></p>
                <p>Chain Length: ${dept.chainLength} blocks</p>
            </div>
            <div class="data-item-actions">
                <button class="btn btn-small btn-secondary" onclick="viewDepartmentDetails('${dept.departmentId}')">View Details</button>
                ${dept.status === 'active' ? `
                    <button class="btn btn-small btn-danger" onclick="deleteDepartment('${dept.departmentId}')">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function deleteDepartment(departmentId) {
    if (!confirm('Are you sure you want to delete this department?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/departments/${departmentId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Department deleted successfully!', 'success');
            loadDepartments();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification('Error deleting department', 'error');
    }
}

async function viewDepartmentDetails(departmentId) {
    try {
        const response = await fetch(`${API_URL}/departments/${departmentId}`);
        const data = await response.json();
        
        if (data.success) {
            alert(JSON.stringify(data.data, null, 2));
        }
    } catch (error) {
        showNotification('Error loading department details', 'error');
    }
}

function searchDepartments() {
    const searchTerm = document.getElementById('dept-search').value;
    const filtered = departments.filter(dept => 
        dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayDepartments(filtered);
}

// Load Classes
async function loadClasses() {
    try {
        const response = await fetch(`${API_URL}/classes`);
        const data = await response.json();
        
        if (data.success) {
            classes = data.data;
            displayClasses(data.data);
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

function displayClasses(classList) {
    const container = document.getElementById('classes-list');
    
    if (classList.length === 0) {
        container.innerHTML = '<p>No classes found.</p>';
        return;
    }
    
    container.innerHTML = classList.map(cls => `
        <div class="data-item">
            <div class="data-item-info">
                <h4>${cls.className}</h4>
                <p>ID: ${cls.classId}</p>
                <p>Department: ${cls.departmentId}</p>
                <p>Status: <span class="status-badge status-${cls.status}">${cls.status}</span></p>
                <p>Chain Length: ${cls.chainLength} blocks</p>
            </div>
            <div class="data-item-actions">
                <button class="btn btn-small btn-secondary" onclick="viewClassDetails('${cls.classId}')">View Details</button>
                ${cls.status === 'active' ? `
                    <button class="btn btn-small btn-danger" onclick="deleteClass('${cls.classId}')">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function deleteClass(classId) {
    if (!confirm('Are you sure you want to delete this class?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/classes/${classId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Class deleted successfully!', 'success');
            loadClasses();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification('Error deleting class', 'error');
    }
}

async function viewClassDetails(classId) {
    try {
        const response = await fetch(`${API_URL}/classes/${classId}`);
        const data = await response.json();
        
        if (data.success) {
            alert(JSON.stringify(data.data, null, 2));
        }
    } catch (error) {
        showNotification('Error loading class details', 'error');
    }
}

function searchClasses() {
    const searchTerm = document.getElementById('class-search').value;
    const filtered = classes.filter(cls => 
        cls.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayClasses(filtered);
}

// Load Students
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        const data = await response.json();
        
        if (data.success) {
            students = data.data;
            displayStudents(data.data);
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(studentList) {
    const container = document.getElementById('students-list');
    
    if (studentList.length === 0) {
        container.innerHTML = '<p>No students found.</p>';
        return;
    }
    
    container.innerHTML = studentList.map(student => `
        <div class="data-item">
            <div class="data-item-info">
                <h4>${student.studentName}</h4>
                <p>Roll Number: ${student.rollNumber}</p>
                <p>ID: ${student.studentId}</p>
                <p>Class: ${student.classId}</p>
                <p>Department: ${student.departmentId}</p>
                <p>Status: <span class="status-badge status-${student.status}">${student.status}</span></p>
                <p>Attendance: ${student.attendanceStats.present}/${student.attendanceStats.total} (${student.attendanceStats.presentPercentage}%)</p>
            </div>
            <div class="data-item-actions">
                <button class="btn btn-small btn-secondary" onclick="viewStudentAttendance('${student.studentId}')">View Attendance</button>
                ${student.status === 'active' ? `
                    <button class="btn btn-small btn-danger" onclick="deleteStudent('${student.studentId}')">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/students/${studentId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Student deleted successfully!', 'success');
            loadStudents();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification('Error deleting student', 'error');
    }
}

async function viewStudentAttendance(studentId) {
    try {
        const response = await fetch(`${API_URL}/students/${studentId}/attendance`);
        const data = await response.json();
        
        if (data.success) {
            alert(JSON.stringify(data.data, null, 2));
        }
    } catch (error) {
        showNotification('Error loading attendance', 'error');
    }
}

function searchStudents() {
    const searchTerm = document.getElementById('student-search').value;
    const filtered = students.filter(student => 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayStudents(filtered);
}

// Update Dropdowns
function updateDepartmentDropdowns() {
    const selects = [
        document.getElementById('class-dept'),
        document.getElementById('student-dept'),
        document.getElementById('attendance-dept')
    ];
    
    selects.forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Select Department</option>' +
                departments
                    .filter(d => d.status === 'active')
                    .map(d => `<option value="${d.departmentId}">${d.departmentName}</option>`)
                    .join('');
        }
    });
}

async function loadClassesForStudent() {
    const deptId = document.getElementById('student-dept').value;
    const select = document.getElementById('student-class');
    
    if (!deptId) {
        select.innerHTML = '<option value="">Select Class</option>';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/departments/${deptId}/classes`);
        const data = await response.json();
        
        if (data.success) {
            select.innerHTML = '<option value="">Select Class</option>' +
                data.data
                    .filter(c => c.status === 'active')
                    .map(c => `<option value="${c.classId}">${c.className}</option>`)
                    .join('');
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

// Attendance Functions
function loadAttendanceDropdowns() {
    updateDepartmentDropdowns();
}

async function loadClassesForAttendance() {
    const deptId = document.getElementById('attendance-dept').value;
    const select = document.getElementById('attendance-class');
    
    if (!deptId) {
        select.innerHTML = '<option value="">Select Class</option>';
        document.getElementById('attendance-marking').innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/departments/${deptId}/classes`);
        const data = await response.json();
        
        if (data.success) {
            select.innerHTML = '<option value="">Select Class</option>' +
                data.data
                    .filter(c => c.status === 'active')
                    .map(c => `<option value="${c.classId}">${c.className}</option>`)
                    .join('');
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

async function loadStudentsForAttendance() {
    const classId = document.getElementById('attendance-class').value;
    const date = document.getElementById('attendance-date').value;
    const container = document.getElementById('attendance-marking');
    
    if (!classId || !date) {
        showNotification('Please select class and date', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/classes/${classId}/students`);
        const data = await response.json();
        
        if (data.success) {
            if (data.data.length === 0) {
                container.innerHTML = '<p>No students found in this class.</p>';
                return;
            }
            
            container.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-success" onclick="markAllAttendance('Present')">Mark All Present</button>
                    <button class="btn btn-danger" onclick="markAllAttendance('Absent')">Mark All Absent</button>
                    <button class="btn btn-warning" onclick="markAllAttendance('Leave')">Mark All Leave</button>
                </div>
            ` + data.data
                .filter(s => s.status === 'active')
                .map(student => `
                    <div class="attendance-row" id="attendance-${student.studentId}">
                        <div class="attendance-info">
                            <h4>${student.studentName}</h4>
                            <p>Roll: ${student.rollNumber}</p>
                        </div>
                        <div class="attendance-actions">
                            <button class="btn btn-small btn-success" onclick="markAttendance('${student.studentId}', 'Present')">Present</button>
                            <button class="btn btn-small btn-danger" onclick="markAttendance('${student.studentId}', 'Absent')">Absent</button>
                            <button class="btn btn-small btn-warning" onclick="markAttendance('${student.studentId}', 'Leave')">Leave</button>
                        </div>
                    </div>
                `).join('');
        }
    } catch (error) {
        showNotification('Error loading students', 'error');
    }
}

async function markAttendance(studentId, status) {
    const date = document.getElementById('attendance-date').value;
    
    try {
        const response = await fetch(`${API_URL}/attendance/mark`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: studentId,
                status: status,
                date: date,
                markedBy: 'admin'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const row = document.getElementById(`attendance-${studentId}`);
            if (row) {
                row.style.background = '#d4edda';
                setTimeout(() => {
                    row.style.background = 'white';
                }, 1000);
            }
            showNotification(`Marked ${status}`, 'success');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification('Error marking attendance', 'error');
    }
}

async function markAllAttendance(status) {
    const classId = document.getElementById('attendance-class').value;
    const date = document.getElementById('attendance-date').value;
    
    if (!classId || !date) {
        showNotification('Please select class and date', 'error');
        return;
    }
    
    try {
        const studentsResponse = await fetch(`${API_URL}/classes/${classId}/students`);
        const studentsData = await studentsResponse.json();
        
        if (studentsData.success) {
            const attendanceRecords = studentsData.data
                .filter(s => s.status === 'active')
                .map(s => ({
                    studentId: s.studentId,
                    status: status,
                    date: date,
                    markedBy: 'admin'
                }));
            
            const response = await fetch(`${API_URL}/attendance/mark-bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceRecords })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification(`Marked ${attendanceRecords.length} students as ${status}`, 'success');
                loadStudentsForAttendance();
            } else {
                showNotification('Error marking attendance', 'error');
            }
        }
    } catch (error) {
        showNotification('Error marking attendance', 'error');
    }
}

// Blockchain Visualization
function loadBlockchainDropdown() {
    const select = document.getElementById('blockchain-student');
    
    select.innerHTML = '<option value="">Select Student</option>' +
        students
            .filter(s => s.status === 'active')
            .map(s => `<option value="${s.studentId}">${s.studentName} (${s.rollNumber})</option>`)
            .join('');
}

async function viewStudentBlockchain() {
    const studentId = document.getElementById('blockchain-student').value;
    const container = document.getElementById('blockchain-view');
    
    if (!studentId) {
        showNotification('Please select a student', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/students/${studentId}/blockchain`);
        const data = await response.json();
        
        if (data.success) {
            displayBlockchain(data.data);
        }
    } catch (error) {
        showNotification('Error loading blockchain', 'error');
    }
}

function displayBlockchain(blockchainData) {
    const container = document.getElementById('blockchain-view');
    const { studentInfo, chain, isValid, stats } = blockchainData;
    
    container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3>${studentInfo.studentName} (${studentInfo.rollNumber})</h3>
            <p>Chain Valid: <span class="status-badge ${isValid ? 'status-active' : 'status-deleted'}">${isValid ? 'Yes' : 'No'}</span></p>
            <p>Total Blocks: ${chain.length}</p>
            <p>Attendance Records: ${stats.total}</p>
            <p>Present: ${stats.present} | Absent: ${stats.absent} | Leave: ${stats.leave}</p>
            <p>Attendance Rate: ${stats.presentPercentage}%</p>
        </div>
        <h3>Blockchain Blocks:</h3>
    ` + chain.map(block => `
        <div class="block">
            <div class="block-header">
                <span class="block-index">Block #${block.index}</span>
                <span class="block-type">${block.transactions.type}</span>
            </div>
            <div class="block-content">
                ${Object.entries(block.transactions).map(([key, value]) => `
                    <div class="block-field">
                        <span class="block-field-label">${key}:</span>
                        <span class="block-field-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
                    </div>
                `).join('')}
            </div>
            <div class="hash-display">
                <div class="block-field">
                    <span class="block-field-label">Hash:</span>
                    <span class="block-field-value">${block.hash}</span>
                </div>
                <div class="block-field">
                    <span class="block-field-label">Previous Hash:</span>
                    <span class="block-field-value">${block.prev_hash}</span>
                </div>
                <div class="block-field">
                    <span class="block-field-label">Nonce:</span>
                    <span class="block-field-value">${block.nonce}</span>
                </div>
                <div class="block-field">
                    <span class="block-field-label">Timestamp:</span>
                    <span class="block-field-value">${new Date(block.timestamp).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Validation
async function validateBlockchain() {
    const container = document.getElementById('validation-results');
    container.innerHTML = '<p>Validating blockchain... This may take a moment.</p>';
    
    try {
        const response = await fetch(`${API_URL}/blockchain/validate`);
        const data = await response.json();
        
        if (data.success) {
            displayValidationResults(data.validation);
        }
    } catch (error) {
        showNotification('Error validating blockchain', 'error');
    }
}

function displayValidationResults(validation) {
    const container = document.getElementById('validation-results');
    
    const statusClass = validation.overallStatus === 'VALID' ? 'validation-valid' : 'validation-invalid';
    
    container.innerHTML = `
        <div class="validation-status ${statusClass}">
            ${validation.overallStatus === 'VALID' ? '✓' : '✗'} Blockchain is ${validation.overallStatus}
        </div>
        
        <div class="validation-details">
            <h3>Summary</h3>
            <p>Total Errors: ${validation.summary.totalErrors}</p>
            <p>Total Warnings: ${validation.summary.totalWarnings}</p>
            <p>Departments Checked: ${validation.summary.departmentsChecked}</p>
            <p>Classes Checked: ${validation.summary.classesChecked}</p>
            <p>Students Checked: ${validation.summary.studentsChecked}</p>
            
            ${validation.errors.length > 0 ? `
                <div class="validation-section">
                    <h4>Errors</h4>
                    <ul class="error-list">
                        ${validation.errors.map(err => `<li>${err}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${validation.warnings.length > 0 ? `
                <div class="validation-section">
                    <h4>Warnings</h4>
                    <ul class="error-list">
                        ${validation.warnings.map(warn => `<li>${warn}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
