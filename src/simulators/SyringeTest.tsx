import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Droplet, Wind, ShieldAlert, Zap } from 'lucide-react';

const SyringeTestRefactored: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [syringePlaced, setSyringePlaced] = useState(false);
  const [gasolineVol, setGasolineVol] = useState(0); // target 5ml
  const [isSealed, setIsSealed] = useState(false);
  const [isBoiling, setIsBoiling] = useState(false);
  const [vacuumLevel, setVacuumLevel] = useState(0);
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const y = useMotionValue(0);

  const reset = () => {
    setStep(0);
    setSyringePlaced(false);
    setGasolineVol(0);
    setIsSealed(false);
    setIsBoiling(false);
    setVacuumLevel(0);
    y.set(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca la jeringa de 60ml en la mesa.",
    "Succiona 5ml de muestra de gasolina.",
    "Sella la punta de la jeringa herméticamente.",
    "Tira del émbolo con fuerza para generar vacío.",
    "Observa la reacción del combustible."
  ];

  useEffect(() => {
    if (step === 0 && syringePlaced) setStep(1);
    if (step === 1 && gasolineVol >= 5) {
      setStep(2);
      setShowLearning({
        title: "La Presión de Vapor",
        content: "La gasolina debe ser volátil para que el motor encienda en frío. Al bajar la presión, forzamos a los componentes más ligeros a hervir.",
        icon: <Zap className="text-yellow-500" />
      });
    }
    if (step === 2 && isSealed) setStep(3);
    
    // Logic for vacuum level and result
    const unsubscribe = y.on("change", (latest) => {
      if (!isSealed) return;
      const level = (latest / 150) * 100;
      setVacuumLevel(level);
      
      if (level > 60) {
        if (gasolineQuality === 'premium') {
          setIsBoiling(true);
        } else if (level > 90) {
          setIsBoiling(false); // Adulterated barely boils even at high vacuum
        }
      } else {
        setIsBoiling(false);
      }

      if (level > 95 && !showResult) {
        setStep(4);
        setTimeout(() => setShowResult(true), 1500);
      }
    });

    return () => unsubscribe();
  }, [syringePlaced, gasolineVol, isSealed, step, gasolineQuality, y, showResult]);

  const handleAction = (type: string) => {
    if (type === 'syringe' && step === 0) setSyringePlaced(true);
    if (type === 'gasoline' && step === 1) setGasolineVol(prev => Math.min(prev + 1, 5));
    if (type === 'seal' && step === 2) {
      setIsSealed(true);
      setShowLearning({
        title: "Vacío Relativo",
        content: "Al sellar la punta y expandir el volumen, la presión interna cae drásticamente. Esto simula lo que ocurre en el colector de admisión del auto.",
        icon: <Wind className="text-blue-400" />
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
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 11: Presión en Jeringa</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Tools */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!syringePlaced} onClick={() => handleAction('syringe')} icon={<div className="w-4 h-12 bg-gray-100 border-2 border-gray-300 rounded-full"></div>} label="Jeringa" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('gasoline')} icon={<Droplet className="text-yellow-600" />} label="Gasolina" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('seal')} icon={<ShieldAlert className="text-orange-500" />} label="Sellar" highlight={step === 2} />
        </div>

        {/* Lab Bench */}
        <div className="flex-grow bg-blue-50/20 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px]">
          
          <div className="absolute bottom-10 flex flex-col items-center">
            <AnimatePresence>
              {syringePlaced && (
                <motion.div 
                  initial={{ y: -300 }} animate={{ y: 0 }}
                  className="relative flex flex-col items-center"
                >
                   {/* Syringe Body */}
                   <div className="w-20 h-64 border-x-4 border-b-4 border-white/60 rounded-b-3xl bg-white/10 shadow-lg relative overflow-hidden flex flex-col justify-end">
                      {/* Scale */}
                      <div className="absolute inset-0 opacity-20 flex flex-col justify-between py-8 px-2 font-mono text-[8px]">
                        {[60,50,40,30,20,10,0].map(v => <div key={v} className="border-t border-black w-full flex justify-end">{v}</div>)}
                      </div>

                      {/* Plunger (Émbolo) */}
                      <motion.div 
                        drag={isSealed ? "y" : false}
                        dragConstraints={{ top: 0, bottom: 150 }}
                        style={{ y }}
                        className={`absolute top-0 w-full z-10 ${isSealed ? 'cursor-grab active:cursor-grabbing' : ''}`}
                      >
                         <div className="w-full h-8 bg-gray-800 flex items-center justify-center">
                            <div className="w-full h-1 bg-gray-600"></div>
                         </div>
                         <div className="w-4 h-96 mx-auto bg-gray-300 border-x border-gray-400"></div>
                         <div className="w-16 h-4 mx-auto bg-gray-400 rounded-full -mt-2"></div>
                      </motion.div>

                      {/* Gasoline Phase */}
                      <motion.div 
                        animate={{ height: (gasolineVol * 15) + 'px' }}
                        className="w-full bg-yellow-400/40 border-t border-yellow-200 relative"
                      >
                         {/* Boiling Bubbles */}
                         {isBoiling && (
                           <div className="absolute inset-0 overflow-hidden">
                             {[...Array(10)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ y: [-10, -50], opacity: [0, 1, 0], scale: [0.5, 1.2] }}
                                 transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                 className="absolute bottom-0 w-2 h-2 bg-white/60 rounded-full"
                                 style={{ left: 10 + Math.random() * 80 + '%' }}
                               />
                             ))}
                           </div>
                         )}
                      </motion.div>
                   </div>

                   {/* Syringe Tip */}
                   <div className="w-4 h-8 bg-gray-300 rounded-b-md relative">
                      {isSealed && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-200 rounded-full border-4 border-orange-300 flex items-center justify-center font-black text-[8px] text-orange-800 uppercase text-center leading-none">Punta<br/>Sellada</div>
                      )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Vacuum Indicator */}
          {isSealed && (
            <div className="absolute top-10 right-10 w-32 bg-white p-3 rounded-xl shadow-lg border border-blue-100">
               <div className="text-[8px] font-black uppercase text-gray-400 mb-1">Presión Negativa</div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-blue-500" style={{ width: vacuumLevel + '%' }} />
               </div>
               <div className="text-right font-mono text-xs font-bold text-blue-600 mt-1">{Math.round(vacuumLevel)}%</div>
            </div>
          )}

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
                 <Wind className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-red-700'}`} />
                 <h2 className="text-xl font-black mb-2 uppercase">Veredicto de Volatilidad</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "BUENA VOLATILIDAD: Ebullición violenta detectada. La gasolina contiene los 'ligeros' necesarios para un arranque fácil."
                      : "BAJA VOLATILIDAD: Sin reacción al vacío. El combustible está 'muerto' o mezclado con solventes pesados."}
                 </p>
                 <div className="bg-blue-50 p-3 rounded-lg text-left text-[10px] text-blue-900 mb-4 leading-tight">
                    <strong>Impacto en el Motor:</strong> Si la gasolina no hierve bajo vacío, el auto sufrirá para encender en las mañanas frías y perderá potencia al acelerar, ya que el combustible no se gasifica correctamente.
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

export default SyringeTestRefactored;
