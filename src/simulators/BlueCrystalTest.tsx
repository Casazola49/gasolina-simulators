import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { RotateCcw, FlaskConical, Droplet, Zap, BookOpen, ShieldAlert } from 'lucide-react';

const BlueCrystalTest: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [tubeOnRack, setTubeOnRack] = useState(false);
  const [gasolineVol, setGasolineVol] = useState(0);
  const [powderAdded, setPowderAdded] = useState(false);
  const [isAgitating, setIsAgitating] = useState(false);
  const [agitationLevel, setAgitationLevel] = useState(0);
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setTubeOnRack(false);
    setGasolineVol(0);
    setPowderAdded(false);
    setAgitationLevel(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca el tubo de ensayo en la gradilla.",
    "Añade 20ml de la muestra de Gasolina.",
    "Añade el Sulfato de Cobre Anhidro (Polvo Blanco).",
    "Agita vigorosamente para forzar el contacto.",
    "Observa si ocurre un cambio de color."
  ];

  useEffect(() => {
    if (step === 0 && tubeOnRack) setStep(1);
    if (step === 1 && gasolineVol >= 20) {
      setStep(2);
      setShowLearning({
        title: "¿Qué es este polvo blanco?",
        content: "Es Sulfato de Cobre Anhidro. 'Anhidro' significa que no tiene agua. En este estado es blanco, pero tiene una sed química insaciable por la humedad.",
        icon: <BookOpen className="text-blue-500" />
      });
    }
    if (step === 2 && powderAdded) setStep(3);
    if (step === 3 && agitationLevel >= 100) {
      setStep(4);
      setShowLearning({
        title: "La Reacción de Hidratación",
        content: "Si hay incluso una gota de agua microscópica, el polvo la absorberá y se transformará en Sulfato de Cobre Pentahidratado, cambiando su estructura cristalina y su color a un azul intenso.",
        icon: <Zap className="text-yellow-500" />
      });
      setTimeout(() => setShowResult(true), 2000);
    }
  }, [tubeOnRack, gasolineVol, powderAdded, agitationLevel, step]);

  const handleAction = (type: string) => {
    if (!tubeOnRack) return;
    if (type === 'gasoline' && step === 1) setGasolineVol(prev => Math.min(prev + 5, 20));
    if (type === 'powder' && step === 2) setPowderAdded(true);
  };

  const handleAgitate = () => {
    if (step === 3 && !isAgitating) {
      setIsAgitating(true);
      const int = setInterval(() => {
        setAgitationLevel(prev => {
          if (prev >= 100) {
            clearInterval(int);
            setIsAgitating(false);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 10: Test del Cristal Azul</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!tubeOnRack} onClick={() => setTubeOnRack(true)} icon={<FlaskConical />} label="Tubo" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('gasoline')} icon={<Droplet className="text-yellow-600" />} label="Gasolina" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('powder')} icon={<div className="w-6 h-6 bg-white border border-gray-300 rounded-sm shadow-sm"></div>} label="Sulfato" highlight={step === 2} />
        </div>

        <div className="flex-grow bg-blue-50/50 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px]">
          <div className="absolute bottom-10 flex flex-col items-center">
            <div className="w-48 h-10 bg-gray-300 rounded-lg shadow-inner"></div>
            
            <AnimatePresence>
              {tubeOnRack && (
                <motion.div 
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ 
                    y: isAgitating ? [0, -20, 20, 0] : -30,
                    rotate: isAgitating ? [0, 5, -5, 0] : 0
                  }}
                  className="w-14 h-64 border-x-4 border-b-4 border-white/60 rounded-b-full bg-white/10 shadow-lg flex flex-col justify-end overflow-hidden relative"
                >
                  {/* Powder at bottom */}
                  {powderAdded && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className={`absolute bottom-0 w-full h-6 blur-[1px] ${showResult && gasolineQuality === 'suspect' ? 'bg-blue-600' : 'bg-white'}`}
                    />
                  )}

                  {/* Gasoline */}
                  <motion.div 
                    animate={{ height: (gasolineVol * 10) + 'px' }}
                    className="w-full bg-yellow-400/30 border-t border-yellow-100"
                  />

                  {isAgitating && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step === 3 && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleAgitate} className="absolute right-10 top-1/2 bg-blue-600 text-white p-4 rounded-full shadow-2xl">
              <RotateCcw className={isAgitating ? 'animate-spin' : ''} />
            </motion.button>
          )}

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

          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-b-8 border-blue-600">
                 <ShieldAlert className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-blue-600'}`} />
                 <h2 className="text-xl font-black mb-2">VEREDICTO DE HUMEDAD</h2>
                 <p className="text-sm text-gray-600 mb-6">
                    {gasolineQuality === 'premium' 
                      ? "NEGATIVO: El polvo se mantuvo blanco. No hay agua libre detectable."
                      : "POSITIVO: El polvo cambió a AZUL. Presencia de agua libre en el combustible."}
                 </p>
                 <div className="bg-red-50 p-3 rounded-lg text-left text-[10px] text-red-800 mb-4 leading-tight">
                    <strong>Impacto en el Motor:</strong> El agua causa cavitación en la bomba de alta presión, destruye los inyectores por corrosión y permite el crecimiento de colonias de bacterias en el tanque.
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

export default BlueCrystalTest;
