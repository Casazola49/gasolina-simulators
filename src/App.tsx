import { useLabStore } from './store/labStore';
import { Beaker, FlaskConical, Droplet, Wind, Zap, Search, AlertTriangle, Layers, Droplets, Gauge, Flame, Palette, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Importación de todos los simuladores
import PHAdulterationTestHuashu from './simulators/PHAdulterationTestHuashu';
import PHAdulterationTestStitch from './simulators/PHAdulterationTestStitch';
import MirrorTest from './simulators/MirrorTest';
import PyrolysisTest from './simulators/PyrolysisTest';
import CopperCorrosionTest from './simulators/CopperCorrosionTest';
import DensityAPITest from './simulators/DensityAPITest';
import ExistingGumsTest from './simulators/ExistingGumsTest';
import DoctorTest from './simulators/DoctorTest';
import SootCombustionTest from './simulators/SootCombustionTest';
import ChromatographyTest from './simulators/ChromatographyTest';
import BlueCrystalTest from './simulators/BlueCrystalTest';
import SyringeTest from './simulators/SyringeTest';
import StyrofoamTest from './simulators/StyrofoamTest';

const simulations = [
  { id: 1, title: 'Adulteración y pH', icon: <Droplets className="w-6 h-6" /> },
  { id: 2, title: 'Test del Espejo', icon: <Search className="w-6 h-6" /> },
  { id: 3, title: 'Pirólisis (Baño de Arena)', icon: <Flame className="w-6 h-6" /> },
  { id: 4, title: 'Corrosión de Cobre', icon: <Layers className="w-6 h-6" /> },
  { id: 5, title: 'Densidad y API', icon: <Gauge className="w-6 h-6" /> },
  { id: 6, title: 'Gomas Existentes', icon: <FlaskConical className="w-6 h-6" /> },
  { id: 7, title: 'Ensayo Doctor', icon: <Zap className="w-6 h-6" /> },
  { id: 8, title: 'Combustión y Hollín', icon: <Flame className="w-6 h-6" /> },
  { id: 9, title: 'Cromatografía', icon: <Droplet className="w-6 h-6" /> },
  { id: 10, title: 'Cristal Azul (Agua)', icon: <AlertTriangle className="w-6 h-6" /> },
  { id: 11, title: 'Presión en Jeringa', icon: <Wind className="w-6 h-6" /> },
  { id: 12, title: 'Test del Plastoformo', icon: <Beaker className="w-6 h-6" /> },
];

function App() {
  const { 
    selectedSimulation, 
    setSelectedSimulation, 
    gasolineQuality, 
    setGasolineQuality,
    currentTheme,
    setCurrentTheme
  } = useLabStore();

  const isStitch = currentTheme === 'stitch';

  return (
    <div className={`min-h-screen transition-all duration-700 ${isStitch ? 'theme-stitch bg-[#050A14] text-white' : 'theme-huashu bg-[#F9F9F7] text-neutral-900'}`}>
      
      {/* Header: Fixed and Dynamic */}
      <header className={`p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ${isStitch ? 'bg-black/40 backdrop-blur-xl border-b border-cyan-500/20' : 'bg-white border-b-8 border-neutral-900'}`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className={`text-4xl font-black uppercase tracking-tighter italic ${isStitch ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400' : 'text-neutral-900'}`}>
              Virtual Fuel Lab
            </h1>
            <p className={`mt-2 text-sm font-medium ${isStitch ? 'text-cyan-300/70' : 'text-neutral-500 uppercase tracking-widest'}`}>
              Interactive Forensics Stage
            </p>
          </div>

          {/* Theme Selector */}
          <div className={`flex p-1 rounded-2xl ${isStitch ? 'bg-white/10 border border-white/10' : 'bg-neutral-100 border-2 border-neutral-900'}`}>
            <button 
              onClick={() => setCurrentTheme('huashu')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${!isStitch ? 'bg-neutral-900 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-900'}`}
            >
              <Palette className="w-4 h-4" /> HUASHU DESIGN
            </button>
            <button 
              onClick={() => setCurrentTheme('stitch')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${isStitch ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'text-neutral-400 hover:text-neutral-900'}`}
            >
              <Sparkles className="w-4 h-4" /> GOOGLE STITCH
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        {!selectedSimulation ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {simulations.map((sim, index) => (
              <motion.button
                key={sim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedSimulation(sim.id)}
                className={`p-8 rounded-3xl transition-all transform hover:-translate-y-2 text-left relative overflow-hidden group ${
                  isStitch 
                    ? 'bg-white/5 border border-white/10 hover:border-cyan-500/50 backdrop-blur-md shadow-2xl' 
                    : 'bg-white border border-black/10 border-bottom-4 border-black hover:shadow-2xl'
                }`}
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 transition-all ${
                  isStitch 
                    ? 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black' 
                    : 'bg-neutral-100 text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white'
                }`}>
                  {sim.icon}
                </div>
                <h3 className={`font-black text-xl mb-2 leading-tight ${isStitch ? 'tracking-tight' : 'uppercase tracking-tighter'}`}>
                  {sim.title}
                </h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${isStitch ? 'text-cyan-200' : 'text-neutral-500'}`}>
                  Unit #{sim.id}
                </p>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-[2rem] shadow-2xl overflow-hidden min-h-[750px] flex flex-col border transition-all duration-500 ${
              isStitch ? 'bg-black/60 border-white/10 backdrop-blur-2xl' : 'bg-white border-4 border-neutral-900'
            }`}
          >
            {/* Simulation Controls */}
            <div className={`p-6 flex flex-col md:flex-row justify-between items-center border-b transition-all ${
              isStitch ? 'bg-black/30 border-white/5' : 'bg-neutral-50 border-neutral-900'
            }`}>
              <button 
                onClick={() => setSelectedSimulation(null)}
                className={`mb-4 md:mb-0 font-black uppercase text-xs flex items-center gap-2 transition-all ${
                  isStitch ? 'text-cyan-400 hover:text-cyan-200' : 'text-neutral-900 hover:tracking-widest'
                }`}
              >
                &larr; Exit Analysis
              </button>
              
              <div className="flex items-center gap-4 p-2 rounded-2xl bg-neutral-900/5 transition-all">
                <span className="text-[10px] font-black uppercase opacity-50 tracking-widest px-2">Sample Quality:</span>
                <select 
                  value={gasolineQuality}
                  onChange={(e) => setGasolineQuality(e.target.value as 'premium' | 'suspect')}
                  className={`text-xs font-black px-4 py-2 rounded-xl outline-none cursor-pointer appearance-none text-center min-w-[200px] transition-all ${
                    isStitch ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-neutral-900 text-white border-2 border-neutral-900'
                  }`}
                >
                  <option value="premium">PREMIUM CONTROL</option>
                  <option value="suspect">STATION SAMPLE</option>
                </select>
              </div>
            </div>
            
            <div className={`flex-grow relative overflow-hidden transition-all duration-500 ${isStitch ? 'bg-cyan-950/20' : 'bg-neutral-50'}`}>
               <div className="w-full h-full relative z-10">
                 {selectedSimulation === 1 && (isStitch ? <PHAdulterationTestStitch /> : <PHAdulterationTestHuashu />)}
                 {selectedSimulation === 2 && <MirrorTest />}
                 {selectedSimulation === 3 && <PyrolysisTest />}
                 {selectedSimulation === 4 && <CopperCorrosionTest />}
                 {selectedSimulation === 5 && <DensityAPITest />}
                 {selectedSimulation === 6 && <ExistingGumsTest />}
                 {selectedSimulation === 7 && <DoctorTest />}
                 {selectedSimulation === 8 && <SootCombustionTest />}
                 {selectedSimulation === 9 && <ChromatographyTest />}
                 {selectedSimulation === 10 && <BlueCrystalTest />}
                 {selectedSimulation === 11 && <SyringeTest />}
                 {selectedSimulation === 12 && <StyrofoamTest />}
               </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-12 p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
        <p>&copy; 2026 Virtual Fuel Forensic Environment // Midudev & Friends</p>
      </footer>
    </div>
  );
}

export default App;
