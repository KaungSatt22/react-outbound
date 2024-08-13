import * as yup from "yup";

export const validationSchema = yup.object({
  passportNumber: yup.string().required("This Field is required"),
  passportIssuedDate: yup.date().required("This Field is required"),
  passportIssuedCountry: yup.string().required("This Field is required"),
  insuredPersonName: yup.string().required("This Field is required"),
  insuredPersonDOB: yup.string().required("This Field is required"),
  insuredPersonGender: yup.string().required("This Field is required"),
  estimatedDepartureDate: yup.string().required("This Field is required"),
  journeyTo: yup.string().required("This Field is required"),
  policyStartDate: yup.string().required("This Field is required"),
  coveragePlan: yup.string().required("This Field is required"),
  insuredPersonContactPhoneNo: yup.string().required("This Field is required"),
  insuredPersonEmailAddress: yup.string().email("Invalid email address"),
  addressAbroad: yup.string().required("This Field is required"),
  countryForDestination: yup.string().required("This Field is required"),
  beneficiaryName: yup.string().required("This Field is required"),
  beneficiaryDOB: yup.string().required("This Field is required"),
  beneficiaryContactPhoneNo: yup.string().required("This Field is required"),
  beneficiaryRelationship: yup.string().required("This Field is required"),
  packages: yup.string().required("This Field is required"),
});
