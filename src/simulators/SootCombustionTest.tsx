import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Droplet, Flame, BookOpen, ShieldAlert, Search } from 'lucide-react';

const SootCombustionTest: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [dishPlaced, setDishPlaced] = useState(false);
  const [gasolineVol, setGasolineVol] = useState(0); // target 5ml
  const [isLit, setIsLit] = useState(false);
  const [slideOverFlame, setSlideOverFlame] = useState(false);
  const [sootProgress, setSootProgress] = useState(0);
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setDishPlaced(false);
    setGasolineVol(0);
    setIsLit(false);
    setSlideOverFlame(false);
    setSootProgress(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca la cápsula de porcelana en la mesa.",
    "Añade 5ml de muestra de gasolina.",
    "Enciende la muestra con cuidado.",
    "Coloca la placa de vidrio fría sobre la llama.",
    "Espera a que el hollín se deposite en el vidrio.",
    "Analiza la mancha de carbón resultante."
  ];

  useEffect(() => {
    if (step === 0 && dishPlaced) setStep(1);
    if (step === 1 && gasolineVol >= 5) {
      setStep(2);
      setShowLearning({
        title: "¿Qué buscamos al quemarla?",
        content: "La gasolina pura es volátil y debe arder con una llama azulada o naranja limpia. Si la llama es muy roja y suelta mucho humo negro, hay 'pesados' presentes.",
        icon: <BookOpen className="text-orange-500" />
      });
    }
    if (step === 2 && isLit) setStep(3);
    if (step === 3 && slideOverFlame) {
      setStep(4);
      setShowLearning({
        title: "Captura de Hollín",
        content: "Al poner una superficie fría, forzamos a los vapores de carbono no quemados a condensarse. Esto es lo mismo que ocurre en las paredes de tus cilindros.",
        icon: <Search className="text-blue-500" />
      });
    }

    if (step === 4 && slideOverFlame) {
      const timer = setInterval(() => {
        setSootProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep(5);
            setTimeout(() => setShowResult(true), 1500);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [dishPlaced, gasolineVol, isLit, slideOverFlame, step]);

  const handleAction = (type: string) => {
    if (type === 'dish' && step === 0) setDishPlaced(true);
    if (type === 'gasoline' && step === 1) setGasolineVol(prev => Math.min(prev + 1, 5));
    if (type === 'ignite' && step === 2) setIsLit(true);
    if (type === 'slide' && step === 3) setSlideOverFlame(true);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 8: Combustión y Hollín</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Sidebar Tools */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!dishPlaced} onClick={() => handleAction('dish')} icon={<div className="w-8 h-4 bg-white border-2 border-gray-300 rounded-b-full"></div>} label="Cápsula" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('gasoline')} icon={<Droplet className="text-yellow-600" />} label="Gasolina" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('ignite')} icon={<Flame className="text-red-500" />} label="Encender" highlight={step === 2} />
           <ToolIcon active={step === 3} onClick={() => handleAction('slide')} icon={<div className="w-10 h-2 bg-blue-100 border border-blue-300 rounded-sm"></div>} label="Placa Vidrio" highlight={step === 3} />
        </div>

        {/* Main Lab Area */}
        <div className="flex-grow bg-gray-50 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px] overflow-hidden">
          
          <div className="absolute bottom-20 flex flex-col items-center">
            {/* Porcelain Dish */}
            <AnimatePresence>
              {dishPlaced && (
                <motion.div 
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: 0 }}
                  className="w-32 h-16 bg-white border-x-4 border-b-8 border-gray-200 rounded-b-full shadow-lg relative flex flex-col justify-end overflow-hidden"
                >
                  {/* Gasoline Liquid */}
                  {!isLit && (
                    <motion.div 
                      animate={{ height: (gasolineVol * 6) + 'px' }}
                      className="w-full bg-yellow-400/40 border-t border-yellow-200"
                    />
                  )}
                  
                  {/* Flame Animation */}
                  {isLit && (
                    <motion.div 
                      className="absolute inset-0 flex items-end justify-center"
                    >
                       <div className={`w-20 h-40 mb-2 rounded-full blur-xl animate-pulse ${gasolineQuality === 'premium' ? 'bg-orange-400/60' : 'bg-red-600/70'}`}></div>
                       <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          y: [0, -10, 0]
                        }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                        className={`absolute bottom-0 w-16 h-32 rounded-t-full ${gasolineQuality === 'premium' ? 'bg-orange-500' : 'bg-red-700'} blur-sm opacity-80`}
                       />
                       {gasolineQuality === 'suspect' && (
                         <div className="absolute top-[-50px] w-24 h-48 bg-gray-900/20 blur-2xl animate-bounce"></div>
                       )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glass Slide */}
            {slideOverFlame && (
              <motion.div 
                initial={{ x: -200, y: -100 }}
                animate={{ x: 0, y: -120 }}
                className="absolute z-20 w-48 h-4 bg-blue-100/40 border border-white/60 backdrop-blur-sm rounded-sm shadow-md flex items-center justify-center overflow-hidden"
              >
                {/* Soot Deposition */}
                <motion.div 
                  animate={{ 
                    opacity: sootProgress / 100,
                    scale: 0.5 + (sootProgress / 200)
                  }}
                  className={`w-16 h-16 rounded-full blur-md ${gasolineQuality === 'premium' ? 'bg-orange-900/20' : 'bg-black/90'}`}
                />
              </motion.div>
            )}
          </div>

          {/* Educational Overlay */}
          <AnimatePresence>
            {showLearning && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center p-6">
                <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-t-4 border-orange-500 max-w-sm">
                  <div className="flex items-center gap-3 mb-2">{showLearning.icon}<h4 className="font-bold text-orange-900">{showLearning.title}</h4></div>
                  <p className="text-sm text-gray-600 mb-4">{showLearning.content}</p>
                  <button onClick={() => setShowLearning(null)} className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold">Entendido</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Card */}
          {showResult && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-b-8 border-orange-700">
                 <ShieldAlert className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-red-700'}`} />
                 <h2 className="text-xl font-black mb-2 uppercase tracking-tighter">Captura de Hollín</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "COMBUSTIÓN LIMPIA: La mancha es casi invisible. Indica ausencia de hidrocarburos pesados."
                      : "COMBUSTIÓN SUCIA: Mancha negra, densa y opaca. Presencia de contaminantes pesados detectada."}
                 </p>
                 <div className="bg-red-50 p-3 rounded-lg text-left text-[10px] text-red-900 mb-4 leading-tight">
                    <strong>Peligro para el Motor:</strong> Este hollín es lo que forma la "carbonilla" en los pistones. Aumenta la compresión peligrosamente, causa pre-ignición (cascabeleo) y raya las camisas del cilindro como si fuera papel lija.
                 </div>
                 <button onClick={reset} className="bg-orange-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg">Reiniciar Prueba</button>
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
    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${active ? 'bg-white shadow-md cursor-pointer' : 'bg-gray-100 opacity-20'} ${highlight ? 'ring-2 ring-orange-500 animate-pulse' : ''}`}>
    <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
    <span className="text-[9px] font-black uppercase text-gray-500">{label}</span>
  </motion.div>
);

export default SootCombustionTest;
