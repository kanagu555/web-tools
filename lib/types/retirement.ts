export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  monthlyExpenses: number; // Current monthly expenses
  annualReturnRate: number;
  inflationRate: number;
  lifeExpectancy: number;
  employerMatch?: number; // Percentage of salary matched by employer
  salary?: number; // Annual salary for employer match calculation
  contributionIncreaseRate?: number; // Annual increase in contributions
}

export interface RetirementResults {
  yearsToRetirement: number;
  totalSavingsAtRetirement: number;
  monthlyContributionsTotal: number;
  employerContributionsTotal: number;
  investmentGrowth: number;
  requiredCorpusForIncome: number;
  shortfallOrSurplus: number;
  inflationAdjustedIncome: number;
  inflationAdjustedExpenses: number;
  withdrawalRate: number;
  savingsRate: number;
  isGoalAchievable: boolean;
  recommendations: string[];
}

export interface YearlyBreakdown {
  year: number;
  age: number;
  beginningBalance: number;
  contribution: number;
  employerMatch: number;
  investmentReturn: number;
  endingBalance: number;
  inflationAdjustedValue: number;
}

export interface RetirementScenario {
  name: string;
  inputs: RetirementInputs;
  results: RetirementResults;
  yearlyBreakdown: YearlyBreakdown[];
}

export interface WithdrawalStrategy {
  strategy: 'percentage' | 'fixed' | 'dynamic';
  rate: number;
  adjustForInflation: boolean;
}

export interface RetirementGoal {
  targetAmount: number;
  targetDate: Date;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export interface TaxConsiderations {
  currentTaxRate: number;
  retirementTaxRate: number;
  taxDeferredAccounts: number; // 401k, traditional IRA
  taxFreeAccounts: number; // Roth IRA, Roth 401k
  taxableAccounts: number; // Regular investment accounts
}

export interface SocialSecurityEstimate {
  monthlyBenefit: number;
  startAge: number;
  inflationAdjusted: boolean;
}

export interface HealthcareCosts {
  monthlyPremium: number;
  annualInflationRate: number;
  longTermCareReserve: number;
}

export interface RetirementPlan {
  basicInputs: RetirementInputs;
  taxConsiderations?: TaxConsiderations;
  socialSecurity?: SocialSecurityEstimate;
  healthcareCosts?: HealthcareCosts;
  withdrawalStrategy: WithdrawalStrategy;
  goals: RetirementGoal[];
}