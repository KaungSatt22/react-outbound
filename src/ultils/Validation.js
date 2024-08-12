import * as yup from "yup";

export const validationSchema = yup.object({
  insuredPersonPassportNumber: yup.string().required("This Field is required"),
  insuredPersonPassportissuedCountry: yup
    .string()
    .required("This Field is required"),
  insuredPersonPassportissuedDate: yup
    .string()
    .required("This Field is required"),
  insuredPersonName: yup.string().required("This Field is required"),
  insuredPersonDateOfBirth: yup.string().required("This Field is required"),
  insuredPersonGender: yup.string().required("This Field is required"),
  insuredPersonJourneyFrom: yup.string().required("This Field is required"),
  insuredPersonContactPhoneNo: yup.string().required("This Field is required"),
  insuredPersonForeignContactNo: yup.string(),
  insuredPersonFatherName: yup.string(),
  insuredPersonRace: yup.string(),
  insuredPersonOccupation: yup.string(),
  insuredPersonMaritalStatus: yup.string().default("single"),
  insuredPersonEmailAddress: yup.string(),
  insuredPersonAddressinMyanmar: yup.string(),
  insuredPersonAddressAbroad: yup.string().required("This Field is required"),
  insuredPersonNRC: yup.string(),
  journeyToId: yup.string().required("This Field is required"),
  destinationCountryId: yup.string().required("This Field is required"),
  beneficiaryName: yup.string().required("This Field is required"),
  beneficiaryDOB: yup.string().required("This Field is required"),
  beneficiaryPhoneNo: yup.string(),
  beneficiaryInfomationRelationship: yup
    .string()
    .required("This Field is required"),
  beneficiaryInfomationNRC: yup.string().required("This Field is required"),
  beneficiaryInfomationEmail: yup.string(),
  beneficiaryInfomationAddress: yup.string().required("This Field is required"),
  childName: yup.string(),
  childDOB: yup.string(),
  childGender: yup.string(),
  childInformationGuardianceName: yup.string(),
  childRelationship: yup.string(),
  proposalCoveragePlan: yup.string().required("This Field is required"),
  proposalRates: yup.string(),
  proposalEstimatedDepartureDate: yup
    .string()
    .required("This Field is required"),
  proposalPolicyStartDate: yup.string().required("This Field is required"),
  proposalAge: yup.string(),
  proposalPackages: yup.string().required("This Field is required"),
  paymentMethod: yup.string(),
  agentId: yup.string(),
  buy: yup.string().default("mmk" || "usd"),
});
