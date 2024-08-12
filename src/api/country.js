import { api } from "../../config/axios";

export const getAllCountry = async () => {
  try {
    let res = await api.get("api/country");
    return res;
  } catch (err) {
    return err.response;
  }
};
