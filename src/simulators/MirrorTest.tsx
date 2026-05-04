import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Droplet, Search, BookOpen, SearchCode } from 'lucide-react';

const MirrorTestRefactored: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [mirrorPlaced, setMirrorPlaced] = useState(false);
  const [gasolineDropped, setGasolineDropped] = useState(false);
  const [evaporationProgress, setEvaporationProgress] = useState(0);
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setMirrorPlaced(false);
    setGasolineDropped(false);
    setEvaporationProgress(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca el espejo limpio sobre la mesa.",
    "Añade una gota de gasolina en el centro del espejo.",
    "Espera a que la gasolina se evapore totalmente.",
    "Analiza la superficie en busca de residuos."
  ];

  useEffect(() => {
    if (step === 0 && mirrorPlaced) setStep(1);
    if (step === 1 && gasolineDropped) {
      setStep(2);
      setShowLearning({
        title: "La Física de la Gota",
        content: "La gasolina pura es altamente volátil. Al caer sobre el vidrio, debe desaparecer sin dejar rastro en pocos segundos.",
        icon: <BookOpen className="text-blue-500" />
      });
    }
    
    if (step === 2 && gasolineDropped) {
      const timer = setInterval(() => {
        setEvaporationProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep(3);
            setTimeout(() => setShowResult(true), 1500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [mirrorPlaced, gasolineDropped, step]);

  const handleAction = (type: string) => {
    if (type === 'mirror' && step === 0) setMirrorPlaced(true);
    if (type === 'drop' && step === 1) setGasolineDropped(true);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 2: Test del Espejo</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Sidebar Tools */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!mirrorPlaced} onClick={() => handleAction('mirror')} icon={<SearchCode className="text-blue-400" />} label="Espejo" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('drop')} icon={<Droplet className="text-yellow-600" />} label="Gasolina" highlight={step === 1} />
        </div>

        {/* Main Lab Area */}
        <div className="flex-grow bg-blue-50/20 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px]">
          
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* Mirror */}
            <AnimatePresence>
              {mirrorPlaced && (
                <motion.div 
                  initial={{ y: -300, scale: 0.5 }}
                  animate={{ y: 0, scale: 1 }}
                  className="relative w-64 h-64 bg-white/40 rounded-full border-4 border-white/60 shadow-2xl backdrop-blur-sm flex items-center justify-center overflow-hidden"
                >
                   {/* Reflection effect */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent to-white/40"></div>

                   {/* Gasoline Spot */}
                   {gasolineDropped && (
                     <motion.div 
                        animate={{ 
                          scale: 1 - (evaporationProgress / 100),
                          opacity: 1 - (evaporationProgress / 100)
                        }}
                        className="w-20 h-20 bg-blue-300/30 rounded-full blur-md"
                     />
                   )}

                   {/* Residue (The Coffee Ring) */}
                   {step === 3 && gasolineQuality === 'suspect' && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute flex items-center justify-center"
                     >
                        <div className="w-40 h-40 border-4 border-yellow-800/40 rounded-full blur-[2px] animate-pulse"></div>
                        <div className="absolute w-32 h-32 border-2 border-yellow-900/30 rounded-full blur-[1px]"></div>
                        <div className="absolute text-[8px] font-black text-yellow-950 uppercase">Residuos Pesados</div>
                     </motion.div>
                   )}

                   {step === 3 && gasolineQuality === 'premium' && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-blue-500 font-bold text-xs uppercase"
                     >
                        Superficie Limpia
                     </motion.div>
                   )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Dropper animation */}
            {step === 1 && (
              <motion.div 
                animate={{ y: [-150, -120, -150] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 w-2 h-20 bg-gray-300 rounded-full border-x border-gray-400 flex flex-col justify-end items-center"
              >
                 <div className="w-4 h-6 bg-red-400 rounded-t-full mb-10"></div>
                 <div className="w-1 h-4 bg-blue-400/50 rounded-full animate-bounce"></div>
              </motion.div>
            )}
          </div>

          {/* Learning Box */}
          <AnimatePresence>
            {showLearning && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center p-6">
                <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-blue-500 max-w-sm pointer-events-auto">
                  <div className="flex items-center gap-3 mb-2">{showLearning.icon}<h4 className="font-bold">{showLearning.title}</h4></div>
                  <p className="text-sm text-gray-600 mb-4">{showLearning.content}</p>
                  <button onClick={() => setShowLearning(null)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Continuar</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Card */}
          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-b-8 border-blue-600">
                 <Search className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-red-700'}`} />
                 <h2 className="text-xl font-black mb-2 uppercase">Veredicto del Espejo</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "NEGATIVO: Evaporación completa sin residuos. La gasolina es pura."
                      : "POSITIVO: Se observa un 'anillo de café'. Presencia de aceites pesados o diésel."}
                 </p>
                 <div className="bg-orange-50 p-3 rounded-lg text-left text-[10px] text-orange-900 mb-4 leading-tight">
                    <strong>Peligro Motor:</strong> Estos aceites pesados no se queman en la cámara de combustión. En su lugar, se 'hornean' sobre el pistón formando costras de carbón que destruyen el motor por dentro.
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

export default MirrorTestRefactored;
