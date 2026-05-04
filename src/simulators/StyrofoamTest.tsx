import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Beaker, Droplet, BookOpen, Search, ShieldAlert } from 'lucide-react';

const StyrofoamTestRefactored: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [beakerPlaced, setBeakerPlaced] = useState(false);
  const [gasolineVol, setGasolineVol] = useState(0); // target 50ml
  const [cubeIn, setCubeIn] = useState(false);
  const [dissolveProgress, setDissolveProgress] = useState(0);
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setBeakerPlaced(false);
    setGasolineVol(0);
    setCubeIn(false);
    setDissolveProgress(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca el vaso de precipitados en la mesa.",
    "Añade 50ml de gasolina al vaso.",
    "Introduce el cubo de plastoformo (poliestireno).",
    "Observa la reacción de solvatación.",
    "Analiza el residuo final."
  ];

  useEffect(() => {
    if (step === 0 && beakerPlaced) setStep(1);
    if (step === 1 && gasolineVol >= 50) {
      setStep(2);
      setShowLearning({
        title: "Solvente Universal",
        content: "El plastoformo es un plástico muy sensible. Lo usamos como 'testigo' para detectar solventes aromáticos agresivos llamados BTEX.",
        icon: <BookOpen className="text-blue-500" />
      });
    }
    
    if (step === 3 && cubeIn) {
      const speed = gasolineQuality === 'suspect' ? 3 : 0.3;
      const timer = setInterval(() => {
        setDissolveProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep(4);
            setTimeout(() => setShowResult(true), 1500);
            return 100;
          }
          return prev + speed;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [beakerPlaced, gasolineVol, cubeIn, step, gasolineQuality]);

  const handleAction = (type: string) => {
    if (type === 'beaker' && step === 0) setBeakerPlaced(true);
    if (type === 'gasoline' && step === 1) setGasolineVol(prev => Math.min(prev + 10, 50));
    if (type === 'cube' && step === 2) {
      setCubeIn(true);
      setStep(3);
      setShowLearning({
        title: "Lo Similar Disuelve a lo Similar",
        content: "Si el cubo desaparece en segundos, significa que la gasolina es 'ácida' para las gomas y mangueras de tu motor.",
        icon: <Search className="text-orange-500" />
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 12: Test del Plastoformo</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Tools */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!beakerPlaced} onClick={() => handleAction('beaker')} icon={<Beaker />} label="Vaso" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('gasoline')} icon={<Droplet className="text-yellow-600" />} label="Gasolina" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('cube')} icon={<div className="w-6 h-6 bg-white border border-gray-300 shadow-sm rounded-sm"></div>} label="Cubo" highlight={step === 2} />
        </div>

        {/* Lab Bench */}
        <div className="flex-grow bg-white/40 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px]">
          
          <div className="absolute bottom-10 flex flex-col items-center">
            <div className="w-64 h-8 bg-gray-400 rounded-full shadow-md"></div>
            
            <AnimatePresence>
              {beakerPlaced && (
                <motion.div 
                  initial={{ y: -300 }} animate={{ y: -20 }}
                  className="w-32 h-48 border-x-4 border-b-4 border-white/60 rounded-b-xl bg-white/10 shadow-lg relative flex flex-col justify-end overflow-hidden"
                >
                   {/* Gasoline Phase */}
                   <motion.div 
                    animate={{ height: (gasolineVol * 2) + 'px' }}
                    className="w-full bg-yellow-400/40 border-t border-yellow-200 relative"
                   >
                      {/* Solvation Bubbles */}
                      {cubeIn && dissolveProgress < 100 && (
                        <div className="absolute inset-0 overflow-hidden">
                          {[...Array(gasolineQuality === 'suspect' ? 15 : 5)].map((_, i) => (
                            <motion.div 
                              key={i}
                              animate={{ y: [-10, -80], opacity: [0, 0.8, 0], x: (Math.random()-0.5)*30 }}
                              transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
                              className="absolute bottom-10 w-1 h-1 bg-white/40 rounded-full"
                              style={{ left: 20 + Math.random() * 60 + '%' }}
                            />
                          ))}
                        </div>
                      )}
                   </motion.div>

                   {/* Styrofoam Cube */}
                   {cubeIn && (
                     <motion.div 
                        animate={{ 
                          scale: 1 - (dissolveProgress / 100),
                          opacity: 1 - (dissolveProgress / 110),
                          y: dissolveProgress > 0 ? 50 : -20
                        }}
                        className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-white shadow-inner border border-gray-100 flex items-center justify-center font-black text-[6px] text-gray-200 uppercase"
                     >
                        {dissolveProgress < 100 ? 'PS' : ''}
                     </motion.div>
                   )}

                   {/* Sticky residue at bottom */}
                   {dissolveProgress > 60 && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: (dissolveProgress - 60) / 40 }}
                        className="absolute bottom-0 w-full h-4 bg-white/60 blur-md rounded-full"
                     />
                   )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Learning Box */}
          <AnimatePresence>
            {showLearning && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center p-6">
                <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-blue-500 max-w-sm pointer-events-auto">
                  <div className="flex items-center gap-3 mb-2">{showLearning.icon}<h4 className="font-bold">{showLearning.title}</h4></div>
                  <p className="text-sm text-gray-600 mb-4">{showLearning.content}</p>
                  <button onClick={() => setShowLearning(null)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Continuar</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Overlay */}
          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-b-8 border-blue-600">
                 <ShieldAlert className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-red-700'}`} />
                 <h2 className="text-xl font-black mb-2 uppercase">Veredicto de Solvencia</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "REACCIÓN LENTA: El plastoformo se mantiene estable. Bajos niveles de aromáticos agresivos."
                      : "COLAPSO CRÍTICO: Disolución instantánea. Presencia extrema de solventes BTEX (Tolueno/Xileno)."}
                 </p>
                 <div className="bg-red-50 p-3 rounded-lg text-left text-[10px] text-red-900 mb-4 leading-tight">
                    <strong>Alerta Mecánica:</strong> Estos solventes industriales son altamente agresivos. 'Se comen' literalmente las mangueras de combustible, los sellos de los inyectores y el tanque de plástico, provocando fugas de gasolina e incendios.
                 </div>
                 <button onClick={reset} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold">Reiniciar</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToolIcon = ({ active, onClick, icon, label, highlight }: any) => (
  <motion.div whileHover={active ? { scale: 1.05 } : {}} whileTap={active ? { scale: 0.95 } : {}} onClick={active ? onClick : undefined}
    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${active ? 'bg-white shadow-md cursor-pointer' : 'bg-gray-100 opacity-20'} ${highlight ? 'ring-2 ring-blue-500 animate-pulse' : ''}`}>
    <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
    <span className="text-[9px] font-black uppercase text-gray-500">{label}</span>
  </motion.div>
);

export default StyrofoamTestRefactored;
