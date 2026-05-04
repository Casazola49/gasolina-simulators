import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store/labStore';
import { ShieldAlert, Cpu, Droplet, CheckCircle2, Zap } from 'lucide-react';

const PHAdulterationTestStitch: React.FC = () => {
  const { gasolineQuality } = useLabStore();
  
  // Logic states
  const [step, setStep] = useState(0);
  const [tubeActive, setTubeActive] = useState(false);
  const [cylinderVol, setCylinderVol] = useState(0);
  const [cylinderType, setCylinderType] = useState<'none' | 'fuel' | 'water'>('none');
  const [fuelLevel, setFuelLevel] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0);
  const [sodaApplied, setSodaApplied] = useState(false);
  const [iodineLevel, setIodineLevel] = useState(0);
  const [sensorDeployed, setSensorDeployed] = useState(false);
  const [agitation, setAgitation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Refs
  const tubeRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const fuelRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const iodineRef = useRef<HTMLDivElement>(null);

  const steps = [
    "DEPLOYMENT: Drag the Analysis Tube to the neural base.",
    "EXTRACTION: Charge the Plasma Cylinder with Fuel Muestra A.",
    "INJECTION: Transfer Fuel to the Analysis Tube.",
    "SOLVENT: Charge the Plasma Cylinder with H2O.",
    "INJECTION: Transfer H2O to the Analysis Tube.",
    "KINETIC: Oscillate the Tube to engage molecular extraction.",
    "CATALYST: Drag the NaOH Catalyst to the Tube.",
    "TITRATION: Inject Quantum Lugol to detect Haloform signature.",
    "SCAN: Deploy the pH Bio-Sensor for final signature."
  ];

  const reset = () => {
    setStep(0); setTubeActive(false); setCylinderVol(0); setCylinderType('none');
    setFuelLevel(0); setWaterLevel(0); setSodaApplied(false); setIodineLevel(0);
    setSensorDeployed(false); setAgitation(0); setShowResult(false);
  };

  useEffect(() => {
    if (step === 0 && tubeActive) setStep(1);
    if (step === 1 && cylinderVol >= 10 && cylinderType === 'fuel') setStep(2);
    if (step === 2 && fuelLevel >= 10) { setStep(3); setCylinderVol(0); setCylinderType('none'); }
    if (step === 3 && cylinderVol >= 10 && cylinderType === 'water') setStep(4);
    if (step === 4 && waterLevel >= 10) { setStep(5); setCylinderVol(0); setCylinderType('none'); }
    if (step === 5 && agitation >= 100) setStep(6);
    if (step === 6 && sodaApplied) setStep(7);
    if (step === 7 && iodineLevel >= 3) setStep(8);
    if (step === 8 && sensorDeployed) setTimeout(() => setShowResult(true), 2000);
  }, [tubeActive, cylinderVol, cylinderType, fuelLevel, waterLevel, agitation, sodaApplied, iodineLevel, sensorDeployed, step]);

  const isOver = (r1: React.RefObject<any>, r2: React.RefObject<any>) => {
    if (!r1.current || !r2.current) return false;
    const b1 = r1.current.getBoundingClientRect();
    const b2 = r2.current.getBoundingClientRect();
    return !(b1.right < b2.left || b1.left > b2.right || b1.bottom < b2.top || b1.top > b2.bottom);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] text-white font-sans overflow-hidden" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05),transparent)]"></div>

      {/* Futuristic HUD Header */}
      <div className="p-6 border-b border-cyan-500/20 bg-black/40 backdrop-blur-xl flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_#06b6d4]">
             <Cpu className="text-black w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tighter uppercase italic">Diagnostic Logic // P01</h2>
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-cyan-500 animate-ping"></div>
               <p className="text-[9px] font-mono text-cyan-400 tracking-[0.2em]">{steps[step]}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
           {steps.map((_,i) => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-4 bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'w-2 bg-white/10'}`}></div>)}
        </div>
      </div>

      <div className="flex-grow flex relative z-10 p-8 gap-8">
        
        {/* Module Bay */}
        <div className="w-64 flex flex-col gap-6">
           <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Hardware Bay</h3>
           
           {/* Draggable Tube */}
           {!tubeActive && (
             <motion.div
               ref={tubeRef} drag dragSnapToOrigin
               onDragEnd={() => { if (isOver(tubeRef, baseRef)) setTubeActive(true); }}
               className="cursor-grab active:cursor-grabbing"
             >
                <div className="w-10 h-32 border border-white/20 rounded-b-3xl bg-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                </div>
             </motion.div>
           )}

           {/* Fuel Pod */}
           <div ref={fuelRef} className="relative p-4 border border-white/5 rounded-2xl bg-white/5">
              <div className="w-full h-12 bg-yellow-500/10 rounded-lg border-2 border-yellow-500/20 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-yellow-500/5 animate-pulse"></div>
                 <Droplet className="text-yellow-500 w-5 h-5" />
              </div>
              <p className="text-[8px] font-mono text-center mt-2 text-white/40 tracking-widest">FUEL_RESERVE_A</p>
           </div>

           {/* H2O Pod */}
           <div ref={waterRef} className="relative p-4 border border-white/5 rounded-2xl bg-white/5">
              <div className="w-full h-12 bg-blue-500/10 rounded-lg border-2 border-blue-500/20 flex items-center justify-center relative overflow-hidden">
                 <Droplet className="text-blue-500 w-5 h-5" />
              </div>
              <p className="text-[8px] font-mono text-center mt-2 text-white/40 tracking-widest">SOLVENT_H2O</p>
           </div>

           {/* Catalyst Module */}
           <motion.div
             drag dragSnapToOrigin
             onDragEnd={() => { if (step === 6 && isOver(scannerRef, tubeRef)) setSodaApplied(true); }}
             className={`p-4 border rounded-2xl transition-all cursor-grab active:cursor-grabbing ${step === 6 ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-white/5 bg-white/5 opacity-30'}`}
           >
              <ShieldAlert className="w-6 h-6 mx-auto text-purple-400" />
              <p className="text-[7px] font-black text-center mt-2 uppercase text-purple-200">NaOH Catalyst</p>
           </motion.div>

           {/* Quantum Lugol Module */}
           <motion.div
             ref={iodineRef} drag dragSnapToOrigin
             onDragEnd={() => { if (step === 7 && isOver(iodineRef, tubeRef)) setIodineLevel(p => Math.min(p + 1, 3)); }}
             className={`p-4 border rounded-2xl transition-all cursor-grab active:cursor-grabbing ${step === 7 ? 'border-orange-500 bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'border-white/5 bg-white/5 opacity-30'}`}
           >
              <Zap className="w-6 h-6 mx-auto text-orange-400" />
              <p className="text-[7px] font-black text-center mt-2 uppercase text-orange-200">Quantum Lugol {iodineLevel}/3</p>
           </motion.div>
        </div>

        {/* Neural Analysis Core */}
        <div className="flex-grow relative border border-white/10 rounded-[2.5rem] bg-black/40 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
           
           {/* Grid effect */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

           {/* Holographic Base */}
           <div ref={baseRef} className="absolute bottom-16 w-64 h-8 flex items-center justify-center">
              <div className="w-full h-px bg-cyan-500 shadow-[0_0_15px_#22d3ee]"></div>
              <div className="absolute -bottom-4 w-48 h-8 bg-cyan-500/5 blur-2xl rounded-full"></div>
              
              {tubeActive && (
                <motion.div
                  ref={tubeRef}
                  drag={step === 5}
                  onUpdate={(v: any) => { if (step === 5 && (Math.abs(v.x) > 10 || Math.abs(v.y) > 10)) setAgitation(p => Math.min(p + 0.8, 100)); }}
                  dragSnapToOrigin
                  className="absolute bottom-4 z-20 cursor-move"
                >
                   <div className="w-16 h-64 border-2 border-white/20 rounded-b-[30px] bg-black/40 backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:100%_20px]"></div>
                      
                      <div className="absolute bottom-0 w-full flex flex-col justify-end">
                         {/* Water Layer */}
                         <motion.div 
                           animate={{ 
                             height: (waterLevel * 12) + 'px',
                             backgroundColor: agitation > 50 && gasolineQuality === 'suspect' ? 'rgba(255,255,255,0.6)' : 'rgba(56, 189, 248, 0.4)'
                           }}
                           className="w-full relative transition-colors duration-1000 shadow-inner"
                         >
                            {/* Iodoform Precipitate Effect */}
                            {iodineLevel >= 3 && gasolineQuality === 'suspect' && (
                              <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="absolute bottom-0 w-full h-12 bg-yellow-400/60 blur-md flex items-center justify-center overflow-hidden"
                              >
                                 <motion.div 
                                   animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                                   transition={{ duration: 2, repeat: Infinity }}
                                   className="w-full h-full bg-[radial-gradient(circle,rgba(253,224,71,0.8)_0%,transparent_70%)]"
                                 />
                              </motion.div>
                            )}

                            {sensorDeployed && (
                               <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className={`w-1 h-32 mx-auto shadow-[0_0_10px_currentColor] ${gasolineQuality === 'suspect' ? 'text-purple-500 bg-purple-500' : 'text-green-400 bg-green-400'}`} />
                            )}
                         </motion.div>
                         {/* Fuel Layer */}
                         <motion.div 
                           animate={{ height: (fuelLevel * 12) + 'px' }}
                           className={`w-full border-t border-white/20 ${showResult && gasolineQuality === 'suspect' ? 'bg-orange-600/40' : 'bg-yellow-400/30'}`}
                         />
                      </div>
                   </div>
                </motion.div>
              )}
           </div>

           {/* Floating Scanner (Plasma Cylinder) */}
           <motion.div
             ref={scannerRef} drag dragSnapToOrigin
             onDragEnd={() => {
                if (step === 1 && isOver(scannerRef, fuelRef)) { setCylinderVol(10); setCylinderType('fuel'); }
                if (step === 3 && isOver(scannerRef, waterRef)) { setCylinderVol(10); setCylinderType('water'); }
                if (tubeActive && isOver(scannerRef, tubeRef)) {
                   if (step === 2 && cylinderType === 'fuel') setFuelLevel(10);
                   if (step === 4 && cylinderType === 'water') setWaterLevel(10);
                }
             }}
             className="absolute top-20 right-20 z-50 cursor-grab active:cursor-grabbing"
           >
              <div className="w-12 h-40 border border-cyan-500/30 rounded-b-2xl bg-cyan-500/5 backdrop-blur-xl relative shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                 <div className="absolute inset-0 flex flex-col justify-between py-6 px-1 opacity-20">
                    {[...Array(5)].map((_,i) => <div key={i} className="w-full h-px bg-cyan-400"></div>)}
                 </div>
                 <motion.div 
                   animate={{ height: (cylinderVol * 12) + 'px' }}
                   className={`absolute bottom-0 w-full blur-[2px] ${cylinderType === 'fuel' ? 'bg-yellow-400/50' : 'bg-blue-400/50'}`}
                 />
              </div>
              <p className="text-[7px] font-mono text-center mt-2 text-cyan-400 uppercase tracking-[0.2em]">Plasma_Cylinder</p>
           </motion.div>

           {/* pH Sensor Deployment Tool */}
           {step === 8 && (
             <motion.div 
               drag dragSnapToOrigin
               onDragEnd={() => { if (isOver(scannerRef, tubeRef)) setSensorDeployed(true); }}
               className="absolute top-40 left-20 w-2 h-24 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full cursor-grab active:cursor-grabbing z-50 shadow-[0_0_15px_#22d3ee]"
             >
                <div className="w-4 h-4 bg-white/20 rounded-full -ml-1 mt-[-2px] animate-pulse"></div>
             </motion.div>
           )}

           {/* HUD Data Overlays */}
           <div className="absolute top-10 left-10 space-y-4">
              <HUDLine label="Kinetic_Agit" value={Math.round(agitation) + '%'} color="text-orange-400" />
              <HUDLine label="Alcaline_Scan" value={sensorDeployed ? (gasolineQuality === 'suspect' ? 'CRITICAL' : 'STABLE') : 'WAITING'} color={sensorDeployed ? (gasolineQuality === 'suspect' ? 'text-red-500' : 'text-green-400') : 'text-white/20'} />
           </div>

        </div>

        {/* AI Logic Sidebar */}
        <div className="w-72 bg-black/40 backdrop-blur-2xl p-8 border-l border-white/5 flex flex-col">
           <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-6">Engine Analytics</h4>
           <div className="space-y-8">
              <Stat label="Polymer_Integrity" value={showResult ? (gasolineQuality === 'suspect' ? '0%' : '100%') : '---'} />
              <Stat label="Oxidation_Potential" value={fuelLevel > 0 ? (gasolineQuality === 'suspect' ? 'HIGH' : 'LOW') : '---'} />
              
              <div className="mt-10 p-4 border border-white/10 rounded-xl bg-white/5">
                 <p className="text-[9px] font-mono text-white/40 leading-relaxed italic">
                    "STITCH Engine detected abnormal Ph clusters. Saponification reaction imminent if NaOH is applied to suspects."
                 </p>
              </div>
           </div>
        </div>

      </div>

      {/* Result Layer */}
      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-20">
             <div className="max-w-3xl w-full bg-[#050A14] border border-cyan-500/30 rounded-[3rem] p-16 shadow-[0_0_100px_rgba(6,182,212,0.2)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
                
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <h2 className="text-5xl font-black italic tracking-tighter text-white">SCAN COMPLETE</h2>
                      <p className="text-sm font-mono text-cyan-400/60 uppercase tracking-[0.4em] mt-2">Veredict Hash: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                   </div>
                   <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${gasolineQuality === 'premium' ? 'border-green-500 text-green-500' : 'border-red-600 text-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)]'}`}>
                      {gasolineQuality === 'premium' ? <CheckCircle2 className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mb-12">
                   <ResultBit label="Structure" value={gasolineQuality === 'premium' ? 'STABLE' : 'EMULSIFIED'} />
                   <ResultBit label="PH_Index" value={gasolineQuality === 'premium' ? '7.00' : '12.85'} warning={gasolineQuality === 'suspect'} />
                   <ResultBit label="Haloform" value={gasolineQuality === 'premium' ? 'NEGATIVE' : 'POSITIVE'} warning={gasolineQuality === 'suspect'} />
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl mb-12">
                   <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">Neural Impact Projection</h4>
                   <p className="text-base text-white/80 leading-relaxed font-light">
                      {gasolineQuality === 'premium' 
                        ? "Diagnostic confirms molecular purity. Fuel injection hardware operating within safety parameters."
                        : "WARNING: Critical alkalinity detected. High risk of elastomer degradation. Fuel pump failure projection: IMMEDIATE. Discontinue use to prevent thermal event."}
                   </p>
                </div>

                <button onClick={reset} className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.5em] text-xs rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]">Initialize New Scan</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

const HUDLine = ({ label, value, color = "text-white" }: any) => (
  <div className="font-mono text-[9px] flex gap-3">
     <span className="text-white/30 uppercase tracking-widest">{label}</span>
     <span className={`${color} font-bold`}>{value}</span>
  </div>
);

const Stat = ({ label, value }: any) => (
  <div>
     <div className="flex justify-between items-end mb-2">
        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-bold text-white font-mono">{value}</span>
     </div>
     <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-500/50 transition-all duration-1000" style={{ width: value === '---' ? '0%' : '100%' }}></div>
     </div>
  </div>
);

const ResultBit = ({ label, value, warning = false }: any) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
     <p className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-2">{label}</p>
     <p className={`text-2xl font-bold tracking-tight ${warning ? 'text-red-500 animate-pulse' : 'text-white'}`}>{value}</p>
  </div>
);

export default PHAdulterationTestStitch;
