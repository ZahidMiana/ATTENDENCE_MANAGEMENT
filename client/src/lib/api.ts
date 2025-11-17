const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // System
  async getSystemInfo() {
    return this.request('/system/info');
  }

  async initializeSystem() {
    return this.request('/system/initialize', { method: 'POST' });
  }

  // Departments
  async getDepartments() {
    return this.request('/departments');
  }

  async getDepartment(id: string) {
    return this.request(`/departments/${id}`);
  }

  async createDepartment(data: { name: string; code: string; head?: string }) {
    return this.request('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(id: string, data: { name?: string; head?: string }) {
    return this.request(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(id: string) {
    return this.request(`/departments/${id}`, { method: 'DELETE' });
  }

  async getDepartmentBlockchain(id: string) {
    return this.request(`/departments/${id}/blockchain`);
  }

  // Classes
  async getClasses() {
    return this.request('/classes');
  }

  async getClass(id: string) {
    return this.request(`/classes/${id}`);
  }

  async getClassesByDepartment(departmentId: string) {
    return this.request(`/classes/department/${departmentId}`);
  }

  async createClass(data: {
    name: string;
    code: string;
    departmentId: string;
    semester?: number;
  }) {
    return this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClass(id: string, data: { name?: string; semester?: number }) {
    return this.request(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClass(id: string) {
    return this.request(`/classes/${id}`, { method: 'DELETE' });
  }

  async getClassBlockchain(id: string) {
    return this.request(`/classes/${id}/blockchain`);
  }

  // Students
  async getStudents() {
    return this.request('/students');
  }

  async getStudent(id: string) {
    return this.request(`/students/${id}`);
  }

  async getStudentsByClass(classId: string) {
    return this.request(`/students/class/${classId}`);
  }

  async createStudent(data: {
    name: string;
    rollNumber: string;
    classId: string;
    email?: string;
  }) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: string, data: { name?: string; email?: string }) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: string) {
    return this.request(`/students/${id}`, { method: 'DELETE' });
  }

  async getStudentBlockchain(id: string) {
    return this.request(`/students/${id}/blockchain`);
  }

  // Attendance
  async markAttendance(data: {
    studentId: string;
    status: 'Present' | 'Absent' | 'Leave';
    date: string;
    markedBy: string;
  }) {
    return this.request('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStudentAttendance(studentId: string) {
    return this.request(`/students/${studentId}/attendance`);
  }

  async getStudentAttendanceStats(studentId: string) {
    return this.request(`/students/${studentId}/attendance/stats`);
  }

  // Blockchain Validation
  async validateBlockchain() {
    return this.request('/blockchain/validate');
  }

  async validateDepartment(id: string) {
    return this.request(`/departments/${id}/validate`);
  }

  async validateClass(id: string) {
    return this.request(`/classes/${id}/validate`);
  }

  async validateStudent(id: string) {
    return this.request(`/students/${id}/validate`);
  }
}

export const api = new ApiService();
export default api;
