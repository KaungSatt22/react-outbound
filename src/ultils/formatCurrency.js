export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US").format(amount);
};
