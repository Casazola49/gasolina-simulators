import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Droplet, Flame, BookOpen, ShieldAlert, Thermometer, Utensils } from 'lucide-react';

const PyrolysisTestRefactored: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [sandBathPlaced, setSandBathPlaced] = useState(false);
  const [spoonPlaced, setSpoonPlaced] = useState(false);
  const [gasolineVol, setGasolineVol] = useState(0); // target 1ml (simulated)
  const [temperature, setTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);
  const [processStep, setProcessStep] = useState<'none' | 'boiling' | 'smoking' | 'coking'>('none');
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setSandBathPlaced(false);
    setSpoonPlaced(false);
    setGasolineVol(0);
    setTemperature(25);
    setIsHeating(false);
    setProcessStep('none');
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca el baño de arena sobre la hornilla.",
    "Coloca el cucharón de acero en la arena.",
    "Añade 1ml de muestra de gasolina al cucharón.",
    "Inicia el calentamiento hasta los 400°C.",
    "Observa el proceso de pirólisis.",
    "Analiza el residuo carbonoso (Coque)."
  ];

  useEffect(() => {
    if (step === 0 && sandBathPlaced) setStep(1);
    if (step === 1 && spoonPlaced) setStep(2);
    if (step === 2 && gasolineVol >= 1) {
      setStep(3);
      setShowLearning({
        title: "¿Por qué Baño de Arena?",
        content: "El fuego directo es caótico. La arena distribuye el calor de forma uniforme, simulando el bloque del motor a altas temperaturas sin incendiar la muestra.",
        icon: <BookOpen className="text-orange-500" />
      });
    }

    if (isHeating && temperature < 400) {
      const timer = setInterval(() => {
        setTemperature(prev => {
          const next = prev + 10;
          if (next >= 400) {
            clearInterval(timer);
            setStep(4);
            startPyrolysisSequence();
            return 400;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [sandBathPlaced, spoonPlaced, gasolineVol, isHeating, temperature, step]);

  const startPyrolysisSequence = () => {
    setProcessStep('boiling');
    setTimeout(() => {
      setProcessStep('smoking');
      setShowLearning({
        title: "Craqueo Térmico",
        content: "A 400°C, las moléculas pesadas se rompen. El hidrógeno escapa como humo, dejando el carbono puro atrapado en el metal.",
        icon: <Flame className="text-red-500" />
      });
      setTimeout(() => {
        setProcessStep('coking');
        setStep(5);
        setTimeout(() => setShowResult(true), 2000);
      }, 4000);
    }, 3000);
  };

  const handleAction = (type: string) => {
    if (type === 'sand' && step === 0) setSandBathPlaced(true);
    if (type === 'spoon' && step === 1) setSpoonPlaced(true);
    if (type === 'gasoline' && step === 2) setGasolineVol(1);
    if (type === 'heat' && step === 3) setIsHeating(true);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 3: Pirólisis y Coquización</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Sidebar Tools */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!sandBathPlaced} onClick={() => handleAction('sand')} icon={<div className="w-10 h-6 bg-yellow-700 rounded-t-lg border-2 border-yellow-900"></div>} label="Arena" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('spoon')} icon={<Utensils className="text-gray-500" />} label="Cucharón" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('gasoline')} icon={<Droplet className="text-yellow-600" />} label="Gasolina" highlight={step === 2} />
           <ToolIcon active={step === 3} onClick={() => handleAction('heat')} icon={<Flame className="text-red-500" />} label="Calentar" highlight={step === 3} />
        </div>

        {/* Main Lab Area */}
        <div className="flex-grow bg-gray-900 rounded-3xl border-4 border-dashed border-gray-700 relative flex items-center justify-center min-h-[450px] overflow-hidden">
          
          {/* Temperature HUD */}
          <div className="absolute top-6 right-6 bg-black/60 p-4 rounded-2xl border border-white/20 backdrop-blur-md text-white flex flex-col items-center z-20">
            <Thermometer className={`${temperature > 300 ? 'text-red-500 animate-pulse' : 'text-blue-400'} transition-colors`} />
            <span className="text-xl font-mono font-bold mt-1">{temperature}°C</span>
            <span className="text-[10px] uppercase opacity-60">Temperatura</span>
          </div>

          <div className="absolute bottom-10 flex flex-col items-center">
            {/* Sand Bath */}
            <AnimatePresence>
              {sandBathPlaced && (
                <motion.div 
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-64 h-32 bg-yellow-800 rounded-t-[60px] border-x-8 border-t-4 border-yellow-950 relative overflow-hidden"
                >
                   {/* Heat glow */}
                   <div className="absolute inset-0 bg-red-600 blur-3xl opacity-0 transition-opacity duration-1000" style={{ opacity: temperature / 800 }}></div>
                   {/* Sand texture */}
                   <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spoon and Reactions */}
            {spoonPlaced && (
              <motion.div 
                initial={{ y: -300 }}
                animate={{ y: -80 }}
                className="absolute z-10 flex flex-col items-center"
              >
                 <div className="w-2 h-40 bg-gray-400 border-x border-gray-500 rounded-t-full"></div>
                 <div className="w-24 h-12 bg-gray-300 border-4 border-gray-400 rounded-b-full relative overflow-hidden">
                    
                    {/* Gasoline Liquid */}
                    {gasolineVol > 0 && processStep === 'none' && (
                      <div className="absolute inset-0 bg-yellow-400/30 border-t border-yellow-200"></div>
                    )}

                    {/* Boiling effect */}
                    {processStep === 'boiling' && (
                      <div className="absolute inset-0 bg-blue-300/40">
                         {[...Array(8)].map((_, i) => (
                           <motion.div 
                            key={i}
                            animate={{ y: [-5, -25], opacity: [0, 1, 0], scale: [0.5, 1] }}
                            transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
                            className="absolute bottom-0 w-2 h-2 bg-white/60 rounded-full"
                            style={{ left: 10 + Math.random() * 80 + '%' }}
                           />
                         ))}
                      </div>
                    )}

                    {/* Smoking / Pyrolysis effect */}
                    {processStep === 'smoking' && (
                      <div className="absolute inset-0">
                         {[...Array(12)].map((_, i) => (
                           <motion.div 
                            key={i}
                            initial={{ y: 0, opacity: 0, scale: 1 }}
                            animate={{ 
                              y: -300, 
                              opacity: [0, 0.7, 0], 
                              scale: [1, 5, 8],
                              x: (Math.random() - 0.5) * 150
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            className={`absolute w-10 h-10 rounded-full blur-2xl ${
                              gasolineQuality === 'premium' ? 'bg-gray-300/30' : 'bg-gray-800/70'
                            }`}
                            style={{ left: '40%' }}
                           />
                         ))}
                      </div>
                    )}

                    {/* Final Coke Residue */}
                    {processStep === 'coking' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute inset-0 ${gasolineQuality === 'premium' ? 'bg-transparent' : 'bg-black/95'}`}
                      >
                         {gasolineQuality === 'suspect' && (
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-40"></div>
                         )}
                      </motion.div>
                    )}
                 </div>
              </motion.div>
            )}
          </div>

          {/* Educational Overlay */}
          <AnimatePresence>
            {showLearning && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center p-6">
                <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-t-4 border-orange-500 max-w-sm pointer-events-auto">
                  <div className="flex items-center gap-3 mb-2">{showLearning.icon}<h4 className="font-bold text-orange-900">{showLearning.title}</h4></div>
                  <p className="text-sm text-gray-600 mb-4">{showLearning.content}</p>
                  <button onClick={() => setShowLearning(null)} className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold">Entendido</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Card */}
          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-b-8 border-red-700">
                 <ShieldAlert className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-red-700'}`} />
                 <h2 className="text-xl font-black mb-2 uppercase">Veredicto de Coquización</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "SIN RESIDUOS: El combustible se evaporó al 100%. Gasolina libre de fracciones pesadas."
                      : "COQUE DETECTADO: Costra de carbón dura y negra. Presencia extrema de aceites pesados o diésel."}
                 </p>
                 <div className="bg-red-50 p-3 rounded-lg text-left text-[10px] text-red-900 mb-4 leading-tight">
                    <strong>Peligro Motor:</strong> Este carbón sólido se pega a la cabeza del pistón, reduciendo el espacio de la cámara y aumentando la compresión. Esto provoca el "cascabeleo" que funde el motor en pocos kilómetros.
                 </div>
                 <button onClick={reset} className="bg-orange-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg">Reiniciar</button>
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

export default PyrolysisTestRefactored;
