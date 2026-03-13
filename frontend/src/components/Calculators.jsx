import React, { useState, useMemo } from 'react';
import { Calculator, X, ChevronDown, Activity, Scale, Droplet, Flame, ArrowRightLeft, Stethoscope, Carrot, Info } from 'lucide-react';

const CATEGORIES = [
  { id: 'anthropometrics', name: 'Anthropometrics & Weight', icon: Scale },
  { id: 'energy', name: 'Energy & Macronutrients', icon: Flame },
  { id: 'fluid', name: 'Fluid Needs', icon: Droplet },
  { id: 'diabetes', name: 'Diabetes & Labs', icon: Stethoscope },
  { id: 'nutrition_support', name: 'Enteral/Parenteral', icon: Activity },
  { id: 'foodservice', name: 'Foodservice', icon: Carrot },
  { id: 'conversions', name: 'Conversions', icon: ArrowRightLeft },
];

const CALCULATORS = [
  // Anthropometrics
  {
    id: 'bmi', category: 'anthropometrics', name: 'BMI (Body Mass Index)',
    fields: [{ id: 'weight', label: 'Weight (kg)', type: 'number' }, { id: 'height', label: 'Height (m)', type: 'number' }],
    calc: (v) => v.weight && v.height ? (v.weight / (v.height * v.height)).toFixed(1) + ' kg/m²' : null
  },
  {
    id: 'ibw', category: 'anthropometrics', name: 'Ideal Body Weight (Hamwi)',
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male'] },
      { id: 'heightIn', label: 'Height (inches)', type: 'number' }
    ],
    calc: (v) => {
      if (!v.gender || !v.heightIn) return null;
      let base = v.gender === 'Female' ? 100 : 106;
      let extra = v.gender === 'Female' ? 5 : 6;
      let inchesOver5Ft = v.heightIn > 60 ? v.heightIn - 60 : 0;
      let ibwLb = base + (inchesOver5Ft * extra);
      return `${ibwLb} lbs (${(ibwLb / 2.2).toFixed(1)} kg)`;
    }
  },
  {
    id: 'adjbw', category: 'anthropometrics', name: 'Adjusted Body Weight (AdjBW)',
    fields: [{ id: 'actual', label: 'Actual Weight (kg)', type: 'number' }, { id: 'ibw', label: 'IBW (kg)', type: 'number' }],
    calc: (v) => v.actual && v.ibw ? (v.ibw + 0.25 * (v.actual - v.ibw)).toFixed(1) + ' kg' : null
  },
  {
    id: 'wt_change', category: 'anthropometrics', name: '% Weight Change',
    fields: [{ id: 'usual', label: 'Usual Weight', type: 'number' }, { id: 'current', label: 'Current Weight', type: 'number' }],
    calc: (v) => v.usual && v.current ? (((v.usual - v.current) / v.usual) * 100).toFixed(1) + '%' : null
  },
  {
    id: 'ubw', category: 'anthropometrics', name: '% Usual Body Weight (%UBW)',
    fields: [{ id: 'current', label: 'Current Weight', type: 'number'}, { id: 'usual', label: 'Usual Weight', type: 'number'}],
    calc: (v) => v.current && v.usual ? ((v.current / v.usual) * 100).toFixed(1) + '%' : null
  },

  // Energy & Macros
  {
    id: 'msj', category: 'energy', name: 'Mifflin-St Jeor (REE)',
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male'] },
      { id: 'weight', label: 'Weight (kg)', type: 'number' },
      { id: 'height', label: 'Height (cm)', type: 'number' },
      { id: 'age', label: 'Age (years)', type: 'number' }
    ],
    calc: (v) => {
      if (!v.gender || !v.weight || !v.height || !v.age) return null;
      let ree = (10 * v.weight) + (6.25 * v.height) - (5 * v.age);
      ree += (v.gender === 'Male' ? 5 : -161);
      return Math.round(ree) + ' kcal/day';
    }
  },
  {
    id: 'quick_kcal', category: 'energy', name: 'Quick kcal/kg',
    fields: [{ id: 'weight', label: 'Weight (kg)', type: 'number' }, { id: 'factor', label: 'kcal/kg (e.g. 25-30)', type: 'number' }],
    calc: (v) => v.weight && v.factor ? Math.round(v.weight * v.factor) + ' kcal/day' : null
  },
  {
    id: 'protein_bw', category: 'energy', name: 'Protein Needs (g/kg)',
    fields: [{ id: 'weight', label: 'Weight (kg)', type: 'number'}, { id: 'factor', label: 'Factor (g/kg, e.g. 0.8-1.5)', type: 'number'}],
    calc: (v) => v.weight && v.factor ? (v.weight * v.factor).toFixed(1) + ' g/day' : null
  },
  {
    id: 'kcal_macros', category: 'energy', name: 'kcal from Macros',
    fields: [
      { id: 'cho', label: 'Carbs (g)', type: 'number' },
      { id: 'pro', label: 'Protein (g)', type: 'number' },
      { id: 'fat', label: 'Fat (g)', type: 'number' },
      { id: 'alc', label: 'Alcohol (g)', type: 'number' }
    ],
    calc: (v) => {
      let choC = (v.cho || 0) * 4;
      let proC = (v.pro || 0) * 4;
      let fatC = (v.fat || 0) * 9;
      let alcC = (v.alc || 0) * 7;
      let total = choC + proC + fatC + alcC;
      return total > 0 ? total + ' kcal' : null;
    }
  },

  // Fluid
  {
    id: 'fluid_kcal', category: 'fluid', name: 'Standard Fluid (1 mL/kcal)',
    fields: [{ id: 'kcal', label: 'Total Energy Needs (kcal)', type: 'number' }],
    calc: (v) => v.kcal ? v.kcal + ' mL/day' : null
  },
  {
    id: 'fluid_wt', category: 'fluid', name: 'Weight-based Fluid',
    fields: [{ id: 'weight', label: 'Weight (kg)', type: 'number' }, { id: 'factor', label: 'Factor (mL/kg, e.g. 30-35)', type: 'number' }],
    calc: (v) => v.weight && v.factor ? Math.round(v.weight * v.factor) + ' mL/day' : null
  },
  {
    id: 'holiday_segar', category: 'fluid', name: 'Holiday-Segar (Peds Fluid)',
    fields: [{ id: 'weight', label: 'Weight (kg)', type: 'number' }],
    calc: (v) => {
      if (!v.weight) return null;
      let ml = 0;
      let wt = v.weight;
      if (wt > 20) { ml = 1000 + 500 + ((wt - 20) * 20); }
      else if (wt > 10) { ml = 1000 + ((wt - 10) * 50); }
      else { ml = wt * 100; }
      return ml + ' mL/day';
    }
  },

  // Diabetes & Labs
  {
    id: 'carb_serving', category: 'diabetes', name: 'Carb Counting',
    fields: [{ id: 'carbs', label: 'Total Carbs (g)', type: 'number' }],
    calc: (v) => v.carbs ? (v.carbs / 15).toFixed(1) + ' servings (exchanges)' : null
  },
  {
    id: 'corr_factor', category: 'diabetes', name: 'Correction Factor (1800 Rule)',
    fields: [{ id: 'tdd', label: 'Total Daily Insulin Dose (units)', type: 'number' }],
    calc: (v) => v.tdd ? (1800 / v.tdd).toFixed(1) + ' mg/dL drop per 1 unit' : null
  },
  {
    id: 'icr', category: 'diabetes', name: 'Insulin-to-Carb Ratio (500 Rule)',
    fields: [{ id: 'tdd', label: 'Total Daily Insulin Dose (units)', type: 'number' }],
    calc: (v) => v.tdd ? '1 unit / ' + (500 / v.tdd).toFixed(1) + ' g carbs' : null
  },
  {
    id: 'friedewald', category: 'diabetes', name: 'Friedewald LDL',
    fields: [{ id: 'tc', label: 'Total Chol', type: 'number'}, { id: 'hdl', label: 'HDL', type: 'number'}, { id: 'tg', label: 'Triglycerides', type: 'number'}],
    calc: (v) => v.tc && v.hdl && v.tg ? (v.tc - v.hdl - (v.tg / 5)).toFixed(1) + ' mg/dL' : null
  },
  {
    id: 'n_balance', category: 'diabetes', name: 'Nitrogen Balance',
    fields: [{ id: 'proIn', label: 'Protein Intake (g)', type: 'number' }, { id: 'uun', label: 'UUN (g)', type: 'number' }],
    calc: (v) => v.proIn && v.uun ? ((v.proIn / 6.25) - (v.uun + 4)).toFixed(2) + ' g' : null
  },
  {
    id: 'corr_ca', category: 'diabetes', name: 'Corrected Calcium',
    fields: [{ id: 'ca', label: 'Serum Ca (mg/dL)', type: 'number'}, { id: 'alb', label: 'Albumin (g/dL)', type: 'number'}],
    calc: (v) => v.ca && v.alb ? (v.ca + 0.8 * (4 - v.alb)).toFixed(1) + ' mg/dL' : null
  },

  // Nutrition Support
  {
    id: 'tf_rate', category: 'nutrition_support', name: 'Tube Feeding Rate',
    fields: [{ id: 'vol', label: 'Total Volume (mL)', type: 'number' }, { id: 'hrs', label: 'Hours Infused', type: 'number' }],
    calc: (v) => v.vol && v.hrs ? (v.vol / v.hrs).toFixed(1) + ' mL/hr' : null
  },
  {
    id: 'gir', category: 'nutrition_support', name: 'Glucose Infusion Rate (GIR)',
    fields: [{ id: 'cho', label: 'Dextrose (g/day)', type: 'number'}, { id: 'wt', label: 'Weight (kg)', type: 'number'}],
    calc: (v) => v.cho && v.wt ? ((v.cho * 1000) / (v.wt * 1440)).toFixed(2) + ' mg/kg/min' : null
  },

  // Conversions
  {
    id: 'lb_kg', category: 'conversions', name: 'lb ↔ kg',
    fields: [{ id: 'lb', label: 'Pounds', type: 'number'}, { id: 'kg', label: 'Kilograms', type: 'number'}],
    calc: (v) => {
      if (v.lb && !v.kg) return (v.lb / 2.2).toFixed(2) + ' kg';
      if (v.kg && !v.lb) return (v.kg * 2.2).toFixed(2) + ' lb';
      return null;
    }
  },
  {
    id: 'in_cm', category: 'conversions', name: 'inches ↔ cm',
    fields: [{ id: 'inches', label: 'Inches', type: 'number'}, { id: 'cm', label: 'Centimeters', type: 'number'}],
    calc: (v) => {
      if (v.inches && !v.cm) return (v.inches * 2.54).toFixed(2) + ' cm';
      if (v.cm && !v.inches) return (v.cm / 2.54).toFixed(2) + ' in';
      return null;
    }
  }
];

const Calculators = ({ isOpen, onClose, onInsertToDraft, hasActiveDraft }) => {
  const [selectedCalcId, setSelectedCalcId] = useState('');
  const [inputs, setInputs] = useState({});

  const selectedCalc = useMemo(() => CALCULATORS.find(c => c.id === selectedCalcId), [selectedCalcId]);
  
  const handleInputChange = (e, fieldId) => {
    setInputs(prev => ({ ...prev, [fieldId]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value }));
  };

  const handleCalcSelect = (e) => {
    setSelectedCalcId(e.target.value);
    setInputs({}); // Reset inputs on change
  };

  const result = selectedCalc ? selectedCalc.calc(inputs) : null;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      
      {/* Sliding Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800 overflow-y-auto font-sans flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 flex justify-between items-center group">
          <div className="flex items-center space-x-3">
             <div className="bg-gradient-to-br from-brand-500 to-accent-500 p-2 sm:p-2.5 rounded-xl text-white shadow-md">
                <Calculator size={20} className="group-hover:animate-pulse" />
             </div>
             <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-800 dark:text-white">Dietitian Tools</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Select Formula</label>
            <div className="relative">
              <select 
                value={selectedCalcId}
                onChange={handleCalcSelect}
                className="w-full appearance-none bg-surface-50 dark:bg-surface-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-medium rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 pr-10 hover:border-brand-300 dark:hover:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors shadow-sm cursor-pointer"
              >
                <option value="" disabled>Choose a calculator...</option>
                {CATEGORIES.map(cat => {
                  const catCalcs = CALCULATORS.filter(c => c.category === cat.id);
                  if (catCalcs.length === 0) return null;
                  return (
                    <optgroup key={cat.id} label={cat.name} className="font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">
                      {catCalcs.map(c => (
                        <option key={c.id} value={c.id} className="font-normal text-slate-700 dark:text-slate-300">{c.name}</option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {selectedCalc ? (
             <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 mb-auto shadow-sm">
                    <h3 className="font-bold font-heading text-lg text-slate-800 dark:text-slate-100 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">{selectedCalc.name}</h3>
                    <div className="space-y-4">
                      {selectedCalc.fields.map(field => (
                         <div key={field.id}>
                           <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{field.label}</label>
                           {field.type === 'select' ? (
                               <select 
                                onChange={(e) => handleInputChange(e, field.id)}
                                value={inputs[field.id] || ''}
                                className="w-full bg-surface-50 dark:bg-surface-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
                              >
                                <option value="" disabled>Select...</option>
                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                           ) : (
                              <input 
                                type="number"
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                onChange={(e) => handleInputChange(e, field.id)}
                                value={inputs[field.id] || ''}
                                className="w-full bg-surface-50 dark:bg-surface-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
                              />
                           )}
                         </div>
                      ))}
                    </div>
                 </div>

                 {/* Result Card */}
                 <div className={`mt-6 rounded-2xl p-4 sm:p-6 transition-all duration-300 border ${result ? 'bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-950/40 dark:to-accent-950/40 border-brand-200 dark:border-brand-800/60 shadow-md transform scale-100' : 'bg-surface-50 dark:bg-surface-800 border-slate-100 dark:border-slate-700 opacity-70 transform scale-95 origin-bottom'}`}>
                     <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Result</p>
                     <div className="min-h-[3rem] flex items-center justify-between">
                         {result ? (
                             <>
                               <p className="text-xl sm:text-2xl font-black font-heading tracking-tight text-brand-700 dark:text-brand-400 break-words pr-2 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">{result}</p>
                               {hasActiveDraft && (
                                  <button
                                     onClick={() => onInsertToDraft(`${selectedCalc.name}: ${result}`)}
                                     className="shrink-0 flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
                                     title="Insert to Active Draft"
                                  >
                                    Insert &rarr;
                                  </button>
                               )}
                             </>
                         ) : (
                             <p className="text-slate-400 text-sm font-medium flex items-center">
                                <Info size={16} className="mr-2" /> Fill in values to see result
                             </p>
                         )}
                     </div>
                 </div>
             </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Calculator size={48} className="mb-4 text-slate-300" strokeWidth={1} />
                <p className="text-center font-medium">Select a formula above to get started</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Calculators;
