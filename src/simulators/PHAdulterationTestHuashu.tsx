import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

const PHAdulterationTestHuashu: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  // Logic states
  const [step, setStep] = useState(0);
  const [tubeOnRack, setTubeOnRack] = useState(false);
  const [cylinderVolume, setCylinderVolume] = useState(0); // 0 to 10
  const [cylinderLiquidType, setCylinderLiquidType] = useState<'none' | 'gasoline' | 'water'>('none');
  const [gasolineInTube, setGasolineInTube] = useState(0); // target 10
  const [waterInTube, setWaterInTube] = useState(0); // target 10
  const [causticSodaAdded, setCausticSodaAdded] = useState(false);
  const [iodineDrops, setIodineDrops] = useState(0); // target 3 for titration
  const [phPaperIn, setPhPaperIn] = useState(false);
  const [agitationLevel, setAgitationLevel] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Drag constraints ref to prevent layout breaking
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Interaction Refs
  const tubeRef = useRef<HTMLDivElement>(null);
  const rackRef = useRef<HTMLDivElement>(null);
  const gasolineBottleRef = useRef<HTMLDivElement>(null);
  const waterBottleRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  const stepsInfo = [
    { title: "PREPARACIÓN", action: "Arrastra el TUBO DE ENSAYO hacia la GRADILLA vacía." },
    { title: "MEDICIÓN DE MUESTRA", action: "Arrastra la PROBETA hacia la botella de GASOLINA para extraer 10ml." },
    { title: "INYECCIÓN", action: "Arrastra la PROBETA llena hacia el TUBO para verter la gasolina." },
    { title: "MEDICIÓN DE SOLVENTE", action: "Arrastra la PROBETA hacia el AGUA DESTILADA para extraer 10ml." },
    { title: "INYECCIÓN", action: "Arrastra la PROBETA llena hacia el TUBO para verter el agua." },
    { title: "EXTRACCIÓN ACTIVA", action: "Haz clic y ARRASTRA EL TUBO rápidamente de lado a lado para agitar la mezcla." },
    { title: "CATALIZADOR ALCALINO", action: "Arrastra la SODA CÁUSTICA hacia el TUBO para alcalinizar el medio." },
    { title: "TITULACIÓN DE HALOFORMO", action: "Arrastra el REACTIVO LUGOL (Yodo) hacia el tubo 3 veces para titilar gota a gota." },
    { title: "SENSOR DE pH", action: "Arrastra el PAPEL pH hacia el tubo para la lectura final." }
  ];

  const reset = () => {
    setStep(0); setTubeOnRack(false); setCylinderVolume(0); setCylinderLiquidType('none');
    setGasolineInTube(0); setWaterInTube(0); setCausticSodaAdded(false); setIodineDrops(0);
    setPhPaperIn(false); setAgitationLevel(0); setShowResult(false);
  };

  useEffect(() => {
    if (step === 0 && tubeOnRack) setStep(1);
    if (step === 1 && cylinderVolume >= 10 && cylinderLiquidType === 'gasoline') setStep(2);
    if (step === 2 && gasolineInTube >= 10) { setStep(3); setCylinderVolume(0); setCylinderLiquidType('none'); }
    if (step === 3 && cylinderVolume >= 10 && cylinderLiquidType === 'water') setStep(4);
    if (step === 4 && waterInTube >= 10) { setStep(5); setCylinderVolume(0); setCylinderLiquidType('none'); }
    if (step === 5 && agitationLevel >= 100) setStep(6);
    if (step === 6 && causticSodaAdded) setStep(7);
    if (step === 7 && iodineDrops >= 3) setStep(8);
    if (step === 8 && phPaperIn) setTimeout(() => setShowResult(true), 2000);
  }, [tubeOnRack, cylinderVolume, cylinderLiquidType, gasolineInTube, waterInTube, agitationLevel, causticSodaAdded, iodineDrops, phPaperIn, step]);

  const isOverlapping = (ref1: React.RefObject<any>, ref2: React.RefObject<any>) => {
    if (!ref1.current || !ref2.current) return false;
    const rect1 = ref1.current.getBoundingClientRect();
    const rect2 = ref2.current.getBoundingClientRect();
    // Add a 20px tolerance margin for easier dropping
    const margin = 20;
    return !(rect1.right < (rect2.left - margin) || rect1.left > (rect2.right + margin) || rect1.bottom < (rect2.top - margin) || rect1.top > (rect2.bottom + margin));
  };

  return (
    <div className="w-full h-full flex flex-col font-serif bg-[#F9F9F7] text-neutral-900 relative" style={{ fontFamily: '"Newsreader", serif' }}>
      
      {/* Editorial Header */}
      <div className="px-10 py-6 border-b border-black/10 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between bg-white shadow-sm z-50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Prueba 01: Extracción Líquido-Líquido y Haloformo</h2>
          <p className="text-xs font-sans text-neutral-500 uppercase tracking-widest mt-1">Detección de Adulterantes y pH</p>
        </div>
        
        {/* Dynamic Instructions Panel */}
        <div className="bg-orange-50 border border-orange-200 px-6 py-3 rounded-lg shadow-sm max-w-lg">
           <div className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-1">Instrucción Actual (Paso {step + 1}/9)</div>
           <div className="text-sm font-bold text-orange-900 font-sans flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shrink-0"></span>
              {step < 9 ? stepsInfo[step].action : "Análisis Completado."}
           </div>
        </div>
      </div>

      {/* Main Interactive Area with Constraints */}
      <div ref={constraintsRef} className="flex-grow relative flex flex-col lg:flex-row p-6 gap-6 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Inventory Shelf */}
        <div className="w-full lg:w-56 bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl shadow-inner p-6 flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-6 items-center justify-center z-20">
           <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 w-full text-center border-b border-black/10 pb-2 mb-2">Reactivos y Materiales</h3>
           
           {/* Draggable Tube */}
           <div className="relative">
             {!tubeOnRack && (
               <motion.div
                 ref={tubeRef}
                 drag dragConstraints={constraintsRef} dragSnapToOrigin
                 onDragEnd={() => { if (isOverlapping(tubeRef, rackRef)) setTubeOnRack(true); }}
                 className={`cursor-grab active:cursor-grabbing z-50 p-2 rounded-xl transition-all ${step === 0 ? 'bg-white shadow-lg ring-2 ring-orange-400 ring-offset-2' : ''}`}
               >
                  <div className="w-8 h-32 border-2 border-black/20 rounded-b-full bg-white/20 backdrop-blur-sm relative overflow-hidden shadow-lg mx-auto">
                     <div className="absolute top-0 left-1 w-1 h-full bg-white/40 blur-[1px]"></div>
                  </div>
                  <p className="text-[9px] font-sans font-bold uppercase text-center mt-2 text-neutral-600">Tubo Cristal</p>
               </motion.div>
             )}
           </div>

           {/* Gasoline Bottle (Target) */}
           <div ref={gasolineBottleRef} className={`relative p-2 rounded-xl transition-all ${step === 1 ? 'bg-white shadow-md ring-2 ring-orange-400 border border-orange-200' : 'opacity-70'}`}>
              <div className="w-12 h-20 bg-yellow-600/10 border-2 border-yellow-600/30 rounded-t-lg rounded-b-sm relative flex items-center justify-center mx-auto">
                 <div className="w-4 h-3 bg-neutral-800 absolute -top-3 rounded-t-sm"></div>
                 <span className="text-[6px] font-black text-yellow-800 rotate-90">GASOLINA</span>
              </div>
              <p className="text-[8px] font-sans font-bold text-center mt-2 uppercase text-neutral-600">Muestra Fuel</p>
           </div>

           {/* Water Bottle (Target) */}
           <div ref={waterBottleRef} className={`relative p-2 rounded-xl transition-all ${step === 3 ? 'bg-white shadow-md ring-2 ring-orange-400 border border-orange-200' : 'opacity-70'}`}>
              <div className="w-12 h-20 bg-blue-400/10 border-2 border-blue-400/30 rounded-t-lg rounded-b-sm relative flex items-center justify-center mx-auto">
                 <div className="w-4 h-3 bg-white border border-neutral-300 absolute -top-3 rounded-t-sm"></div>
                 <span className="text-[8px] font-black text-blue-500">H2O DEST.</span>
              </div>
              <p className="text-[8px] font-sans font-bold text-center mt-2 uppercase text-neutral-600">Solvente</p>
           </div>
        </div>

        {/* Central Work Bench */}
        <div className="flex-grow relative bg-white border border-black/5 rounded-[2rem] shadow-sm flex flex-col items-center justify-center overflow-hidden min-h-[400px] lg:min-h-0">
           {/* Subtle Grid Background */}
           <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

           {/* The Rack (Target) */}
           <div ref={rackRef} className={`absolute bottom-20 w-72 h-24 flex items-end justify-center transition-all ${step === 0 ? 'ring-4 ring-orange-400 ring-offset-8 rounded-xl bg-orange-50/50' : ''}`}>
              <div className="w-full h-3 bg-[#8B5A2B] rounded-sm shadow-xl border-b-2 border-black/40"></div>
              <div className="absolute top-8 w-full h-6 bg-[#A06934] border-y border-black/10 flex justify-around items-center px-6">
                 <div className="w-10 h-4 bg-black/20 rounded-full shadow-inner"></div>
              </div>
              
              {/* Tube on Rack */}
              {tubeOnRack && (
                <motion.div 
                  ref={tubeRef}
                  drag={step === 5} dragConstraints={constraintsRef} dragSnapToOrigin
                  onUpdate={(latest: any) => {
                    if (step === 5 && (Math.abs(latest.x) > 30)) {
                      setAgitationLevel(prev => Math.min(prev + 1.5, 100));
                    }
                  }}
                  className={`absolute bottom-3 z-20 cursor-grab active:cursor-grabbing ${[2, 4, 6, 7, 8].includes(step) ? 'ring-4 ring-orange-400 ring-offset-4 rounded-full bg-white/50' : ''} ${step === 5 ? 'ring-4 ring-blue-500 animate-pulse' : ''}`}
                >
                   <div className="w-14 h-64 border-2 border-white/60 rounded-b-full bg-white/30 backdrop-blur-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative overflow-hidden">
                      {/* Liquids inside tube */}
                      <div className="absolute bottom-0 w-full flex flex-col justify-end">
                         {/* Water Layer */}
                         <motion.div 
                          animate={{ height: (waterInTube * 15) + 'px' }}
                          className={`w-full transition-colors duration-1000 relative ${agitationLevel > 50 && gasolineQuality === 'suspect' ? 'bg-neutral-300' : 'bg-blue-300/40'}`}
                         >
                            {/* Haloform Precipitate (Yellow Iodoform) */}
                            {iodineDrops >= 3 && gasolineQuality === 'suspect' && (
                              <motion.div 
                                initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2 }}
                                className="absolute bottom-0 w-full h-12 bg-yellow-300/90 blur-[1px] flex items-center justify-center"
                              >
                                <span className="text-[6px] font-sans font-black text-yellow-800 opacity-50 uppercase tracking-widest text-center leading-none">Precipitado<br/>Yodoformo</span>
                              </motion.div>
                            )}

                            {/* pH Paper */}
                            {phPaperIn && (
                              <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className={`absolute left-1/2 -translate-x-1/2 w-3 h-40 ${gasolineQuality === 'suspect' ? 'bg-purple-800 shadow-[0_0_10px_rgba(107,33,168,0.5)]' : 'bg-yellow-500'} rounded-sm z-10`} />
                            )}
                         </motion.div>

                         {/* Gasoline Layer */}
                         <motion.div 
                          animate={{ height: (gasolineInTube * 12) + 'px' }}
                          className="w-full bg-yellow-400/30 border-t border-white/50 backdrop-blur-sm"
                         />
                      </div>
                      <div className="absolute top-0 left-1 w-2 h-full bg-white/40 blur-[1px]"></div>
                   </div>
                </motion.div>
              )}
           </div>

           {/* Draggable Measuring Cylinder */}
           <motion.div
             ref={cylinderRef}
             drag dragConstraints={constraintsRef} dragSnapToOrigin
             onDragEnd={() => {
                if (step === 1 && isOverlapping(cylinderRef, gasolineBottleRef)) { setCylinderVolume(10); setCylinderLiquidType('gasoline'); }
                if (step === 3 && isOverlapping(cylinderRef, waterBottleRef)) { setCylinderVolume(10); setCylinderLiquidType('water'); }
                if (tubeOnRack && isOverlapping(cylinderRef, tubeRef)) {
                   if (step === 2 && cylinderLiquidType === 'gasoline') setGasolineInTube(10);
                   if (step === 4 && cylinderLiquidType === 'water') setWaterInTube(10);
                }
             }}
             className={`absolute top-2 lg:top-20 right-2 lg:right-40 z-50 cursor-grab active:cursor-grabbing p-2 rounded-xl transition-all ${[1, 2, 3, 4].includes(step) ? 'bg-white shadow-xl ring-2 ring-orange-500 ring-offset-4' : ''}`}
           >
              <div className="w-10 h-40 border-x-2 border-b-2 border-black/10 rounded-b-lg bg-white/20 backdrop-blur-md relative shadow-xl mx-auto">
                 <div className="absolute inset-0 flex flex-col justify-between py-2 px-1 opacity-20">
                    {[10,9,8,7,6,5,4,3,2,1].map(v => <div key={v} className="w-full h-px bg-black flex justify-end text-[5px] font-mono">{v}</div>)}
                 </div>
                 <motion.div 
                  animate={{ height: (cylinderVolume * 15) + 'px' }}
                  className={`absolute bottom-0 w-full ${cylinderLiquidType === 'gasoline' ? 'bg-yellow-400/50' : 'bg-blue-300/50'}`}
                 />
              </div>
              <p className="text-[7px] font-sans font-bold text-center mt-2 opacity-60 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">Probeta 10ml</p>
           </motion.div>

        </div>

        {/* Right Tools Shelf (Titration & Chemistry) */}
        <div className="w-full lg:w-56 bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl shadow-inner p-6 flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-6 items-center justify-center z-20">
           <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 w-full text-center border-b border-black/10 pb-2 mb-2">Herramientas Químicas</h3>
           
           {/* Caustic Soda Dropper */}
           <DraggableTool 
              stepMatch={6} currentStep={step} tubeRef={tubeRef}
              onDropSuccess={() => setCausticSodaAdded(true)}
              name="Soda Cáustica"
              icon={<div className="w-6 h-10 bg-white border border-red-200 shadow-sm relative flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-red-500" /><div className="w-2 h-3 bg-red-500 absolute -top-3 rounded-sm"></div></div>}
           />

           {/* Iodine Titration Burette / Dropper */}
           <DraggableTool 
              stepMatch={7} currentStep={step} tubeRef={tubeRef}
              onDropSuccess={() => setIodineDrops(p => p + 1)}
              name={`Lugol (Yodo) ${iodineDrops}/3`}
              pulseColor="ring-purple-500"
              icon={<div className="w-4 h-12 bg-purple-900/80 border border-purple-950 rounded-b-full shadow-inner relative"><div className="w-2 h-4 bg-black absolute -top-4 left-1 rounded-sm"></div></div>}
           />

           {/* pH Paper */}
           <DraggableTool 
              stepMatch={8} currentStep={step} tubeRef={tubeRef}
              onDropSuccess={() => setPhPaperIn(true)}
              name="Papel pH"
              pulseColor="ring-green-500"
              icon={<div className="w-8 h-10 bg-[#F5DEB3] border border-[#D2B48C] shadow-sm flex flex-col items-center justify-center"><div className="flex gap-1"><div className="w-1 h-8 bg-red-500"></div><div className="w-1 h-8 bg-yellow-500"></div><div className="w-1 h-8 bg-green-500"></div></div></div>}
           />

           {/* Mini Ledger */}
           <div className="mt-auto w-full bg-white p-4 border border-black/10 rounded-xl font-sans">
              <div className="text-[8px] font-black uppercase text-neutral-400 mb-2">Lectura de Sensores</div>
              <div className="flex justify-between text-xs mb-1"><span className="text-neutral-500">Volumen Total</span><span className="font-bold">{gasolineInTube + waterInTube}ml</span></div>
              <div className="flex justify-between text-xs mb-1"><span className="text-neutral-500">Agitación</span><span className="font-bold text-orange-600">{Math.round(agitationLevel)}%</span></div>
              <div className="flex justify-between text-xs"><span className="text-neutral-500">Gotas Yodo</span><span className="font-bold text-purple-700">{iodineDrops}/3</span></div>
           </div>
        </div>

      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F9F9F7]/95 backdrop-blur-md p-10">
             <div className="max-w-4xl w-full p-12 border border-black/10 bg-white shadow-2xl relative overflow-y-auto max-h-full">
                <div className="absolute top-0 left-0 w-full h-2 bg-neutral-900"></div>
                <div className="flex justify-between items-start mb-8">
                   <div>
                     <h2 className="text-4xl font-bold tracking-tighter">INFORME FORENSE COMPLETO</h2>
                     <p className="font-sans text-sm text-neutral-500 uppercase tracking-widest mt-1">Prueba 01: pH y Reacción de Haloformo</p>
                   </div>
                   {gasolineQuality === 'premium' ? <CheckCircle2 className="w-16 h-16 text-green-600" /> : <ShieldAlert className="w-16 h-16 text-red-600" />}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   <div className="bg-neutral-50 p-6 border border-neutral-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Emulsión</p>
                      <p className="text-lg font-medium">{gasolineQuality === 'premium' ? 'Negativa (Límpida)' : 'Positiva (Turbia)'}</p>
                   </div>
                   <div className="bg-neutral-50 p-6 border border-neutral-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Prueba Haloformo</p>
                      <p className={`text-lg font-medium ${gasolineQuality === 'suspect' ? 'text-yellow-600' : ''}`}>{gasolineQuality === 'premium' ? 'Negativa' : 'Precipitado Yodoformo'}</p>
                   </div>
                   <div className="bg-neutral-50 p-6 border border-neutral-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">pH Final</p>
                      <p className={`text-lg font-medium ${gasolineQuality === 'suspect' ? 'text-purple-600 font-bold' : ''}`}>{gasolineQuality === 'premium' ? '7.0 (Neutro)' : '12.5 (Alcalino)'}</p>
                   </div>
                </div>

                <div className="bg-white p-8 border-l-4 border-neutral-900 mb-8 shadow-sm">
                   <h4 className="text-sm font-black uppercase tracking-widest mb-4 font-sans">Análisis Químico Detallado</h4>
                   <p className="text-base leading-relaxed text-neutral-700 font-serif">
                      {gasolineQuality === 'premium' 
                        ? "La muestra ha superado todas las pruebas de pureza. No se observó reacción de haloformo, indicando ausencia de alcoholes o cetonas no autorizadas. El pH neutro confirma que la gasolina es segura para los componentes de polímero del motor."
                        : "ALERTA CRÍTICA: La formación del precipitado amarillo (Yodoformo) confirma la adulteración con etanol o metilcetonas de bajo costo. Combinado con el pH altamente alcalino (12.5), este combustible provocará la saponificación de las grasas lubricantes y la destrucción inminente de los o-rings de los inyectores. Riesgo de fuga e incendio muy alto."}
                   </p>
                </div>

                <button onClick={reset} className="w-full py-5 bg-neutral-900 text-white font-sans font-bold uppercase tracking-[0.4em] text-xs hover:bg-neutral-800 transition-all">Realizar Nueva Prueba</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Helper component for draggable tools
const DraggableTool = ({ stepMatch, currentStep, tubeRef, onDropSuccess, name, icon, pulseColor = "ring-orange-500" }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOverlapping = (ref1: React.RefObject<any>, ref2: React.RefObject<any>) => {
    if (!ref1.current || !ref2.current) return false;
    const r1 = ref1.current.getBoundingClientRect();
    const r2 = ref2.current.getBoundingClientRect();
    return !(r1.right < (r2.left - 20) || r1.left > (r2.right + 20) || r1.bottom < (r2.top - 20) || r1.top > (r2.bottom + 20));
  };

  return (
    <motion.div 
      ref={ref}
      drag dragSnapToOrigin
      onDragEnd={() => {
        if (currentStep === stepMatch && isOverlapping(ref, tubeRef)) onDropSuccess();
      }}
      className={`relative p-3 bg-white border border-black/10 rounded-xl cursor-grab active:cursor-grabbing flex flex-col items-center transition-all shadow-sm ${currentStep === stepMatch ? `ring-2 ${pulseColor} shadow-lg ring-offset-2 animate-pulse` : ''}`}
    >
       {icon}
       <p className="text-[8px] font-sans font-bold uppercase text-center mt-3 text-neutral-600">{name}</p>
    </motion.div>
  );
};

export default PHAdulterationTestHuashu;
