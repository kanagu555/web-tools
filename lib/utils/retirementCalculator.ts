import {
  RetirementInputs,
  RetirementResults,
  YearlyBreakdown,
  RetirementScenario,
  TaxConsiderations,
} from '@/lib/types/retirement';

/**
 * Calculate compound growth with monthly contributions
 */
export function calculateFutureValue(
  currentAmount: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
  contributionGrowthRate: number = 0
): number {
  let balance = currentAmount;
  
  for (let year = 0; year < years; year++) {
    const yearlyContribution = monthlyContribution * 12 * Math.pow(1 + contributionGrowthRate, year);
    
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + annualRate / 12) + (yearlyContribution / 12);
    }
  }
  
  return balance;
}

/**
 * Calculate required corpus for desired monthly income considering inflation
 */
export function calculateRequiredCorpus(
  monthlyIncome: number,
  yearsInRetirement: number,
  annualReturnRate: number,
  inflationRate: number
): number {
  const realReturnRate = (annualReturnRate - inflationRate) / (1 + inflationRate);
  const monthlyRealRate = realReturnRate / 12;
  
  if (monthlyRealRate <= 0) {
    // If real return is negative, use simple calculation
    return monthlyIncome * 12 * yearsInRetirement;
  }
  
  const monthsInRetirement = yearsInRetirement * 12;
  
  // Present value of annuity formula for inflation-adjusted income
  const requiredCorpus = monthlyIncome * 
    ((1 - Math.pow(1 + monthlyRealRate, -monthsInRetirement)) / monthlyRealRate);
  
  return requiredCorpus;
}

/**
 * Calculate employer match contribution
 */
export function calculateEmployerMatch(
  salary: number,
  contributionRate: number,
  employerMatchRate: number,
  maxMatchRate: number = 0.06 // 6% typical maximum
): number {
  const employeeContributionRate = Math.min(contributionRate, 1);
  const matchedRate = Math.min(employeeContributionRate, maxMatchRate);
  return salary * matchedRate * employerMatchRate;
}

/**
 * Generate yearly breakdown of retirement savings
 */
export function generateYearlyBreakdown(inputs: RetirementInputs): YearlyBreakdown[] {
  const breakdown: YearlyBreakdown[] = [];
  const years = inputs.retirementAge - inputs.currentAge;
  let balance = inputs.currentSavings;
  
  for (let year = 0; year < years; year++) {
    const currentYear = new Date().getFullYear() + year;
    const age = inputs.currentAge + year;
    
    const beginningBalance = balance;
    
    // Calculate contributions with growth
    const contributionGrowthRate = inputs.contributionIncreaseRate || 0;
    const yearlyContribution = inputs.monthlyContribution * 12 * 
      Math.pow(1 + contributionGrowthRate, year);
    
    // Calculate employer match
    const employerMatch = inputs.employerMatch && inputs.salary ? 
      calculateEmployerMatch(
        inputs.salary * Math.pow(1.03, year), // 3% salary growth
        (yearlyContribution / (inputs.salary * Math.pow(1.03, year))),
        inputs.employerMatch / 100
      ) : 0;
    
    // Calculate investment return
    const investmentReturn = balance * inputs.annualReturnRate / 100;
    
    // Update balance
    balance = balance + yearlyContribution + employerMatch + investmentReturn;
    
    // Calculate inflation-adjusted value
    const inflationAdjustedValue = balance / Math.pow(1 + inputs.inflationRate / 100, year + 1);
    
    breakdown.push({
      year: currentYear,
      age,
      beginningBalance,
      contribution: yearlyContribution,
      employerMatch,
      investmentReturn,
      endingBalance: balance,
      inflationAdjustedValue,
    });
  }
  
  return breakdown;
}

/**
 * Main retirement calculation function
 */
export function calculateRetirement(inputs: RetirementInputs): RetirementResults {
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const yearsInRetirement = inputs.lifeExpectancy - inputs.retirementAge;
  
  if (yearsToRetirement <= 0) {
    throw new Error('Retirement age must be greater than current age');
  }
  
  if (yearsInRetirement <= 0) {
    throw new Error('Life expectancy must be greater than retirement age');
  }
  
  // Calculate total savings at retirement
  const contributionGrowthRate = inputs.contributionIncreaseRate || 0;
  const totalSavingsAtRetirement = calculateFutureValue(
    inputs.currentSavings,
    inputs.monthlyContribution,
    inputs.annualReturnRate / 100,
    yearsToRetirement,
    contributionGrowthRate / 100
  );
  
  // Calculate total contributions
  let monthlyContributionsTotal = 0;
  let employerContributionsTotal = 0;
  
  for (let year = 0; year < yearsToRetirement; year++) {
    const yearlyContribution = inputs.monthlyContribution * 12 * 
      Math.pow(1 + contributionGrowthRate / 100, year);
    monthlyContributionsTotal += yearlyContribution;
    
    if (inputs.employerMatch && inputs.salary) {
      const annualEmployerMatch = calculateEmployerMatch(
        inputs.salary * Math.pow(1.03, year),
        (yearlyContribution / (inputs.salary * Math.pow(1.03, year))),
        inputs.employerMatch / 100
      );
      employerContributionsTotal += annualEmployerMatch;
    }
  }
  
  // Calculate investment growth
  const investmentGrowth = totalSavingsAtRetirement - inputs.currentSavings - 
    monthlyContributionsTotal - employerContributionsTotal;
  
  // Calculate required corpus based on inflation-adjusted expenses
  const inflationAdjustedExpenses = inputs.monthlyExpenses * 
    Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement);
  
  // Add 20% buffer to expenses for retirement comfort and healthcare
  const requiredMonthlyIncome = inflationAdjustedExpenses * 1.2;
  
  const requiredCorpusForIncome = calculateRequiredCorpus(
    requiredMonthlyIncome,
    yearsInRetirement,
    inputs.annualReturnRate / 100,
    inputs.inflationRate / 100
  );
  
  // Calculate shortfall or surplus
  const shortfallOrSurplus = totalSavingsAtRetirement - requiredCorpusForIncome;
  
  // Calculate inflation-adjusted income (based on required income)
  const inflationAdjustedIncome = requiredMonthlyIncome;
  
  // Calculate inflation-adjusted expenses
  const inflationAdjustedExpensesResult = inflationAdjustedExpenses;
  
  // Calculate savings rate
  const totalMonthlyFlow = inputs.monthlyExpenses + inputs.monthlyContribution;
  const savingsRate = totalMonthlyFlow > 0 ? (inputs.monthlyContribution / totalMonthlyFlow) * 100 : 0;
  
  // Calculate withdrawal rate
  const withdrawalRate = (requiredMonthlyIncome * 12) / totalSavingsAtRetirement * 100;
  
  // Determine if goal is achievable
  const isGoalAchievable = shortfallOrSurplus >= 0 && withdrawalRate <= 4; // 4% rule
  
  // Generate recommendations
  const recommendations = generateRecommendations({
    isGoalAchievable,
    shortfallOrSurplus,
    withdrawalRate,
    yearsToRetirement,
    currentSavings: inputs.currentSavings,
    monthlyContribution: inputs.monthlyContribution,
    monthlyExpenses: inputs.monthlyExpenses,
    requiredMonthlyIncome,
    annualReturnRate: inputs.annualReturnRate,
    inflationRate: inputs.inflationRate,
  });
  
  return {
    yearsToRetirement,
    totalSavingsAtRetirement,
    monthlyContributionsTotal,
    employerContributionsTotal,
    investmentGrowth,
    requiredCorpusForIncome,
    shortfallOrSurplus,
    inflationAdjustedIncome,
    inflationAdjustedExpenses: inflationAdjustedExpensesResult,
    withdrawalRate,
    savingsRate,
    isGoalAchievable,
    recommendations,
  };
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(data: {
  isGoalAchievable: boolean;
  shortfallOrSurplus: number;
  withdrawalRate: number;
  yearsToRetirement: number;
  currentSavings: number;
  monthlyContribution: number;
  monthlyExpenses: number;
  requiredMonthlyIncome: number;
  annualReturnRate: number;
  inflationRate: number;
}): string[] {
  const recommendations: string[] = [];
  
  // Provide information about the required income calculation
  recommendations.push(
    `Based on your current monthly expenses of ₹${data.monthlyExpenses.toLocaleString('en-IN')}, you'll need ₹${Math.round(data.requiredMonthlyIncome).toLocaleString('en-IN')} per month in retirement (includes 20% buffer for healthcare and lifestyle).`
  );
  
  if (!data.isGoalAchievable) {
    if (data.shortfallOrSurplus < 0) {
      const additionalNeeded = Math.abs(data.shortfallOrSurplus);
      const additionalMonthlyContribution = additionalNeeded / (data.yearsToRetirement * 12);
      
      recommendations.push(
        `You have a shortfall of ₹${additionalNeeded.toLocaleString('en-IN')}. Consider increasing monthly contributions by ₹${Math.round(additionalMonthlyContribution).toLocaleString('en-IN')}.`
      );
    }
    
    if (data.withdrawalRate > 4) {
      recommendations.push(
        `Your withdrawal rate of ${data.withdrawalRate.toFixed(1)}% is above the safe 4% rule. Consider reducing desired income or increasing savings.`
      );
    }
  }
  
  if (data.withdrawalRate < 3) {
    recommendations.push(
      'Your withdrawal rate is conservative. You may be able to retire earlier or increase your retirement lifestyle.'
    );
  }
  
  if (data.yearsToRetirement > 30) {
    recommendations.push(
      'With significant time until retirement, consider aggressive growth investments to maximize returns.'
    );
  } else if (data.yearsToRetirement < 10) {
    recommendations.push(
      'Approaching retirement, consider shifting to more conservative investments to preserve capital.'
    );
  }
  
  if (data.currentSavings < data.monthlyExpenses * 6) {
    recommendations.push(
      'Build an emergency fund of 3-6 months expenses before increasing retirement contributions.'
    );
  }
  
  if (data.annualReturnRate > 12) {
    recommendations.push(
      'Your expected return rate seems optimistic. Consider using more conservative estimates (8-10%).'
    );
  }
  
  // Savings rate analysis
  const savingsRate = (data.monthlyContribution / (data.monthlyExpenses + data.monthlyContribution)) * 100;
  if (savingsRate < 10) {
    recommendations.push(
      'Consider increasing your savings rate to at least 10-15% of your income for better retirement security.'
    );
  } else if (savingsRate >= 20) {
    recommendations.push(
      'Excellent savings rate! You\'re on track for a comfortable retirement.'
    );
  }
  
  return recommendations;
}

/**
 * Calculate safe withdrawal rate based on portfolio balance
 */
export function calculateSafeWithdrawalRate(
  portfolioValue: number,
  desiredAnnualIncome: number
): number {
  if (portfolioValue <= 0) return 0;
  
  const maxSafeWithdrawal = portfolioValue * 0.04; // 4% rule
  const requestedWithdrawal = desiredAnnualIncome;
  
  return Math.min(
    (requestedWithdrawal / portfolioValue) * 100,
    (maxSafeWithdrawal / portfolioValue) * 100
  );
}

/**
 * Compare multiple retirement scenarios
 */
export function compareScenarios(scenarios: RetirementInputs[]): RetirementScenario[] {
  return scenarios.map((inputs, index) => ({
    name: `Scenario ${index + 1}`,
    inputs,
    results: calculateRetirement(inputs),
    yearlyBreakdown: generateYearlyBreakdown(inputs),
  }));
}

/**
 * Calculate tax-optimized withdrawal strategy
 */
export function calculateTaxOptimizedWithdrawal(
  taxConsiderations: TaxConsiderations,
  totalAnnualNeed: number
): {
  taxableWithdrawal: number;
  taxDeferredWithdrawal: number;
  taxFreeWithdrawal: number;
  estimatedTaxes: number;
} {
  const { retirementTaxRate, taxDeferredAccounts, taxFreeAccounts, taxableAccounts } = taxConsiderations;
  
  // Optimize withdrawal order: taxable first, then tax-deferred, then tax-free
  let remainingNeed = totalAnnualNeed;
  let taxableWithdrawal = 0;
  let taxDeferredWithdrawal = 0;
  let taxFreeWithdrawal = 0;
  
  // 1. Withdraw from taxable accounts first (long-term capital gains rates)
  if (remainingNeed > 0 && taxableAccounts > 0) {
    taxableWithdrawal = Math.min(remainingNeed, taxableAccounts * 0.04);
    remainingNeed -= taxableWithdrawal;
  }
  
  // 2. Withdraw from tax-deferred accounts (ordinary income rates)
  if (remainingNeed > 0 && taxDeferredAccounts > 0) {
    taxDeferredWithdrawal = Math.min(remainingNeed, taxDeferredAccounts * 0.04);
    remainingNeed -= taxDeferredWithdrawal;
  }
  
  // 3. Withdraw from tax-free accounts last
  if (remainingNeed > 0 && taxFreeAccounts > 0) {
    taxFreeWithdrawal = Math.min(remainingNeed, taxFreeAccounts * 0.04);
    remainingNeed -= taxFreeWithdrawal;
  }
  
  // Calculate estimated taxes
  const capitalGainsTax = taxableWithdrawal * 0.15; // Assuming 15% long-term capital gains
  const ordinaryIncomeTax = taxDeferredWithdrawal * (retirementTaxRate / 100);
  const estimatedTaxes = capitalGainsTax + ordinaryIncomeTax;
  
  return {
    taxableWithdrawal,
    taxDeferredWithdrawal,
    taxFreeWithdrawal,
    estimatedTaxes,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}