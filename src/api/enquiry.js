import { api } from "../../config/axios";

export const getEnquiry = async (form) => {
  try {
    let res = await api.post("api/enquiry", form);
    return res;
  } catch (err) {
    return err.response;
  }
};
