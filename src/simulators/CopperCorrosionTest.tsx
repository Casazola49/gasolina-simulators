import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { FlaskConical, Droplet, Thermometer, BookOpen, ShieldAlert, Layers } from 'lucide-react';

const CopperCorrosionTest: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [tubeOnRack, setTubeOnRack] = useState(false);
  const [gasolineVol, setGasolineVol] = useState(0);
  const [stripInTube, setStripInTube] = useState(false);
  const [bathTemperature, setBathTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);
  const [, setExposureTime] = useState(0); // 0 to 100
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setTubeOnRack(false);
    setGasolineVol(0);
    setStripInTube(false);
    setBathTemperature(25);
    setIsHeating(false);
    setExposureTime(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca el tubo de ensayo en la gradilla.",
    "Añade 30ml de Gasolina al tubo.",
    "Introduce la lámina de cobre pulida.",
    "Coloca el tubo en el baño María y calienta a 50°C.",
    "Espera el tiempo de reacción (simulado).",
    "Extrae y observa la lámina."
  ];

  useEffect(() => {
    if (step === 0 && tubeOnRack) setStep(1);
    if (step === 1 && gasolineVol >= 30) {
      setStep(2);
      setShowLearning({
        title: "¿Por qué el Cobre?",
        content: "El cobre es muy sensible al azufre. En los motores, los colectores de las bombas eléctricas de gasolina son de cobre. Si el combustible es corrosivo, la bomba fallará pronto.",
        icon: <BookOpen className="text-orange-500" />
      });
    }
    if (step === 2 && stripInTube) setStep(3);
    if (step === 3 && bathTemperature >= 50) setStep(4);
    
    if (step === 4 && isHeating) {
      const timer = setInterval(() => {
        setExposureTime(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep(5);
            setShowLearning({
              title: "Ataque Químico en Proceso",
              content: "A 50°C, aceleramos la reacción entre el cobre y los compuestos de azufre activo (mercaptanos) que la refinería no eliminó correctamente.",
              icon: <Layers className="text-blue-500" />
            });
            setTimeout(() => setShowResult(true), 1500);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [tubeOnRack, gasolineVol, stripInTube, bathTemperature, isHeating, step]);

  const handleAction = (type: string) => {
    if (!tubeOnRack) return;
    if (type === 'gasoline' && step === 1) setGasolineVol(prev => Math.min(prev + 10, 30));
    if (type === 'strip' && step === 2) setStripInTube(true);
    if (type === 'heat' && step === 3) {
      setIsHeating(true);
      const int = setInterval(() => {
        setBathTemperature(prev => {
          if (prev >= 50) {
            clearInterval(int);
            return 50;
          }
          return prev + 5;
        });
      }, 100);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 4: Corrosión de Cobre</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Inventory */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!tubeOnRack} onClick={() => setTubeOnRack(true)} icon={<FlaskConical />} label="Tubo" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('gasoline')} icon={<Droplet className="text-yellow-600" />} label="Gasolina" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('strip')} icon={<div className="w-2 h-8 bg-orange-400 border border-orange-600 rounded-sm"></div>} label="Cobre" highlight={step === 2} />
           <ToolIcon active={step === 3} onClick={() => handleAction('heat')} icon={<Thermometer className="text-red-500" />} label="Calentar" highlight={step === 3} />
        </div>

        {/* Main Lab Area */}
        <div className="flex-grow bg-blue-50/50 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px]">
          {/* Water Bath */}
          <div className={`absolute bottom-0 w-64 h-40 bg-blue-200/40 border-4 border-gray-300 rounded-t-3xl transition-colors ${isHeating ? 'bg-blue-300/60' : ''}`}>
             <div className="absolute top-2 w-full text-center text-[10px] font-black text-blue-800 uppercase">Baño María ({bathTemperature}°C)</div>
          </div>

          {/* Tube */}
          <div className="absolute bottom-10 flex flex-col items-center">
            <AnimatePresence>
              {tubeOnRack && (
                <motion.div 
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: step >= 3 ? 0 : -60 }}
                  className="w-14 h-64 border-x-4 border-b-4 border-white/60 rounded-b-full bg-white/10 shadow-lg flex flex-col justify-end overflow-hidden relative"
                >
                  {/* Copper Strip */}
                  {stripInTube && (
                    <motion.div 
                      initial={{ y: -100 }} animate={{ y: 0 }}
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-32 z-10 ${
                        showResult 
                          ? (gasolineQuality === 'suspect' ? 'bg-gray-800' : 'bg-orange-500') 
                          : 'bg-orange-400'
                      } border border-black/20`}
                    />
                  )}

                  {/* Gasoline */}
                  <motion.div 
                    animate={{ height: (gasolineVol * 6) + 'px' }}
                    className="w-full bg-yellow-400/30 border-t border-yellow-100"
                  />
                  
                  {isHeating && step === 4 && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Learning Overlay */}
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

          {/* Result Card */}
          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-b-8 border-blue-600">
                 <ShieldAlert className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-red-800'}`} />
                 <h2 className="text-xl font-black mb-2 uppercase">Veredicto de Corrosión</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "CLASIFICACIÓN 1a: La lámina se mantuvo brillante. Gasolina libre de azufre corrosivo."
                      : "CLASIFICACIÓN 4: Lámina ENNEGRECIDA. Presencia extrema de azufre activo."}
                 </p>
                 <div className="bg-orange-50 p-3 rounded-lg text-left text-[10px] text-orange-800 mb-4 leading-tight">
                    <strong>Peligro Mecánico:</strong> Este combustible destruye el colector de cobre de la bomba de gasolina por ataque químico. La bomba se cortocircuita y el auto se detiene por completo en medio de la vía.
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

export default CopperCorrosionTest;
