export const formatCurrency = (amount: number): string => {
  return `₹${Math.abs(amount).toFixed(2)}`;
};