import { api } from "../../config/axios";

export const getPermiumRateByAgeandPackageAndDay = async (payload) => {
  try {
    const params = new URLSearchParams();
    payload.forEach((value, key) => {
      params.append(key, value);
    });
    const res = await api.get(`/api/premium?${params.toString()}`);
    return res;
  } catch (error) {
    return error.response;
  }
};
