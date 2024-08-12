import { api } from "../../config/axios";

export const postInsuranced = async (form) => {
  try {
    let res = await api.post("api/insured-person", form);
    return res;
  } catch (err) {
    return err.response;
  }
};
