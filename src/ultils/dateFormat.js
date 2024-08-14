export const formatDate = (dob) => {
  const date = new Date(dob);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate;
};
