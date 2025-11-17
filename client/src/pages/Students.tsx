import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Search, Edit, Eye, TrendingUp } from 'lucide-react';
import { pageTransition, staggerContainer, staggerItem } from '../lib/animations';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Avatar3D from '../components/3d/Avatar3D';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Student {
  _id: string;
  studentId: string;
  name: string;
  classId: string;
  attendancePercentage?: number;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      const data = await response.json();
      if (data.success) {
        // Add random attendance percentage for demo
        const studentsWithAttendance = data.data.map((student: Student) => ({
          ...student,
          attendancePercentage: Math.floor(Math.random() * 30 + 70) // 70-100%
        }));
        setStudents(studentsWithAttendance);
      }
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-neon-green';
    if (percentage >= 75) return 'text-neon-yellow';
    return 'text-neon-red';
  };

  const getAvatarColors = (index: number) => {
    const colorSets = [
      { color1: '#00f5ff', color2: '#bf40bf', color3: '#00ff88' },
      { color1: '#bf40bf', color2: '#00ff88', color3: '#00f5ff' },
      { color1: '#00ff88', color2: '#00f5ff', color3: '#bf40bf' },
      { color1: '#ffcc00', color2: '#ff006e', color3: '#00f5ff' },
    ];
    return colorSets[index % colorSets.length];
  };

  return (
    <motion.div
      className="min-h-screen p-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <div className="container mx-auto">
        <Link to="/">
          <motion.button
            className="glass-card px-4 py-2 rounded-lg mb-8 flex items-center gap-2"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </motion.button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Users className="w-12 h-12 text-neon-green" />
            <h1 className="text-5xl font-heading font-bold text-gradient">
              Students
            </h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-neon-green">{students.length}</div>
            <div className="text-sm text-gray-400">Total Students</div>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="glass-card p-4 mb-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cyber-input pl-12"
            />
          </div>
        </motion.div>

        {/* Student Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={staggerContainer}
        >
          {loading ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              <div className="animate-spin w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading students...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12 glass-card rounded-2xl">
              No students found
            </div>
          ) : (
            filteredStudents.map((student, index) => (
              <motion.div
                key={student._id}
                className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all group"
                variants={staggerItem}
              >
                {/* 3D Avatar */}
                <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-cyber-dark to-void">
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf40bf" />
                    <Avatar3D {...getAvatarColors(index)} />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Canvas>
                </div>

                {/* Student Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">{student.studentId}</p>
                  </div>

                  {/* Attendance Percentage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Attendance</span>
                      <span className={`text-sm font-bold ${getAttendanceColor(student.attendancePercentage || 0)}`}>
                        {student.attendancePercentage}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          (student.attendancePercentage || 0) >= 90 ? 'bg-neon-green' :
                          (student.attendancePercentage || 0) >= 75 ? 'bg-neon-yellow' : 'bg-neon-red'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${student.attendancePercentage}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                      />
                    </div>
                  </div>

                  {/* Class Info */}
                  <div className="text-xs text-gray-400 pt-2 border-t border-white/10">
                    Class: {student.classId}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <motion.button
                      className="p-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 rounded-lg text-neon-cyan transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 mx-auto" />
                    </motion.button>
                    <motion.button
                      className="p-2 bg-neon-purple/10 hover:bg-neon-purple/20 rounded-lg text-neon-purple transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Edit Student"
                    >
                      <Edit className="w-4 h-4 mx-auto" />
                    </motion.button>
                    <motion.button
                      className="p-2 bg-neon-green/10 hover:bg-neon-green/20 rounded-lg text-neon-green transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="View Attendance"
                    >
                      <TrendingUp className="w-4 h-4 mx-auto" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
