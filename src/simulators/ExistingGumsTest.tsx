import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Beaker, Droplet, Thermometer, AlertTriangle, BookOpen, Wind } from 'lucide-react';

const ExistingGumsTest: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [beakerOnBath, setBeakerOnBath] = useState(false);
  const [gasolineVol, setGasolineVol] = useState(0); // target 50ml
  const [bathTemp, setBathTemp] = useState(25);
  const [airFlowOn, setAirFlowOn] = useState(false);
  const [evaporationProgress, setEvaporationProgress] = useState(0); // 0 to 100
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setBeakerOnBath(false);
    setGasolineVol(0);
    setBathTemp(25);
    setAirFlowOn(false);
    setEvaporationProgress(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca el vaso de precipitados en el bloque calefactor.",
    "Añade 50ml de muestra de gasolina al vaso.",
    "Calienta el baño hasta alcanzar los 95°C.",
    "Activa el flujo de aire para iniciar la evaporación forzada.",
    "Espera a que la muestra se evapore completamente.",
    "Analiza el residuo gomoso en el fondo del vaso."
  ];

  useEffect(() => {
    if (step === 0 && beakerOnBath) setStep(1);
    if (step === 1 && gasolineVol >= 50) {
      setStep(2);
      setShowLearning({
        title: "¿Qué son las 'Gomas'?",
        content: "Son polímeros pesados que se forman cuando la gasolina se oxida. Al evaporarse el combustible, estas gomas se quedan atrás como un barniz pegajoso.",
        icon: <BookOpen className="text-orange-500" />
      });
    }
    if (step === 2 && bathTemp >= 95) setStep(3);
    
    if (step === 3 && airFlowOn) {
      setStep(4);
      setShowLearning({
        title: "Evaporación Forzada",
        content: "Usamos aire caliente a presión para acelerar el proceso. En un motor, este proceso ocurre en los inyectores y válvulas, donde el calor es constante.",
        icon: <Wind className="text-blue-500" />
      });
    }

    if (step === 4) {
      const timer = setInterval(() => {
        setEvaporationProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep(5);
            setTimeout(() => setShowResult(true), 1500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [beakerOnBath, gasolineVol, bathTemp, airFlowOn, step]);

  const handleAction = (type: string) => {
    if (type === 'beaker' && step === 0) setBeakerOnBath(true);
    if (type === 'gasoline' && step === 1) setGasolineVol(prev => Math.min(prev + 10, 50));
    if (type === 'heat' && step === 2) {
      const int = setInterval(() => {
        setBathTemp(prev => {
          if (prev >= 95) {
            clearInterval(int);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
    }
    if (type === 'air' && step === 3) setAirFlowOn(true);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 6: Ensayo de Gomas Existentes</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Tools */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!beakerOnBath} onClick={() => handleAction('beaker')} icon={<Beaker />} label="Vaso" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('gasoline')} icon={<Droplet className="text-yellow-600" />} label="Muestra" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('heat')} icon={<Thermometer className="text-red-500" />} label="Calentar" highlight={step === 2} />
           <ToolIcon active={step === 3} onClick={() => handleAction('air')} icon={<Wind className="text-blue-400" />} label="Aire" highlight={step === 3} />
        </div>

        {/* Lab Area */}
        <div className="flex-grow bg-blue-50/30 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px]">
          {/* Heating Block */}
          <div className="absolute bottom-10 flex flex-col items-center">
            <div className="w-56 h-16 bg-gray-700 rounded-t-xl border-t-4 border-gray-600 flex items-center justify-center">
               <div className={`w-4 h-4 rounded-full ${bathTemp > 50 ? 'bg-red-500 animate-pulse' : 'bg-red-900'}`}></div>
               <div className="ml-2 text-white font-mono text-xs">{bathTemp}°C</div>
            </div>
            
            <AnimatePresence>
              {beakerOnBath && (
                <motion.div 
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: -20 }}
                  className="w-32 h-40 border-x-4 border-b-4 border-white/60 rounded-b-xl bg-white/10 shadow-lg flex flex-col justify-end overflow-hidden relative"
                >
                  {/* Evaporating gasoline */}
                  <motion.div 
                    animate={{ 
                      height: (gasolineVol * 2 * (1 - evaporationProgress / 100)) + 'px',
                      opacity: 1 - (evaporationProgress / 100)
                    }}
                    className="w-full bg-yellow-400/40 border-t border-yellow-200"
                  />

                  {/* Residue (Gums) */}
                  {evaporationProgress > 50 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: (evaporationProgress - 50) / 50 }}
                      className={`absolute bottom-0 w-full h-4 blur-[2px] ${gasolineQuality === 'suspect' ? 'bg-orange-800/80' : 'bg-orange-200/40'}`}
                    />
                  )}

                  {/* Air pipe (Upper part) */}
                  {airFlowOn && evaporationProgress < 100 && (
                    <motion.div 
                      initial={{ y: -50 }} animate={{ y: 0 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gray-300/50 flex flex-col items-center"
                    >
                       <div className="w-full h-full animate-pulse bg-blue-100/20"></div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result Card */}
          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-b-8 border-orange-600">
                 <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${gasolineQuality === 'premium' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <AlertTriangle className={gasolineQuality === 'premium' ? 'text-green-600' : 'text-red-600'} />
                 </div>
                 <h2 className="text-xl font-black mb-2 uppercase italic tracking-tighter">Residuo de Gomas</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "RESIDUO INSIGNIFICANTE: El combustible se evaporó limpiamente."
                      : "RESIDUO EXCESIVO: Se detectó un 'barniz' naranja insoluble en el fondo del vaso."}
                 </p>
                 <div className="bg-orange-50 p-3 rounded-lg text-left text-[10px] text-orange-900 mb-4 leading-tight">
                    <strong>Peligro Motor:</strong> Estas gomas se depositan en el vástago de las válvulas, haciendo que se 'peguen' y choquen contra el pistón. También taponan los micro-orificios de los inyectores modernos.
                 </div>
                 <button onClick={reset} className="bg-orange-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg">Repetir Ensayo</button>
              </div>
            </motion.div>
          )}

          {/* Learning Box */}
          <AnimatePresence>
            {showLearning && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center p-6">
                <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-blue-500 max-w-sm">
                  <div className="flex items-center gap-3 mb-2">{showLearning.icon}<h4 className="font-bold">{showLearning.title}</h4></div>
                  <p className="text-sm text-gray-600 mb-4">{showLearning.content}</p>
                  <button onClick={() => setShowLearning(null)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Continuar</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

export default ExistingGumsTest;
