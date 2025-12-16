// VALIDATION LOGIC
export const validateVitals = (bp, temp, weight) => {
    const errors = [];

    // 1. Blood Pressure Check (Format: 120/80)
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(bp)) {
        errors.push("BP must be format '120/80'");
    } else {
        const [sys, dia] = bp.split('/').map(Number);
        if (sys < 70 || sys > 250) errors.push("Systolic BP (top number) is invalid (70-250 range).");
        if (dia < 40 || dia > 150) errors.push("Diastolic BP (bottom number) is invalid (40-150 range).");
    }

    // 2. Temperature Check (35°C - 42°C is survival range)
    const tempNum = parseFloat(temp);
    if (isNaN(tempNum) || tempNum < 30 || tempNum > 45) {
        errors.push("Temperature is impossible (must be 30°C - 45°C).");
    }

    // 3. Weight Check (30kg - 200kg)
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 200) {
        errors.push("Weight is invalid (must be 30kg - 200kg).");
    }

    return errors;
};

// DYNAMIC WEEKS CALCULATOR
export const calculateWeeks = (startWeeks, dateCreated) => {
    if (!startWeeks || !dateCreated) return "N/A";
    const start = new Date(dateCreated);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)); 
    return parseInt(startWeeks) + diffWeeks;
};