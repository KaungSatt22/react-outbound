import { api } from "../../config/axios";

export const getAgentBynameandLicNum = async (payload) => {
  try {
    let res = api.post("/api/agent", payload);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getAssociationByLicenseNumandPassword = async (payload) => {
  try {
    let res = api.post("/api/association", payload);
    return res;
  } catch (err) {
    return err.message;
  }
};
