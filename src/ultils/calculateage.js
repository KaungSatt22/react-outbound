export const calculateage = (dob) => {
  const birthYear = new Date(dob).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear === 0 ? 1 : currentYear - birthYear;
};
