// Predefined periodicity options
export const PERIODICITY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'once', label: 'Once' },
  { value: 'custom', label: 'Custom' },
];

// Calculate monthly amount based on periodicity
export function calculateMonthlyAmount(amount, periodicity, customDays = 30) {
  switch (periodicity) {
    case 'daily':
      return amount * 30; // Monthly approximation
    case 'weekly':
      return amount * 4.33; // Average weeks per month
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    case 'once':
      return 0; // Not counted in monthly calculation
    case 'custom':
      // If custom, assume amount is already in desired period
      // and convert to monthly based on days
      return (amount / customDays) * 30;
    default:
      return amount;
  }
}

// Calculate yearly amount based on periodicity
export function calculateYearlyAmount(amount, periodicity, customDays = 30) {
  switch (periodicity) {
    case 'daily':
      return amount * 365;
    case 'weekly':
      return amount * 52;
    case 'monthly':
      return amount * 12;
    case 'yearly':
      return amount;
    case 'once':
      return amount; // Counted once per year
    case 'custom':
      return (amount / customDays) * 365;
    default:
      return amount;
  }
}

