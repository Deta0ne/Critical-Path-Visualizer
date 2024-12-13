

function erfInv(x: number): number {
    const a = 0.147; 
    const ln = Math.log(1 - x * x);
    const part1 = (2 / (Math.PI * a)) + ln / 2;
    const part2 = ln / a;
    return Math.sign(x) * Math.sqrt(Math.sqrt(part1 * part1 - part2) - part1);
}

function standardNormalICDF(p: number): number {
    if (p <= 0 || p >= 1) {
        throw new Error("Probability must be between 0 and 1 (exclusive)");
    }
    return Math.sqrt(2) * erfInv(2 * p - 1);
}

export function calculateZScore(probability: number): number {
    const p = probability / 100;

    if (p <= 0 || p >= 1) {
        throw new Error("Probability must be between 0 and 100 (exclusive)");
    }

    return standardNormalICDF(p);
}

const probability = 80; // Yüzde olarak olasılık
const zScore = calculateZScore(probability);
console.log(`Z-Score for ${probability}% probability:`, zScore);
