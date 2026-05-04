import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Droplet, Search, BookOpen, Filter } from 'lucide-react';

const ChromatographyTest: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [paperPlaced, setPaperPlaced] = useState(false);
  const [gasolineDropped, setGasolineDropped] = useState(false);
  const [solventAdded, setSolventAdded] = useState(false);
  const [chromatoProgress, setChromatoProgress] = useState(0);
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setPaperPlaced(false);
    setGasolineDropped(false);
    setSolventAdded(false);
    setChromatoProgress(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca la tira de papel filtro en la mesa.",
    "Añade una gota de gasolina en la base del papel.",
    "Añade alcohol (solvente) al recipiente.",
    "Espera a que el solvente suba por capilaridad.",
    "Analiza la separación de colores y residuos."
  ];

  useEffect(() => {
    if (step === 0 && paperPlaced) setStep(1);
    if (step === 1 && gasolineDropped) {
      setStep(2);
      setShowLearning({
        title: "¿Qué es la Cromatografía?",
        content: "Es una técnica forense para separar mezclas. El papel es la 'fase estacionaria' y el alcohol es la 'fase móvil' que arrastra los componentes a diferentes velocidades.",
        icon: <BookOpen className="text-blue-500" />
      });
    }
    if (step === 2 && solventAdded) setStep(3);
    
    if (step === 3 && solventAdded) {
      const timer = setInterval(() => {
        setChromatoProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep(4);
            setTimeout(() => setShowResult(true), 1500);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [paperPlaced, gasolineDropped, solventAdded, step]);

  const handleAction = (type: string) => {
    if (type === 'paper' && step === 0) setPaperPlaced(true);
    if (type === 'drop' && step === 1) setGasolineDropped(true);
    if (type === 'solvent' && step === 2) {
      setSolventAdded(true);
      setShowLearning({
        title: "Separando lo Invisible",
        content: "Si la gasolina tiene tintes falsos o aceites pesados, estos se quedarán 'atrapados' en diferentes alturas del papel, revelando la verdadera composición de la mezcla.",
        icon: <Search className="text-purple-500" />
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-purple-200">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 9: Cromatografía de Papel</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Sidebar Tools */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!paperPlaced} onClick={() => handleAction('paper')} icon={<Filter />} label="Papel" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('drop')} icon={<Droplet className="text-yellow-600" />} label="Gasolina" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('solvent')} icon={<Droplet className="text-blue-400" />} label="Alcohol" highlight={step === 2} />
        </div>

        {/* Main Lab Area */}
        <div className="flex-grow bg-white/40 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px]">
          
          <div className="absolute bottom-10 flex flex-col items-center">
            {/* Beaker/Container */}
            <div className="w-48 h-64 border-x-4 border-b-4 border-white/60 rounded-b-xl bg-white/10 shadow-lg relative flex flex-col justify-end overflow-hidden">
               {/* Solvent Level */}
               {solventAdded && (
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: '30px' }}
                   className="w-full bg-blue-200/40 border-t border-blue-100"
                 />
               )}
               
               {/* Filter Paper */}
               <AnimatePresence>
                 {paperPlaced && (
                   <motion.div 
                     initial={{ y: -300 }}
                     animate={{ y: 0 }}
                     className="absolute left-1/2 -translate-x-1/2 w-16 h-56 bg-white shadow-md border-x border-gray-100 p-2 flex flex-col justify-end"
                   >
                     {/* Chromatography Progress */}
                     <div className="relative w-full h-full overflow-hidden">
                        {/* Solvent Front */}
                        {solventAdded && (
                          <motion.div 
                            animate={{ height: chromatoProgress + '%' }}
                            className="absolute bottom-0 w-full bg-blue-50 opacity-40"
                          />
                        )}

                        {/* Gasoline Drop / Spot */}
                        {gasolineDropped && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                             {/* The actual chromatography marks */}
                             {gasolineQuality === 'premium' ? (
                               <motion.div 
                                 animate={{ y: -chromatoProgress * 1.5 }}
                                 className="w-4 h-4 bg-orange-400/30 rounded-full blur-sm"
                               />
                             ) : (
                               <>
                                 <motion.div 
                                   animate={{ y: -chromatoProgress * 1.2 }}
                                   className="w-4 h-8 bg-yellow-600/40 rounded-full blur-md"
                                 />
                                 <motion.div 
                                   animate={{ y: -chromatoProgress * 0.5 }}
                                   className="w-4 h-4 bg-black/20 rounded-full blur-sm"
                                 />
                                 <motion.div 
                                   animate={{ y: -chromatoProgress * 1.8 }}
                                   className="w-4 h-4 bg-purple-500/20 rounded-full blur-sm"
                                 />
                               </>
                             )}
                             <div className="w-4 h-4 bg-yellow-500/50 rounded-full blur-[1px]"></div>
                          </div>
                        )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            <div className="w-56 h-4 bg-gray-400 rounded-full mt-[-2px] shadow-sm"></div>
          </div>

          {/* Learning Box */}
          <AnimatePresence>
            {showLearning && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center p-6">
                <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-purple-500 max-w-sm">
                  <div className="flex items-center gap-3 mb-2">{showLearning.icon}<h4 className="font-bold text-purple-900">{showLearning.title}</h4></div>
                  <p className="text-sm text-gray-600 mb-4">{showLearning.content}</p>
                  <button onClick={() => setShowLearning(null)} className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold">Continuar</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Card */}
          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border-b-8 border-purple-600">
                 <Search className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-purple-600'}`} />
                 <h2 className="text-xl font-black mb-2 uppercase">Veredicto Cromatográfico</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "PERFIL LIMPIO: El tinte subió de forma uniforme sin dejar halos oscuros o separación de capas pesadas."
                      : "PERFIL ADULTERADO: Se observan múltiples halos. Presencia de residuos no volátiles y tintes no autorizados."}
                 </p>
                 <div className="bg-purple-50 p-3 rounded-lg text-left text-[10px] text-purple-900 mb-4 leading-tight">
                    <strong>Importancia:</strong> Esta prueba es la "huella dactilar" de la gasolina. Nos permite saber si el combustible ha sido mezclado con solventes industriales o si el colorante azul es solo una máscara para ocultar una gasolina de baja calidad.
                 </div>
                 <button onClick={reset} className="bg-purple-600 text-white px-8 py-2 rounded-xl font-bold">Nueva Cromatografía</button>
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
    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${active ? 'bg-white shadow-md cursor-pointer' : 'bg-gray-100 opacity-20'} ${highlight ? 'ring-2 ring-purple-500 animate-pulse' : ''}`}>
    <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
    <span className="text-[9px] font-black uppercase text-gray-500">{label}</span>
  </motion.div>
);

export default ChromatographyTest;
