export interface CaffeineInputs {
  weight: number; // in kg
  hoursAwake: number;
  hoursToSurvive: number;
  tolerance: "Low" | "Moderate" | "High";
  weightUnit: "kg" | "lb";
}

export interface CaffeineSource {
  name: string;
  servingSize: string;
  caffeinePerServing: number;
  servingsNeeded: number;
}

export interface CaffeineResult {
  totalMg: number;
  breakdown: string;
  sources: CaffeineSource[];
  safetyWarning?: string;
}

export function calculateCaffeine(inputs: CaffeineInputs): CaffeineResult {
  // Convert weight to kg if needed
  const weightInKg = inputs.weightUnit === "lb" ? inputs.weight * 0.453592 : inputs.weight;
  
  // Base calculation factors
  const baseMgPerHour = 50;
  const toleranceModifiers = { Low: 0.8, Moderate: 1.0, High: 1.2 };
  const weightFactor = 0.5; // mg/kg/hour
  
  // Calculate base amount
  const toleranceModifier = toleranceModifiers[inputs.tolerance];
  const baseCaffeine = baseMgPerHour * inputs.hoursToSurvive * toleranceModifier;
  
  // Calculate weight-based amount
  const weightCaffeine = weightInKg * weightFactor * inputs.hoursToSurvive;
  
  // Additional calculation for sleep deprivation factor
  const sleepDeprivationFactor = Math.min(inputs.hoursAwake / 24, 1) * 0.2;
  const sleepDeprivationBoost = baseCaffeine * sleepDeprivationFactor;
  
  // Total
  const totalMg = Math.round(baseCaffeine + weightCaffeine + sleepDeprivationBoost);
  
  // Define caffeine sources
  const caffeineSources: CaffeineSource[] = [
    { name: "Coffee", servingSize: "8 oz brewed", caffeinePerServing: 95, servingsNeeded: 0 },
    { name: "Espresso", servingSize: "1 oz shot", caffeinePerServing: 63, servingsNeeded: 0 },
    { name: "Energy Drink", servingSize: "16 oz (Monster)", caffeinePerServing: 160, servingsNeeded: 0 },
    { name: "Cola", servingSize: "12 oz", caffeinePerServing: 34, servingsNeeded: 0 },
    { name: "Black Tea", servingSize: "8 oz", caffeinePerServing: 47, servingsNeeded: 0 }
  ];
  
  // Calculate servings needed for each source
  caffeineSources.forEach(source => {
    source.servingsNeeded = Math.ceil(totalMg / source.caffeinePerServing);
  });
  
  // Determine safety warning
  let safetyWarning: string | undefined;
  if (totalMg > 1000) {
    safetyWarning = "This is potentially dangerous. Consult a healthcare professional.";
  } else if (totalMg > 400) {
    safetyWarning = "This exceeds the FDA's recommended daily limit of 400 mg for most adults. Proceed with caution.";
  }
  
  return {
    totalMg,
    breakdown: `Base: ${Math.round(baseCaffeine)} mg + Weight: ${Math.round(weightCaffeine)} mg + Sleep Deprivation: ${Math.round(sleepDeprivationBoost)} mg`,
    sources: caffeineSources,
    safetyWarning
  };
}

// Function to save calculation history to local storage
export function saveCalculationToHistory(inputs: CaffeineInputs, result: CaffeineResult) {
  const history = getCalculationHistory();
  
  const newEntry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    inputs,
    result: {
      totalMg: result.totalMg,
      breakdown: result.breakdown,
      safetyWarning: result.safetyWarning
    }
  };
  
  history.unshift(newEntry);
  
  // Keep only the most recent 10 entries
  const trimmedHistory = history.slice(0, 10);
  
  localStorage.setItem('caffeineCalculationHistory', JSON.stringify(trimmedHistory));
}

// Function to get calculation history from local storage
export function getCalculationHistory() {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedHistory = localStorage.getItem('caffeineCalculationHistory');
  return storedHistory ? JSON.parse(storedHistory) : [];
}
