import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Info, Droplet, Thermometer, BookOpen, Gauge, Ruler } from 'lucide-react';

const DensityAPITest: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  const [step, setStep] = useState(0);
  const [cylinderOnTable, setCylinderOnTable] = useState(false);
  const [gasolineVol, setGasolineVol] = useState(0); // target 250ml
  const [thermometerIn, setThermometerIn] = useState(false);
  const [hydrometerIn, setHydrometerIn] = useState(false);
  const [temperature, setTemperature] = useState(20);
  const [density, setDensity] = useState(0);
  const [showLearning, setShowLearning] = useState<{title: string, content: string, icon: React.ReactNode} | null>(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setStep(0);
    setCylinderOnTable(false);
    setGasolineVol(0);
    setThermometerIn(false);
    setHydrometerIn(false);
    setTemperature(20);
    setDensity(0);
    setShowLearning(null);
    setShowResult(false);
  };

  const steps = [
    "Coloca la probeta de 250ml en la mesa.",
    "Llena la probeta con 250ml de muestra.",
    "Introduce el termómetro para medir la temperatura actual.",
    "Sumerge el densímetro (hidrómetro) con cuidado.",
    "Espera a que el densímetro se estabilice para leer.",
    "Calcula la Gravedad API final."
  ];

  useEffect(() => {
    if (step === 0 && cylinderOnTable) setStep(1);
    if (step === 1 && gasolineVol >= 250) {
      setStep(2);
      setShowLearning({
        title: "El Peso del Combustible",
        content: "La densidad no es solo un número; es el 'DNI' de la gasolina. Si es muy densa, tiene aceites pesados. Si es muy ligera, puede tener exceso de alcoholes volátiles.",
        icon: <BookOpen className="text-blue-500" />
      });
    }
    if (step === 2 && thermometerIn) {
      setStep(3);
      setTemperature(gasolineQuality === 'premium' ? 15 : 22);
    }
    if (step === 3 && hydrometerIn) {
      setStep(4);
      setTimeout(() => setStep(5), 2000);
    }
    if (step === 5) {
      // Cálculo simulado de densidad basado en calidad
      const baseDensity = gasolineQuality === 'premium' ? 0.740 : 0.785;
      setDensity(baseDensity);
      setTimeout(() => setShowResult(true), 1500);
    }
  }, [cylinderOnTable, gasolineVol, thermometerIn, hydrometerIn, step, gasolineQuality]);

  const handleAction = (type: string) => {
    if (type === 'cylinder' && step === 0) setCylinderOnTable(true);
    if (type === 'gasoline' && step === 1) setGasolineVol(prev => Math.min(prev + 50, 250));
    if (type === 'thermometer' && step === 2) setThermometerIn(true);
    if (type === 'hydrometer' && step === 3) setHydrometerIn(true);
  };

  // Cálculo de Grados API: (141.5 / SG) - 131.5
  const apiGravity = density > 0 ? (141.5 / density) - 131.5 : 0;

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-b-2 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{step + 1}</div>
          <p className="font-bold text-gray-700">{steps[step]}</p>
        </div>
        <div className="text-[10px] uppercase font-black text-gray-400">Prueba 5: Densidad y Gravedad API</div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 relative">
        {/* Tools */}
        <div className="w-full md:w-40 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-3 shadow-inner border-2 border-gray-300">
           <ToolIcon active={!cylinderOnTable} onClick={() => handleAction('cylinder')} icon={<Ruler className="rotate-90" />} label="Probeta" highlight={step === 0} />
           <ToolIcon active={step === 1} onClick={() => handleAction('gasoline')} icon={<Droplet className="text-yellow-600" />} label="Muestra" highlight={step === 1} />
           <ToolIcon active={step === 2} onClick={() => handleAction('thermometer')} icon={<Thermometer className="text-red-500" />} label="Termómetro" highlight={step === 2} />
           <ToolIcon active={step === 3} onClick={() => handleAction('hydrometer')} icon={<Gauge className="text-blue-600" />} label="Densímetro" highlight={step === 3} />
        </div>

        {/* Lab Bench */}
        <div className="flex-grow bg-white/40 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center min-h-[450px]">
          <div className="absolute bottom-10 flex flex-col items-center">
            <div className="w-64 h-8 bg-gray-400 rounded-full shadow-md"></div>
            
            <AnimatePresence>
              {cylinderOnTable && (
                <motion.div 
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: -20 }}
                  className="w-24 h-80 border-x-4 border-b-4 border-white/60 rounded-b-xl bg-white/10 shadow-lg flex flex-col justify-end overflow-hidden relative"
                >
                  {/* Graduation Marks */}
                  <div className="absolute inset-0 flex flex-col justify-between py-4 px-1 opacity-30">
                    {[...Array(10)].map((_, i) => <div key={i} className="w-full h-px bg-gray-800"></div>)}
                  </div>

                  {/* Gasoline */}
                  <motion.div 
                    animate={{ height: (gasolineVol * 1.1) + 'px' }}
                    className="w-full bg-yellow-400/40 border-t-2 border-yellow-300 relative"
                  >
                    {/* Hydrometer (Densímetro) */}
                    {hydrometerIn && (
                      <motion.div 
                        initial={{ y: -200 }}
                        animate={{ y: step >= 5 ? (gasolineQuality === 'premium' ? 40 : 20) : 0 }}
                        className="absolute left-1/2 -translate-x-1/2 w-4 h-64 flex flex-col items-center"
                      >
                         <div className="w-1 h-40 bg-gray-200 border-x border-gray-400"></div>
                         <div className="w-4 h-24 bg-gray-100 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <div className="w-1 h-16 bg-red-500/20"></div>
                         </div>
                      </motion.div>
                    )}

                    {/* Thermometer */}
                    {thermometerIn && (
                      <motion.div 
                        initial={{ x: 20, y: -200 }}
                        animate={{ x: 20, y: 0 }}
                        className="absolute left-1/2 w-2 h-72 bg-gray-100 border-x border-gray-400 rounded-full"
                      >
                         <div className="absolute bottom-0 w-full bg-red-500 rounded-full transition-all" style={{ height: (temperature * 2) + 'px' }}></div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

          {/* Result Overlay */}
          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border-t-8 border-blue-600">
                 <Gauge className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                 <h2 className="text-2xl font-black mb-4 uppercase">Informe de Metrología</h2>
                 
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                       <p className="text-[10px] uppercase font-black text-gray-400">Densidad (SG)</p>
                       <p className="text-xl font-mono font-bold text-blue-700">{density.toFixed(3)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                       <p className="text-[10px] uppercase font-black text-gray-400">Gravedad API</p>
                       <p className="text-xl font-mono font-bold text-blue-700">{apiGravity.toFixed(1)}°</p>
                    </div>
                 </div>

                 <div className="p-4 rounded-xl text-left text-xs mb-6 space-y-2 bg-blue-50">
                    <p className="flex items-start gap-2">
                       <Info className="w-4 h-4 text-blue-600 shrink-0" />
                       {gasolineQuality === 'premium' 
                        ? "VALORES NORMALES: API entre 55-65 indica una gasolina ligera, pura y fácil de quemar para el motor."
                        : "VALORES ANORMALES: API bajo (combustible denso) indica presencia de diésel o aceites pesados que causarán carbonilla."}
                    </p>
                    <div className="mt-2 text-[10px] text-gray-500 border-t border-blue-200 pt-2">
                       <strong>Impacto:</strong> Una gravedad API baja significa que el combustible no se atomiza bien en los inyectores, aumentando el consumo y las emisiones.
                    </div>
                 </div>
                 
                 <button onClick={reset} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg">Reiniciar Análisis</button>
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

export default DensityAPITest;
