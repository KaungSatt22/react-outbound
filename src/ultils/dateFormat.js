export const formatDate = (dob) => {
  const date = new Date(dob);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate;
};

export const generateCertificate = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const timestamp = Date.now();
  const result = `TTP/${year}${month}/${timestamp}`;
  return result;
};
