// Z tablosu değerlerini hesaplayan fonksiyon
export function calculateZScore(probability: number): number {
    // Probability'yi 0-1 aralığına normalize et
    const p = probability / 100;
    
    // Standart normal dağılım için yaklaşık z-skoru hesaplama
    // Bu formül, Abramowitz ve Stegun yaklaşımını kullanır
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p_prime = p - 0.5;
    
    // Mutlak değer ve işaret hesaplama
    const sign = p_prime < 0 ? -1 : 1;
    const x = Math.abs(p_prime);
    
    // Hesaplama formülü
    if(x <= 0.5) {
        const t = Math.sqrt(-2 * Math.log(x));
        return sign * (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t);
    }
    
    return 0; // Hata durumu
}