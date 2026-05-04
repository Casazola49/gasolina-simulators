import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { Info, RotateCcw, Beaker, FlaskConical, Droplet, Zap, AlertTriangle } from 'lucide-react';

// Tipos para los objetos que se pueden arrastrar
type LabTool = 'gasoline' | 'doctor_reagent' | 'sulfur' | 'test_tube';

const DoctorTest: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  // Estado de la práctica
  const [tubeOnRack, setTubeOnRack] = useState(false);
  const [gasolineVolume, setGasolineVolume] = useState(0); // max 10ml
  const [reagentVolume, setReagentVolume] = useState(0); // max 5ml
  const [hasSulfur, setHasSulfur] = useState(false);
  const [agitationLevel, setAgitationLevel] = useState(0); // 0 to 100
  const [step, setStep] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [isAgitating, setIsAgitating] = useState(false);

  // Mensaje de guía
  const [guide, setGuide] = useState("Paso 1: Coloca el tubo de ensayo en la gradilla.");

  const reset = () => {
    setTubeOnRack(false);
    setGasolineVolume(0);
    setReagentVolume(0);
    setHasSulfur(false);
    setAgitationLevel(0);
    setStep(0);
    setShowResult(false);
    setGuide("Paso 1: Coloca el tubo de ensayo en la gradilla.");
  };

  // Lógica de avance de pasos
  useEffect(() => {
    if (step === 0 && tubeOnRack) {
      setStep(1);
      setGuide("Paso 2: Añade 10ml de Gasolina al tubo.");
    } else if (step === 1 && gasolineVolume >= 10) {
      setStep(2);
      setGuide("Paso 3: Añade 5ml de Reactivo Doctor.");
    } else if (step === 2 && reagentVolume >= 5) {
      setStep(3);
      setGuide("Paso 4: Tapa y agita vigorosamente por 15 segundos.");
    } else if (step === 3 && agitationLevel >= 100) {
      setStep(4);
      setGuide("Paso 5: Añade una pizca de Azufre en Flor.");
      setAgitationLevel(0); // Reset para la segunda agitación
    } else if (step === 4 && hasSulfur) {
      setStep(5);
      setGuide("Paso 6: Agita nuevamente para revelar la reacción.");
    } else if (step === 5 && agitationLevel >= 100) {
      setStep(6);
      setGuide("Paso 7: Deja reposar y observa la interfase.");
      setTimeout(() => setShowResult(true), 2000);
    }
  }, [tubeOnRack, gasolineVolume, reagentVolume, hasSulfur, agitationLevel, step]);

  // Función para manejar el "vaciado" de líquidos
  const handlePour = (type: LabTool) => {
    if (!tubeOnRack) return;
    if (type === 'gasoline' && step === 1) {
      setGasolineVolume(prev => Math.min(prev + 2, 10));
    } else if (type === 'doctor_reagent' && step === 2) {
      setReagentVolume(prev => Math.min(prev + 1, 5));
    } else if (type === 'sulfur' && step === 4) {
      setHasSulfur(true);
    }
  };

  // Simulación de agitación
  const handleAgitate = () => {
    if ((step === 3 || step === 5) && !isAgitating) {
      setIsAgitating(true);
      const interval = setInterval(() => {
        setAgitationLevel(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsAgitating(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Guía Superior */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded-r-lg shadow-sm">
        <p className="text-sm font-bold text-yellow-800 flex items-center gap-2">
          <Info className="w-4 h-4" /> {guide}
        </p>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6">
        {/* Inventario Lateral (PhET Style) */}
        <div className="w-full md:w-48 bg-gray-200 p-4 rounded-2xl flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto border-2 border-gray-300 shadow-inner">
          <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2 hidden md:block">Materiales</h4>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !tubeOnRack && setTubeOnRack(true)}
            className={`cursor-pointer p-3 bg-white rounded-xl shadow-sm border-2 ${tubeOnRack ? 'opacity-30' : 'border-blue-400'}`}
          >
            <FlaskConical className="w-8 h-8 mx-auto text-blue-500" />
            <p className="text-[10px] text-center mt-1 font-bold">Tubo de Ensayo</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePour('gasoline')}
            className={`cursor-pointer p-3 bg-white rounded-xl shadow-sm border-2 ${step === 1 ? 'border-yellow-400 animate-pulse' : 'border-gray-200'}`}
          >
            <Droplet className="w-8 h-8 mx-auto text-yellow-600" />
            <p className="text-[10px] text-center mt-1 font-bold">Gasolina</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePour('doctor_reagent')}
            className={`cursor-pointer p-3 bg-white rounded-xl shadow-sm border-2 ${step === 2 ? 'border-orange-400 animate-pulse' : 'border-gray-200'}`}
          >
            <Beaker className="w-8 h-8 mx-auto text-orange-500" />
            <p className="text-[10px] text-center mt-1 font-bold">R. Doctor</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePour('sulfur')}
            className={`cursor-pointer p-3 bg-white rounded-xl shadow-sm border-2 ${step === 4 ? 'border-yellow-300 animate-pulse' : 'border-gray-200'}`}
          >
            <Zap className="w-8 h-8 mx-auto text-yellow-400" />
            <p className="text-[10px] text-center mt-1 font-bold">Azufre Flor</p>
          </motion.div>
        </div>

        {/* Mesa de Trabajo Principal */}
        <div className="flex-grow bg-white/50 rounded-3xl border-4 border-dashed border-gray-300 relative flex items-center justify-center overflow-hidden min-h-[400px]">
          
          {/* Gradilla */}
          <div className="absolute bottom-10 w-64 h-24 bg-brown-600 border-x-8 border-t-4 border-amber-900 rounded-lg flex items-center justify-center gap-8">
            <div className="w-12 h-12 bg-black/20 rounded-full border-2 border-amber-950/30 shadow-inner"></div>
            <div className="w-12 h-12 bg-black/20 rounded-full border-2 border-amber-950/30 shadow-inner"></div>
            <div className="w-12 h-12 bg-black/20 rounded-full border-2 border-amber-950/30 shadow-inner"></div>
          </div>

          {/* Tubo de Ensayo Animado */}
          <AnimatePresence>
            {tubeOnRack && (
              <motion.div
                initial={{ y: -300, opacity: 0 }}
                animate={{ 
                  y: isAgitating ? [0, -20, 20, -10, 0] : 0,
                  rotate: isAgitating ? [0, 5, -5, 5, 0] : 0
                }}
                transition={{ duration: isAgitating ? 0.2 : 0.5, repeat: isAgitating ? Infinity : 0 }}
                className="relative z-10 w-16 h-64 border-x-4 border-b-4 border-white/60 rounded-b-full bg-white/10 shadow-lg backdrop-blur-[2px] flex flex-col justify-end overflow-hidden"
              >
                {/* Reactivo Doctor (Abajo) */}
                <motion.div 
                  animate={{ height: (reagentVolume * 15) + 'px' }}
                  className="w-full bg-orange-400/50 border-t border-orange-200"
                ></motion.div>
                
                {/* Interfase / Azufre */}
                {hasSulfur && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-full h-2 z-20 ${showResult && gasolineQuality === 'suspect' ? 'bg-black' : 'bg-yellow-300/80'}`}
                  ></motion.div>
                )}

                {/* Gasolina (Arriba) */}
                <motion.div 
                  animate={{ height: (gasolineVolume * 15) + 'px' }}
                  className={`w-full ${showResult && gasolineQuality === 'suspect' ? 'bg-orange-900/40' : 'bg-yellow-400/30'} border-t border-yellow-200`}
                ></motion.div>
                
                {/* Efecto de Agitación (Burbujas/Turbidez) */}
                {isAgitating && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón de Acción de Agitación */}
          {(step === 3 || step === 5) && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAgitate}
              className="absolute top-1/2 right-10 bg-blue-600 text-white p-4 rounded-full shadow-xl font-bold flex flex-col items-center"
            >
              <RotateCcw className={`w-8 h-8 ${isAgitating ? 'animate-spin' : ''}`} />
              <span className="text-[10px] mt-1">AGITAR</span>
            </motion.button>
          )}

          {/* Resultado Visual Final */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/10 backdrop-blur-sm"
            >
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-t-8 border-blue-600">
                <Zap className={`w-16 h-16 mx-auto mb-4 ${gasolineQuality === 'premium' ? 'text-green-500' : 'text-red-600'}`} />
                <h3 className="text-2xl font-black mb-2 uppercase italic">Veredicto</h3>
                <p className="text-gray-600 mb-6">
                  {gasolineQuality === 'premium' 
                    ? "NEGATIVO: La gasolina es 'Dulce'. No se detectaron mercaptanos corrosivos."
                    : "POSITIVO: La gasolina es 'Agria'. Presencia de mercaptanos que dañan catalizadores."}
                </p>
                <button 
                  onClick={reset}
                  className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
                >
                  Nueva Prueba
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Panel de Datos / Teoría */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">Estado de la Mezcla</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Gasolina:</span>
                <span className="font-mono">{gasolineVolume}ml / 10ml</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full transition-all" style={{ width: (gasolineVolume * 10) + '%' }}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>R. Doctor:</span>
                <span className="font-mono">{reagentVolume}ml / 5ml</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full transition-all" style={{ width: (reagentVolume * 20) + '%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-800 text-white p-4 rounded-xl shadow-lg relative overflow-hidden group">
            <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform" />
            <h4 className="font-bold text-xs uppercase opacity-70 mb-2">Dato Técnico</h4>
            <p className="text-xs leading-relaxed italic">
              "El azufre en flor es el 'revelador'. Si hay mercaptanos, se pegará a ellos y se tornará negro como hollín (Sulfuro de Plomo)."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorTest;
