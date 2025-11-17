import { motion } from 'framer-motion';import { motion } from 'framer-motion';import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';

import { ArrowLeft, Database, Plus, Search, Blocks } from 'lucide-react';import { Link } from 'react-router-dom';import { Link } from 'react-router-dom';

import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '../lib/animations';

import { useEffect, useState } from 'react';import { ArrowLeft, Database, Plus, Search, Blocks } from 'lucide-react';import { ArrowLeft, Database, Plus, Search, Blocks } from 'lucide-react';

import toast from 'react-hot-toast';

import { api } from '../lib/api';import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '../lib/animations';import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '../lib/animations';



interface Department {import { useEffect, useState } from 'react';import { useEffect, useState } from 'react';

  _id: string;

  departmentId: string;import toast from 'react-hot-toast';import toast from 'react-hot-toast';

  name: string;

  classes: any[];import { api } from '../lib/api';

}

interface Department {

export default function Departments() {  _id: string;

  const [departments, setDepartments] = useState<Department[]>([]);  departmentId: string;

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');  departmentId: string;  name: string;



  useEffect(() => {  name: string;  classes: any[];

    fetchDepartments();

  }, []);  classes: any[];}



  const fetchDepartments = async () => {}

    try {

      const response = await api.getDepartments();export default function Departments() {

      if (response.success) {

        setDepartments(response.data);export default function Departments() {  const [departments, setDepartments] = useState<Department[]>([]);

      }

    } catch (error) {  const [departments, setDepartments] = useState<Department[]>([]);  const [loading, setLoading] = useState(true);

      toast.error('Failed to load departments');

    } finally {  const [loading, setLoading] = useState(true);  const [searchTerm, setSearchTerm] = useState('');

      setLoading(false);

    }  const [searchTerm, setSearchTerm] = useState('');

  };

  useEffect(() => {

  const filteredDepartments = departments.filter(dept =>

    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  useEffect(() => {    fetchDepartments();

    dept.departmentId.toLowerCase().includes(searchTerm.toLowerCase())

  );    fetchDepartments();  }, []);



  return (  }, []);

    <motion.div

      className="min-h-screen p-8"  const fetchDepartments = async () => {

      initial="initial"

      animate="animate"  const fetchDepartments = async () => {    try {

      exit="exit"

      variants={pageTransition}    try {      const response = await fetch('http://localhost:5000/api/departments');

    >

      <div className="flex items-center justify-between mb-8">      const response = await api.getDepartments();      const data = await response.json();

        <div className="flex items-center">

          <Link to="/">      if (response.success) {      if (data.success) {

            <motion.button

              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"        setDepartments(response.data);        setDepartments(data.data);

              whileHover={{ scale: 1.05, x: -5 }}

              whileTap={{ scale: 0.95 }}      }      }

            >

              <ArrowLeft className="w-5 h-5" />    } catch (error) {    } catch (error) {

              <span>Back to Dashboard</span>

            </motion.button>      toast.error('Failed to load departments');      toast.error('Failed to load departments');

          </Link>

        </div>    } finally {    } finally {



        <motion.h1      setLoading(false);      setLoading(false);

          className="text-4xl font-bold text-white text-center"

          variants={fadeInUp}    }    }

        >

          Department Management  };  };

        </motion.h1>



        <motion.button

          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"  const filteredDepartments = departments.filter(dept =>  const filteredDepartments = departments.filter(dept =>

          whileHover={{ scale: 1.05 }}

          whileTap={{ scale: 0.95 }}    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

        >

          <Plus className="w-5 h-5" />    dept.departmentId.toLowerCase().includes(searchTerm.toLowerCase())    dept.departmentId.toLowerCase().includes(searchTerm.toLowerCase())

          <span>Add Department</span>

        </motion.button>  );  );

      </div>



      <motion.div className="mb-8" variants={fadeInUp}>

        <div className="relative max-w-md mx-auto">  return (  return (

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input    <motion.div    <motion.div

            type="text"

            placeholder="Search departments..."      className="min-h-screen p-8"      className="min-h-screen p-8"

            value={searchTerm}

            onChange={(e) => setSearchTerm(e.target.value)}      initial="initial"      initial="initial"

            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"

          />      animate="animate"      animate="animate"

        </div>

      </motion.div>      exit="exit"      exit="exit"



      <motion.div      variants={pageTransition}      variants={pageTransition}

        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

        variants={staggerContainer}    >    >

      >

        {loading ? (      {/* Header */}      <div className="container mx-auto">

          Array.from({ length: 6 }).map((_, index) => (

            <motion.div      <div className="flex items-center justify-between mb-8">        <Link to="/">

              key={index}

              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 animate-pulse"        <div className="flex items-center">          <motion.button

              variants={staggerItem}

            >          <Link to="/">            className="glass-card px-4 py-2 rounded-lg mb-8 flex items-center gap-2"

              <div className="h-8 bg-gray-300/20 rounded mb-4"></div>

              <div className="h-4 bg-gray-300/20 rounded mb-2"></div>            <motion.button            whileHover={{ scale: 1.05, x: -5 }}

              <div className="h-4 bg-gray-300/20 rounded w-2/3"></div>

            </motion.div>              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"            whileTap={{ scale: 0.95 }}

          ))

        ) : (              whileHover={{ scale: 1.05, x: -5 }}          >

          filteredDepartments.map((dept) => (

            <motion.div              whileTap={{ scale: 0.95 }}            <ArrowLeft className="w-4 h-4" />

              key={dept._id}

              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-200 cursor-pointer"            >            Back to Dashboard

              variants={staggerItem}

              whileHover={{ scale: 1.05, y: -5 }}              <ArrowLeft className="w-5 h-5" />          </motion.button>

              whileTap={{ scale: 0.98 }}

            >              <span>Back to Dashboard</span>        </Link>

              <div className="flex items-center mb-4">

                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">            </motion.button>

                  <Database className="w-6 h-6 text-white" />

                </div>          </Link>        <div className="flex items-center justify-between mb-8">

                <div>

                  <h3 className="text-xl font-semibold text-white">{dept.name}</h3>        </div>          <div className="flex items-center gap-4">

                  <p className="text-gray-400">{dept.departmentId}</p>

                </div>            <Database className="w-12 h-12 text-neon-cyan" />

              </div>

        <motion.h1            <h1 className="text-5xl font-heading font-bold text-gradient">

              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-2 text-gray-300">          className="text-4xl font-bold text-white text-center"              Departments

                  <Blocks className="w-4 h-4" />

                  <span>{dept.classes?.length || 0} Classes</span>          variants={fadeInUp}            </h1>

                </div>

                        >          </div>

                <Link

                  to={`/classes?department=${dept.departmentId}`}          Department Management          <motion.button 

                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"

                >        </motion.h1>            className="cyber-button flex items-center gap-2"

                  View Classes

                </Link>            whileHover={{ scale: 1.05 }}

              </div>

            </motion.div>        <motion.button            whileTap={{ scale: 0.95 }}

          ))

        )}          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"          >

      </motion.div>

          whileHover={{ scale: 1.05 }}            <Plus className="w-5 h-5" />

      {!loading && filteredDepartments.length === 0 && (

        <motion.div className="text-center py-12" variants={fadeInUp}>          whileTap={{ scale: 0.95 }}            Add Department

          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />

          <h3 className="text-xl font-semibold text-white mb-2">No Departments Found</h3>        >          </motion.button>

          <p className="text-gray-400">Try adjusting your search terms or add a new department.</p>

        </motion.div>          <Plus className="w-5 h-5" />        </div>

      )}

    </motion.div>          <span>Add Department</span>

  );

}        </motion.button>        {/* Search Bar */}

      </div>        <motion.div 

          className="glass-card p-4 mb-6 rounded-2xl"

      {/* Search */}          variants={fadeInUp}

      <motion.div        >

        className="mb-8"          <div className="relative">

        variants={fadeInUp}            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      >            <input

        <div className="relative max-w-md mx-auto">              type="text"

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />              placeholder="Search departments by name or code..."

          <input              value={searchTerm}

            type="text"              onChange={(e) => setSearchTerm(e.target.value)}

            placeholder="Search departments..."              className="cyber-input pl-12"

            value={searchTerm}            />

            onChange={(e) => setSearchTerm(e.target.value)}          </div>

            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"        </motion.div>

          />

        </div>        {/* Stats Overview */}

      </motion.div>        <motion.div 

          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"

      {/* Departments Grid */}          variants={staggerContainer}

      <motion.div        >

        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"          <motion.div className="glass-card p-6 rounded-2xl" variants={staggerItem}>

        variants={staggerContainer}            <div className="text-neon-cyan text-3xl font-bold">{departments.length}</div>

      >            <div className="text-gray-400 mt-2">Total Departments</div>

        {loading ? (          </motion.div>

          Array.from({ length: 6 }).map((_, index) => (          <motion.div className="glass-card p-6 rounded-2xl" variants={staggerItem}>

            <motion.div            <div className="text-neon-purple text-3xl font-bold">

              key={index}              {departments.reduce((sum, dept) => sum + dept.classes.length, 0)}

              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 animate-pulse"            </div>

              variants={staggerItem}            <div className="text-gray-400 mt-2">Total Classes</div>

            >          </motion.div>

              <div className="h-8 bg-gray-300/20 rounded mb-4"></div>          <motion.div className="glass-card p-6 rounded-2xl" variants={staggerItem}>

              <div className="h-4 bg-gray-300/20 rounded mb-2"></div>            <div className="text-neon-green text-3xl font-bold">

              <div className="h-4 bg-gray-300/20 rounded w-2/3"></div>              {departments.length > 0 ? Math.round(departments.reduce((sum, dept) => sum + dept.classes.length, 0) / departments.length) : 0}

            </motion.div>            </div>

          ))            <div className="text-gray-400 mt-2">Avg Classes per Dept</div>

        ) : (          </motion.div>

          filteredDepartments.map((dept) => (        </motion.div>

            <motion.div

              key={dept._id}        {/* Department Grid */}

              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-200 cursor-pointer"        <motion.div 

              variants={staggerItem}          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"

              whileHover={{ scale: 1.05, y: -5 }}          variants={staggerContainer}

              whileTap={{ scale: 0.98 }}        >

            >          {loading ? (

              <div className="flex items-center mb-4">            <div className="col-span-full text-center text-gray-400 py-12">

                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">              <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>

                  <Database className="w-6 h-6 text-white" />              Loading departments...

                </div>            </div>

                <div>          ) : filteredDepartments.length === 0 ? (

                  <h3 className="text-xl font-semibold text-white">{dept.name}</h3>            <div className="col-span-full text-center text-gray-400 py-12 glass-card rounded-2xl">

                  <p className="text-gray-400">{dept.departmentId}</p>              No departments found

                </div>            </div>

              </div>          ) : (

            filteredDepartments.map((dept, index) => (

              <div className="flex items-center justify-between">              <motion.div

                <div className="flex items-center space-x-2 text-gray-300">                key={dept._id}

                  <Blocks className="w-4 h-4" />                className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all cursor-pointer group"

                  <span>{dept.classes?.length || 0} Classes</span>                variants={staggerItem}

                </div>                whileHover={{ y: -5 }}

                              >

                <Link                {/* Header */}

                  to={`/classes?department=${dept.departmentId}`}                <div className="flex items-start justify-between mb-4">

                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"                  <div className="flex-1">

                >                    <h3 className="text-xl font-bold text-neon-cyan group-hover:text-neon-purple transition-colors">

                  View Classes                      {dept.name}

                </Link>                    </h3>

              </div>                    <p className="text-sm text-gray-400 font-mono mt-1">{dept.departmentId}</p>

            </motion.div>                  </div>

          ))                  <div className="status-orb-valid"></div>

        )}                </div>

      </motion.div>

                {/* Stats */}

      {!loading && filteredDepartments.length === 0 && (                <div className="grid grid-cols-2 gap-4 mb-4">

        <motion.div                  <div>

          className="text-center py-12"                    <div className="text-2xl font-bold text-neon-purple">{dept.classes.length}</div>

          variants={fadeInUp}                    <div className="text-xs text-gray-400">Classes</div>

        >                  </div>

          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />                  <div>

          <h3 className="text-xl font-semibold text-white mb-2">No Departments Found</h3>                    <div className="text-2xl font-bold text-neon-green">

          <p className="text-gray-400">Try adjusting your search terms or add a new department.</p>                      {dept.classes.reduce((sum: number, cls: any) => sum + (cls.students?.length || 0), 0)}

        </motion.div>                    </div>

      )}                    <div className="text-xs text-gray-400">Students</div>

    </motion.div>                  </div>

  );                </div>

}
                {/* Blockchain Info */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Blocks className="w-4 h-4 text-neon-cyan" />
                    <span className="font-mono text-xs">Chain: {dept.classes.length + 1} blocks</span>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  className="w-full mt-4 py-2 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-lg text-neon-cyan hover:from-neon-cyan/20 hover:to-neon-purple/20 transition-all border border-neon-cyan/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details →
                </motion.button>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

interface Department {
  id: string;
  name: string;
  code: string;
  classCount: number;
  studentCount: number;
}

interface GraphNode {
  id: string;
  name: string;
  type: 'department' | 'class' | 'student';
  val: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
}

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const graphRef = useRef<any>();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.getDepartments();
      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  // Generate graph data
  const graphData = {
    nodes: [
      // Department nodes
      ...departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        type: 'department' as const,
        val: 30,
        color: '#00f5ff'
      })),
      // Mock class nodes (you can fetch real data)
      ...departments.flatMap(dept => 
        Array.from({ length: Math.min(dept.classCount, 3) }, (_, i) => ({
          id: `${dept.id}-class-${i}`,
          name: `Class ${i + 1}`,
          type: 'class' as const,
          val: 15,
          color: '#bf40bf'
        }))
      )
    ],
    links: [
      // Links from departments to classes
      ...departments.flatMap(dept =>
        Array.from({ length: Math.min(dept.classCount, 3) }, (_, i) => ({
          source: dept.id,
          target: `${dept.id}-class-${i}`
        }))
      )
    ]
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Database className="w-12 h-12 text-neon-cyan" />
            <h1 className="text-5xl font-heading font-bold text-gradient">
              Departments
            </h1>
          </div>
          <button className="cyber-button flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Department
          </button>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="glass-card p-4 mb-6 rounded-2xl"
          variants={fadeInUp}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cyber-input pl-12"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Force-Directed Graph Visualization */}
          <motion.div 
            className="glass-card p-6 rounded-2xl"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-neon-cyan mb-4">
              Network Visualization
            </h2>
            <div className="bg-cyber-dark rounded-lg overflow-hidden" style={{ height: '500px' }}>
              {!loading && (
                <ForceGraph2D
                  ref={graphRef}
                  graphData={graphData}
                  nodeLabel="name"
                  nodeColor={node => (node as GraphNode).color}
                  nodeVal={node => (node as GraphNode).val}
                  linkColor={() => 'rgba(255, 255, 255, 0.2)'}
                  linkWidth={2}
                  linkDirectionalParticles={2}
                  linkDirectionalParticleSpeed={0.005}
                  linkDirectionalParticleWidth={2}
                  backgroundColor="#0a0a0f"
                  nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Inter`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.color;
                    ctx.fillText(label, node.x, node.y + node.val / 2 + 5);
                  }}
                  onNodeClick={(node) => {
                    const graphNode = node as GraphNode;
                    if (graphNode.type === 'department') {
                      toast.success(`Viewing ${graphNode.name}`);
                    }
                  }}
                />
              )}
            </div>
          </motion.div>

          {/* Department List */}
          <motion.div 
            className="glass-card p-6 rounded-2xl"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-neon-purple mb-4">
              Departments ({filteredDepartments.length})
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-cyber">
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : filteredDepartments.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No departments found</div>
              ) : (
                filteredDepartments.map((dept, index) => (
                  <motion.div
                    key={dept.id}
                    className="glass-card p-4 hover:scale-[1.02] transition-transform cursor-pointer rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-neon-cyan">{dept.name}</h3>
                        <p className="text-sm text-gray-400 font-mono">{dept.code}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Classes</div>
                        <div className="text-2xl font-bold text-neon-purple">{dept.classCount}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="status-orb-valid"></div>
                        <span className="text-sm text-gray-400">{dept.studentCount} Students</span>
                      </div>
                      <button className="text-neon-cyan hover:text-neon-purple transition-colors text-sm">
                        View Details →
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
