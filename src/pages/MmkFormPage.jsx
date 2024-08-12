import React, { useEffect, useRef, useState } from "react";
import Self from "../assets/self1.svg";
import Agent from "../assets/agent1.svg";
import Association from "../assets/agent_assoc.png";
import { IoCloseOutline } from "react-icons/io5";
import AYA from "../assets/aya_pay_icon.jpg";
import KBZ from "../assets/kbz_pay_icon.png";
import MPU from "../assets/mpu_icon.png";
import CB from "../assets/cb_pay_icon.png";
import OKDollar from "../assets/ok_dollar_icon.png";
import Modal from "../components/Modal";
import { GiConfirmed } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { getAllCountry } from "../api/country";
import {
  getAgentBynameandLicNum,
  getAssociationByLicenseNumandPassword,
} from "../api/agent";
import { getPermiumRateByAgeandPackageAndDay } from "../api/premiumrate";
import { useDispatch, useSelector } from "react-redux";
import {
  addInsuredPerson,
  insuredPersonState,
} from "../features/insuranceperson/personSlice";
import { formatCurrency } from "../ultils/formatCurrency";
import { useFormik } from "formik";
import { validationSchema } from "../ultils/Validation";
import { phContact } from "../ultils/phoneContact";

const UsdFormPage = () => {
  const [isModalAgentOpen, setIsModalAgentOpen] = useState(false);
  const [isModalAssociationOpen, setIsModalAssociationOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [agent, setAgent] = useState();
  const [agentInputBox, setAgentInputBox] = useState(false);
  const [associationInputBox, setAssociationInputBox] = useState(false);
  const [association, setAssociation] = useState();
  const [premiumRate, setPremiumRate] = useState();
  const [phone, setPhone] = useState({
    insuredContactPhoneCode: "+93",
    foreignContactPhoneCode: "+93",
    beneficiaryPhoneCode: "+93",
  });
  const { insuredPerson } = useSelector(insuredPersonState);
  const formik = useFormik({
    initialValues: {
      insuredPersonPassportNumber:
        insuredPerson?.insuredPersonPassportNumber || "",
      insuredPersonPassportissuedCountry:
        insuredPerson?.insuredPersonPassportissuedCountry || "",
      insuredPersonPassportissuedDate:
        insuredPerson?.insuredPersonPassportissuedDate || "",
      insuredContactPhoneCode: insuredPerson?.insuredContactPhoneCode || "+93",
      insuredPersonName: insuredPerson?.insuredPersonName || "",
      insuredPersonDateOfBirth: insuredPerson?.insuredPersonDateOfBirth || "",
      insuredPersonGender: insuredPerson?.insuredPersonGender || "",
      insuredPersonforChild: insuredPerson?.insuredPersonforChild
        ? "child"
        : "self" || "self",
      insuredPersonJourneyFrom:
        insuredPerson?.insuredPersonJourneyFrom || "Myanmar",
      insuredPersonContactPhoneNo:
        insuredPerson?.insuredPersonContactPhoneNo || "",
      insuredPersonForeignContactNo:
        insuredPerson?.insuredPersonForeignContactNo || "",
      insuredPersonFatherName: insuredPerson?.insuredPersonFatherName || "",
      insuredPersonRace: insuredPerson?.insuredPersonRace || "",
      insuredPersonOccupation: insuredPerson?.insuredPersonOccupation || "",
      insuredPersonMaritalStatus:
        insuredPerson?.insuredPersonMaritalStatus || "single",
      insuredPersonEmailAddress: insuredPerson?.insuredPersonEmailAddress || "",
      insuredPersonAddressinMyanmar:
        insuredPerson?.insuredPersonAddressinMyanmar || "",
      insuredPersonAddressAbroad:
        insuredPerson?.insuredPersonAddressAbroad || "",
      insuredPersonNRC: insuredPerson?.insuredPersonNRC || "",
      journeyToId: insuredPerson?.journeyToId || "",
      foreignContactPhoneCode: insuredPerson?.foreignContactPhoneCode || "+93",
      destinationCountryId: insuredPerson?.destinationCountryId || "",
      beneficiaryName: insuredPerson?.beneficiaryName || "",
      beneficiaryDOB: insuredPerson?.beneficiaryDOB || "",
      beneficiaryPhoneNo: insuredPerson?.beneficiaryPhoneNo || "",
      beneficiaryPhoneCode: insuredPerson?.beneficiaryPhoneCode || "+93",
      beneficiaryInfomationRelationship:
        insuredPerson?.beneficiaryInfomationRelationship || "",
      beneficiaryInfomationNRC: insuredPerson?.beneficiaryInfomationNRC || "",
      beneficiaryInfomationEmail:
        insuredPerson?.beneficiaryInfomationEmail || "",
      beneficiaryInfomationAddress:
        insuredPerson?.beneficiaryInfomationAddress || "",
      childName: insuredPerson?.childName || "",
      childDOB: insuredPerson?.childDOB || "",
      childGender: insuredPerson?.childGender || "",
      childInformationGuardianceName:
        insuredPerson?.childInformationGuardianceName || "",
      childRelationship: insuredPerson?.childRelationship || "",
      proposalCoveragePlan: insuredPerson?.proposalCoveragePlan || "",
      proposalRates: insuredPerson?.proposalRates || "",
      proposalEstimatedDepartureDate:
        insuredPerson?.proposalEstimatedDepartureDate || "",
      proposalPolicyStartDate: insuredPerson?.proposalPolicyStartDate || "",
      proposalAge: insuredPerson?.proposalAge || "",
      proposalPackages: insuredPerson?.proposalPackages || "",
      paymentMethod: insuredPerson?.paymentMethod || "mpu",
      agentId: insuredPerson?.agentId || "",
      buy: insuredPerson?.buy || "mmk",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      formik.setFieldValue(
        "insuredPersonforChild",
        formik.values.insuredPersonforChild === "child"
      );
      formik.setFieldValue(
        "insuredPersonContactPhoneNo",
        phContact(
          phone.insuredContactPhoneCode,
          formik.values.insuredPersonContactPhoneNo
        )
      );
      formik.setFieldValue(
        "insuredPersonForeignContactNo",
        phContact(
          phone.foreignContactPhoneCode,
          formik.values.insuredPersonForeignContactNo
        )
      );
      formik.setFieldValue(
        "beneficiaryPhoneNo",
        phContact(phone.beneficiaryPhoneCode, formik.values.beneficiaryPhoneNo)
      );
      setIsModalConfirmOpen(true);
      getPremiumRate();
    },
  });
  const navigate = useNavigate();
  const agentNameRef = useRef();
  const agentLicenseNumRef = useRef();
  const associationLicenseNumRef = useRef();
  const associationPasswordRef = useRef();
  const dispatch = useDispatch();
  const age =
    formik.values.childDOB !== ""
      ? new Date().getFullYear() -
        new Date(formik.values.childDOB).getFullYear()
      : new Date().getFullYear() -
        new Date(formik.values.insuredPersonDateOfBirth).getFullYear();
  const handleRadioChange = (event) => {
    if (event.target.id === "agent") {
      setIsModalAgentOpen(true);
    } else if (event.target.id === "association") {
      setIsModalAssociationOpen(true);
    }
    setAgent("");
    setAssociation("");
    setAgentInputBox(false);
    setAssociationInputBox(false);
    agentNameRef.current.value = "";
    agentLicenseNumRef.current.value = "";
    associationLicenseNumRef.current.value = "";
    associationPasswordRef.current.value = "";
  };

  const handlePayment = (event) => {
    const selectedPaymentMethod =
      event.currentTarget.getAttribute("data-value");
    formik.setFieldValue("paymentMethod", selectedPaymentMethod);
  };

  const getPremiumRate = async () => {
    try {
      const form = new FormData();
      form.append("age", age);
      form.append("packages", formik.values.proposalPackages);
      form.append("days", formik.values.proposalCoveragePlan);
      let res = await getPermiumRateByAgeandPackageAndDay(form);
      setPremiumRate(res.data);
      formik.setFieldValue("proposalAge", age);
      formik.setFieldValue("proposalRates", res.data.rates);
    } catch (error) {
      console.log(error);
    }
  };

  const closeAgentModal = () => {
    if (agent === "error") {
      setAgent("");
    }
    setIsModalAgentOpen(false);
  };

  const closeAssociationModal = () => {
    if (association === "error") {
      setAssociation("");
    }
    setIsModalAssociationOpen(false);
  };

  const closeConfirmModal = () => {
    setIsModalConfirmOpen(false);
  };

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    try {
      let res = await getAllCountry();
      setCountries(
        res.data.sort((a, b) => a.countryName.localeCompare(b.countryName))
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAgent = async () => {
    const form = new FormData();
    form.append("agentName", agentNameRef.current.value);
    form.append("agentLicenseNumber", agentLicenseNumRef.current.value);
    try {
      const res = await getAgentBynameandLicNum(form);
      setAgent(res.data === "" ? "error" : res.data);
      formik.setFieldValue("agentId", res.data?.id);
      if (res.data) {
        closeAgentModal();
        setAgentInputBox(true);
      }
    } catch (error) {
      console.log(err);
    }
  };
  const getAssociation = async () => {
    const form = new FormData();
    form.append("agentLicenseNumber", associationLicenseNumRef.current.value);
    form.append("password", associationPasswordRef.current.value);

    try {
      const res = await getAssociationByLicenseNumandPassword(form);
      setAssociation(res.data === "" ? "error" : res.data);
      formik.setFieldValue("agentId", res.data?.id);
      if (res.data) {
        closeAssociationModal();
        setAssociationInputBox(true);
      }
    } catch (error) {
      console.log(err);
    }
  };

  const goto = () => {
    navigate("/confirm");
    console.log(formik.values);
    dispatch(addInsuredPerson(formik.values));
  };

  return (
    <div className="bg-[#f0f4f9] py-10">
      <form
        className="max-w-[1200px] mx-auto pb-10"
        onSubmit={formik.handleSubmit}
      >
        <h2 className="mx-auto text-center text-2xl font-bold text-[#074DA1] py-5">
          Outbound Travel Accident Insurance (MMK)
        </h2>
        <div className="shadow p-10 bg-white text-[#074DA1]">
          <h3 className="underline text-lg font-bold">
            Passport Information (In English)
          </h3>
          <div className="my-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5">
              <div>
                <label className="font-bold">
                  <p>Passport Number</p>
                  <p>
                    နိုင်ငံကူးလက်မှတ်အမှတ်{" "}
                    <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="ENTER YOUR PASSPORT NO."
                    className="p-2 w-full border rounded mt-2 uppercase"
                    name="insuredPersonPassportNumber"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonPassportNumber}
                  />
                </div>
                {formik.touched.insuredPersonPassportNumber &&
                formik.errors.insuredPersonPassportNumber ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.insuredPersonPassportNumber}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Passport Issued Date</p>
                  <p>
                    နိုင်ငံကူးလက်မှတ်ထုတ်ပေးသည့်နေ့{" "}
                    <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="date"
                    className="p-2 w-full border rounded mt-2 bg-[#e9ecef]"
                    name="insuredPersonPassportissuedDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonPassportissuedDate}
                  />
                </div>
                {formik.touched.insuredPersonPassportissuedDate &&
                formik.errors.insuredPersonPassportissuedDate ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.insuredPersonPassportissuedDate}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Passport Issued Country</p>
                  <p>
                    နိုင်ငံကူးလက်မှတ်ထုတ်ပေးသည့်နိုင်ငံ{" "}
                    <span className="text-red-500">*</span>{" "}
                  </p>
                </label>
                <div>
                  <select
                    className="w-full p-2 mt-2 border rounded uppercase"
                    name="insuredPersonPassportissuedCountry"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonPassportissuedCountry}
                  >
                    <option>SELECT ONE</option>
                    {countries.map((country) => (
                      <option value={country.id} key={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.insuredPersonPassportissuedCountry &&
                formik.errors.insuredPersonPassportissuedCountry ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.insuredPersonPassportissuedCountry}
                  </div>
                ) : null}
              </div>
              {(formik.values.insuredPersonPassportissuedCountry == 1 ||
                formik.values.insuredPersonPassportissuedCountry == 124) && (
                <div>
                  <label className="font-bold">
                    <p>National Identification Number</p>
                    <p>
                      နိုင်ငံသားစိစစ်ရေးကတ်ပြားအမှတ်{" "}
                      <span className="text-red-500">*</span>
                    </p>
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder="ENTER YOUR NRC NO."
                      className="p-2 w-full border rounded mt-2 uppercase"
                      name="insuredPersonNRC"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.insuredPersonNRC}
                    />
                  </div>
                  {formik.touched.insuredPersonNRC &&
                  formik.errors.insuredPersonNRC ? (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.insuredPersonNRC}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          <hr />
          <h3 className="underline text-lg font-bold mt-3">
            INSURED Information (In English)
          </h3>
          <div className="flex flex-col lg:flex-row lg:gap-5">
            <div className="space-x-2 flex items-center">
              <input
                type="radio"
                name="insuredPersonforChild"
                id="urself"
                value={"self"}
                defaultChecked
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="urself">
                <p>Buy for yourself (This passport holder)</p>
              </label>
            </div>
            <div className="space-x-2 flex my-5">
              <input
                type="radio"
                name="insuredPersonforChild"
                id="child"
                value="child"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label className="font-bold" htmlFor="child">
                <p>
                  Buy for the child travel together with this passport holder
                </p>
                <p>(Child is not holding a valid passport)</p>
              </label>
            </div>
          </div>
          <div className="my-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div>
                <label className="font-bold">
                  <p>Name (as per passport)</p>
                  <p>
                    အမည်(နိုင်ငံကူးလက်မှတ်ပါအမည်){" "}
                    <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="ENTER YOUR PASSPORT NO."
                    className="p-2 w-full border rounded mt-2 uppercase "
                    name="insuredPersonName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonName}
                  />
                </div>
                {formik.touched.insuredPersonName &&
                formik.errors.insuredPersonName ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.insuredPersonName}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Date of Birth (as per passport)</p>
                  <p>
                    မွေးသက္ကရာဇ်(နိုင်ငံကူးလက်မှတ်ပါမွေးသက္ကရာဇ်)
                    <span className="text-red-500">*</span>{" "}
                  </p>
                </label>
                <div>
                  <input
                    type="date"
                    className="p-2 w-full border rounded mt-2 bg-[#e9ecef]"
                    name="insuredPersonDateOfBirth"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonDateOfBirth}
                  />
                </div>
                {formik.touched.insuredPersonDateOfBirth &&
                formik.errors.insuredPersonDateOfBirth ? (
                  <div className="text-red-500">
                    {formik.errors.insuredPersonDateOfBirth}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Gender (as per passport)</p>
                  <p>
                    ကျား/မ(နိုင်ငံကူးလက်မှတ်ပါ)
                    <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <select
                    className="w-full p-2 mt-2 border rounded"
                    name="insuredPersonGender"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonGender}
                  >
                    <option value="">Select One</option>
                    <option value="male">MALE</option>
                    <option value="female">FEMALE</option>
                  </select>
                </div>
                {formik.touched.insuredPersonGender &&
                formik.errors.insuredPersonGender ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.insuredPersonGender}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Estimate Departure Date</p>
                  <p>
                    ထွက်ခွာမည့်နေ့(ခန့်မှန်းခြေ)
                    <span className="text-red-500">*</span>{" "}
                  </p>
                </label>
                <div>
                  <input
                    type="date"
                    className="p-2 w-full border rounded mt-2 bg-[#e9ecef]"
                    name="proposalEstimatedDepartureDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.proposalEstimatedDepartureDate}
                  />
                </div>
                {formik.touched.proposalEstimatedDepartureDate &&
                formik.errors.proposalEstimatedDepartureDate ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.proposalEstimatedDepartureDate}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Journey From</p>
                  <p>
                    ထွက်ခွာမည့်နိုင်ငံ <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="text"
                    value="MYANMAR"
                    placeholder="ENTER YOUR PASSPORT NO."
                    className="p-2 w-full border rounded mt-2 bg-[#e9ecef]"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Journey To</p>
                  <p>
                    ဆိုက်ရောက်မည့်နိုင်ငံ{" "}
                    <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <select
                    className="w-full p-2 mt-2 border rounded uppercase"
                    name="journeyToId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.journeyToId}
                  >
                    <option value="">Select One</option>
                    {countries.map((country) => (
                      <option value={country.id} key={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.journeyToId && formik.errors.journeyToId ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.journeyToId}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Policy Start Date</p>
                  <p>
                    ပေါ်လစီစတင်မည့်နေ့ <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="date"
                    className="p-2 w-full border rounded mt-2 bg-[#e9ecef]"
                    name="proposalPolicyStartDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.proposalPolicyStartDate}
                  />
                </div>
                {formik.touched.proposalPolicyStartDate &&
                formik.errors.proposalPolicyStartDate ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.proposalPolicyStartDate}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Coverage Plan</p>
                  <p>
                    အာမခံသက်တမ်း <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <select
                    className="w-full p-2 mt-2 border rounded"
                    name="proposalCoveragePlan"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.proposalCoveragePlan}
                  >
                    <option value="">Select One</option>
                    <option value="5">5 Days</option>
                    <option value="10">10 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                    <option value="120">120 Days</option>
                    <option value="150">150 Days</option>
                    <option value="180">180 Days</option>
                  </select>
                </div>
                {formik.touched.proposalCoveragePlan &&
                formik.errors.proposalCoveragePlan ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.proposalCoveragePlan}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Packages</p>
                  <p>
                    ပက်ကေ့ချ် <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <select
                    className="w-full p-2 mt-2 border rounded"
                    name="proposalPackages"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.proposalPackages}
                  >
                    <option value="">Select One</option>
                    <option value="30000000">30,000,000 MMK</option>
                    <option value="90000000">90,000,000 MMK</option>
                    <option value="150000000">150,000,000 MMK</option>
                  </select>
                </div>
                {formik.touched.proposalPackages &&
                formik.errors.proposalPackages ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.proposalPackages}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Insured's Contact Phone Number</p>
                  <p>
                    ဆက်သွယ်ရမည့်ဖုန်းနံပါတ်{" "}
                    <span className="text-red-500">*</span>
                  </p>
                </label>
                <div className="flex">
                  <div>
                    <select
                      className="w-20 p-2 mt-2 border rounded"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.insuredContactPhoneCode}
                      name="insuredContactPhoneCode"
                    >
                      {countries.map((country) => (
                        <option value={country.phoneCode} key={country.id}>
                          <span>({country.phoneCode})</span>
                          <span>{country.countryName}</span>
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="p-2 w-full border rounded mt-2 "
                      placeholder="ENTER PHONE NUMBER"
                      name="insuredPersonContactPhoneNo"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.insuredPersonContactPhoneNo}
                    />
                  </div>
                </div>
                {formik.touched.insuredPersonContactPhoneNo &&
                formik.errors.insuredPersonContactPhoneNo ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.insuredPersonContactPhoneNo}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Foreign Contact Number</p>
                  <p>ဆက်သွယ်ရမည့်နိုင်ငံခြားဖုန်းနံပါတ်</p>
                </label>
                <div className="flex">
                  <div>
                    <select
                      className="w-20 p-2 mt-2 border rounded"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.foreignContactPhoneCode}
                      name="foreignContactPhoneCode"
                    >
                      {countries.map((country) => (
                        <option value={country.phoneCode} key={country.id}>
                          <span>({country.phoneCode})</span>
                          <span>{country.countryName}</span>
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="p-2 w-full border rounded mt-2 "
                      placeholder="ENTER PHONE NUMBER"
                      name="insuredPersonForeignContactNo"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.insuredPersonForeignContactNo}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Father's Name</p>
                  <p>ဖခင်အမည် </p>
                </label>
                <div>
                  <input
                    type="type"
                    className="p-2 w-full border rounded mt-2 uppercase "
                    placeholder="ENTER YOUR FATHER NAME"
                    name="insuredPersonFatherName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonFatherName}
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Race</p>
                  <p>လူမျိုး </p>
                </label>
                <div>
                  <input
                    type="type"
                    className="p-2 w-full border rounded mt-2 uppercase"
                    placeholder="ENTER YOUR RACE"
                    name="insuredPersonRace"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonRace}
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Occupation</p>
                  <p>အလုပ်အကိုင် </p>
                </label>
                <div>
                  <input
                    type="type"
                    className="p-2 w-full border rounded mt-2 uppercase"
                    placeholder="ENTER YOUR Occupation"
                    name="insuredPersonOccupation"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonOccupation}
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Marital Status</p>
                  <p>အိမ်ထောင်ရှိ/မရှိ</p>
                </label>
                <div className="flex gap-5 mt-2 font-bold">
                  <div className="space-x-2 ">
                    <input
                      type="radio"
                      id="single"
                      name="insuredPersonMaritalStatus"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value="single"
                      defaultChecked
                    />
                    <label htmlFor="single">SINGLE</label>
                  </div>
                  <div className="space-x-2">
                    <input
                      type="radio"
                      id="married"
                      name="insuredPersonMaritalStatus"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value="married"
                    />
                    <label htmlFor="married">Married</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Insured's Email Address</p>
                  <p>အီးမေးလ်လိပ်စာ </p>
                </label>
                <div>
                  <input
                    type="type"
                    className="p-2 w-full border rounded mt-2 "
                    placeholder="ENTER YOUR EMAIL"
                    name="insuredPersonEmailAddress"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonEmailAddress}
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Address in Myanmar</p>
                  <p>မြန်မာနိုင်ငံရှိနေရပ်လိပ်စာ (Max: 250 Char) </p>
                </label>
                <div>
                  <textarea
                    className="p-2 w-full border rounded mt-2 uppercase"
                    rows="4"
                    placeholder="..."
                    maxLength="250"
                    name="insuredPersonAddressinMyanmar"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonAddressinMyanmar}
                  ></textarea>
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Address Abroad</p>
                  <p>
                    ဆိုက်ရောက်မည့်နိုင်ငံနေရပ်လိပ်စာ (Max: 250 Char)
                    <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <textarea
                    className="p-2 w-full border rounded mt-2 uppercase"
                    rows="4"
                    placeholder="..."
                    maxLength="250"
                    name="insuredPersonAddressAbroad"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonAddressAbroad}
                  ></textarea>
                </div>
                {formik.touched.insuredPersonAddressAbroad &&
                formik.errors.insuredPersonAddressAbroad ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.insuredPersonAddressAbroad}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Destination Country</p>
                  <p>
                    ဆိုက်ရောက်မည့်နိုင်ငံ{" "}
                    <span className="text-red-500">*</span>{" "}
                  </p>
                </label>
                <div>
                  <select
                    className="w-full p-2 mt-2 border rounded uppercase"
                    name="destinationCountryId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.destinationCountryId}
                  >
                    <option value="">Select One</option>
                    {countries.map((country) => (
                      <option value={country.id} key={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.destinationCountryId &&
                formik.errors.destinationCountryId ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.destinationCountryId}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {formik.values.insuredPersonforChild === "child" && (
            <div className="bg-[#ddd] p-3 my-5">
              <h3 className="underline text-lg font-bold">
                Child Information (Child is not holding a valid passport)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5">
                <div>
                  <label className="font-bold">
                    <p>Child Name</p>
                    <p>
                      ကလေးအမည် <span className="text-red-500">*</span>
                    </p>
                  </label>
                  <div>
                    <input
                      type="type"
                      className="p-2 w-full border rounded mt-2 uppercase"
                      placeholder="ENTER YOUR INSURANCE NAME"
                      name="childName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.childName}
                    />
                  </div>
                  {formik.touched.childName && formik.errors.childName ? (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.childName}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className="font-bold">
                    <p>Date of Birth</p>
                    <p>
                      {" "}
                      မွေးသက္ကရာဇ် <span className="text-red-500">*</span>
                    </p>
                  </label>
                  <div>
                    <input
                      type="date"
                      className="p-2 w-full border rounded mt-2 bg-[#e9ecef]"
                      name="childDOB"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.childDOB}
                    />
                  </div>
                  {formik.touched.childDOB && formik.errors.childDOB ? (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.childDOB}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className="font-bold">
                    <p>Gender</p>
                    <p>
                      ကျား/မ <span className="text-red-500">*</span>
                    </p>
                  </label>
                  <div>
                    <select
                      className="w-full p-2 mt-2 border rounded"
                      name="childGender"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.childGender}
                    >
                      <option value="">Select One</option>
                      <option value="male">MALE</option>
                      <option value="female">FEMALE</option>
                    </select>
                  </div>
                  {formik.touched.childGender && formik.errors.childGender ? (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.childGender}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className="font-bold">
                    <p>Guardiance Name</p>
                    <p>
                      အုပ်ထိန်းသူအမည် <span className="text-red-500">*</span>{" "}
                    </p>
                  </label>
                  <div>
                    <input
                      type="type"
                      className="p-2 w-full border rounded mt-2 uppercase"
                      placeholder="ENTER INSURANCE NAME"
                      name="childInformationGuardianceName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.childInformationGuardianceName}
                    />
                  </div>
                  {formik.touched.childInformationGuardianceName &&
                  formik.errors.childInformationGuardianceName ? (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.childInformationGuardianceName}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className="font-bold">
                    <p>Relationship</p>
                    <p>
                      တော်စပ်ပုံ <span className="text-red-500">*</span>
                    </p>
                  </label>
                  <div>
                    <input
                      type="type"
                      className="p-2 w-full border rounded mt-2 uppercase"
                      placeholder="ENTER INSURANCE NAME"
                      name="childRelationship"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.childRelationship}
                    />
                  </div>
                  {formik.touched.childRelationship &&
                  formik.errors.childRelationship ? (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.childRelationship}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          <hr />
          <h3 className="underline text-lg font-bold mt-3">
            Beneficiary Information (In English) အကျိုးခံစားခွင့်ရှိသူနှင့်
            သက်ဆိုင်သော အချက်အလက်
          </h3>
          <div className="my-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5">
              <div>
                <label className="font-bold">
                  <p> Name</p>
                  <p>
                    အမည် <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="type"
                    className="p-2 w-full border rounded mt-2 uppercase"
                    placeholder="ENTER YOUR INSURANCE NAME"
                    name="beneficiaryName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryName}
                  />
                </div>
                {formik.touched.beneficiaryName &&
                formik.errors.beneficiaryName ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.beneficiaryName}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Date of Birth</p>
                  <p>
                    မွေးသက္ကရာဇ် <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="date"
                    className="p-2 w-full border rounded mt-2 bg-[#e9ecef]"
                    name="beneficiaryDOB"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryDOB}
                  />
                </div>
                {formik.touched.beneficiaryDOB &&
                formik.errors.beneficiaryDOB ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.beneficiaryDOB}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Relationship</p>
                  <p>
                    တော်စပ်ပုံ <span className="text-red-500">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="type"
                    className="p-2 w-full border rounded mt-2 uppercase"
                    placeholder="ENTER RELATIONSHIP"
                    name="beneficiaryInfomationRelationship"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryInfomationRelationship}
                  />
                </div>
                {formik.touched.beneficiaryInfomationRelationship &&
                formik.errors.beneficiaryInfomationRelationship ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.beneficiaryInfomationRelationship}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>Contact Phone Number</p>
                  <p>
                    ဆက်သွယ်ရမည့်ဖုန်းနံပါတ်{" "}
                    <span className="text-red-500">*</span>
                  </p>
                </label>
                <div className="flex">
                  <div>
                    <select
                      className="w-20 p-2 mt-2 border rounded"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.beneficiaryPhoneCode}
                      name="beneficiaryPhoneCode"
                    >
                      {countries.map((country) => (
                        <option value={country.phoneCode} key={country.id}>
                          <span>({country.phoneCode})</span>
                          <span>{country.countryName}</span>
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="p-2 w-full border rounded mt-2 "
                      placeholder="ENTER PHONE NUMBER"
                      name="beneficiaryPhoneNo"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.beneficiaryPhoneNo}
                    />
                  </div>
                </div>
                {formik.touched.beneficiaryPhoneNo &&
                formik.errors.beneficiaryPhoneNo ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.beneficiaryPhoneNo}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="font-bold">
                  <p>National Identificaiton Number</p>
                  <p>နိုင်ငံသားစိစစ်ရေးကတ်ပြားအမှတ် </p>
                </label>
                <div>
                  <input
                    type="type"
                    className="p-2 w-full border rounded mt-2 uppercase"
                    placeholder="ENTER NATIONAL IDENTIFICAITON NUMBER"
                    name="beneficiaryInfomationNRC"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryInfomationNRC}
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Email</p>
                  <p>အီးမေးလ်လိပ်စာ </p>
                </label>
                <div>
                  <input
                    type="type"
                    className="p-2 w-full border rounded mt-2 "
                    placeholder="ENTER EMAIL"
                    name="beneficiaryInfomationEmail"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryInfomationEmail}
                  />
                </div>
              </div>
              <div>
                <label className="font-bold">
                  <p>Address</p>
                  <p>နေရပ်လိပ်စာ(Max: 250 Char) </p>
                </label>
                <div>
                  <textarea
                    className="p-2 w-full border rounded mt-2 uppercase"
                    rows="4"
                    placeholder="..."
                    maxLength="250"
                    name="beneficiaryInfomationAddress"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryInfomationAddress}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#eee]">
            <h2 className="underline font-bold p-3">
              This section is only used for servicing agent of Myanma Insurance
            </h2>
            <div className="flex flex-col lg:flex-row gap-3 p-5">
              <div className="flex">
                <input
                  type="radio"
                  name="agent"
                  defaultChecked
                  id="self"
                  onChange={handleRadioChange}
                />
                <label
                  className="flex gap-2 items-center border-2 bg-white p-2"
                  htmlFor="self"
                >
                  <img src={Self} alt="self" className="w-9" />
                  <p className="font-bold">SELF-SERVICE</p>
                </label>
              </div>
              <div className="flex">
                <input
                  type="radio"
                  name="agent"
                  id="agent"
                  onChange={handleRadioChange}
                />
                <label
                  htmlFor="agent"
                  className="flex gap-2 items-center border-2 bg-white p-2"
                >
                  <img src={Agent} alt="self" className="w-9" />
                  <p className="font-bold"> Agent Verification</p>
                </label>
              </div>
              <div className="flex">
                <input
                  type="radio"
                  name="agent"
                  id="association"
                  onChange={handleRadioChange}
                />
                <label
                  htmlFor="association"
                  className="flex gap-2 items-center border-2 bg-white p-2"
                >
                  <img src={Association} alt="self" className="w-9" />
                  <p className="font-bold">
                    Association / Co-operate Verification
                  </p>
                </label>
              </div>
            </div>
            {agentInputBox && (
              <div className="flex gap-5 px-5 py-5">
                <div className="flex-1">
                  <label className="font-bold">
                    Agent Name <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder="Agent Name"
                      ref={agentNameRef}
                      value={agentNameRef.current?.value}
                      className="p-2 w-full mt-2 uppercase"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="font-bold">
                    Agent License Number <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder="Agent License Number"
                      ref={agentLicenseNumRef}
                      value={agentLicenseNumRef.current?.value}
                      className="p-2 w-full mt-2 uppercase"
                    />
                  </div>
                </div>
                <div className="flex-1 mt-10">
                  <button
                    className="underline font-bold "
                    onClick={() => setIsModalAgentOpen(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
            {associationInputBox && (
              <div className="flex gap-5 px-5 py-5">
                <div className="flex-1">
                  <label className="font-bold">
                    Agent Name <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder="Agent License Number"
                      ref={associationLicenseNumRef}
                      value={associationLicenseNumRef.current?.value}
                      className="p-2 w-full mt-2 uppercase"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="font-bold">
                    Agent License Number <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder="Password"
                      ref={associationPasswordRef}
                      value={associationPasswordRef.current?.value}
                      className="p-2 w-full mt-2 uppercase"
                    />
                  </div>
                </div>
                <div className="flex-1 mt-10">
                  <button
                    className="underline font-bold "
                    onClick={() => setIsModalAssociationOpen(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="bg-[#074DA1] border py-2 px-7 mt-5 text-white hover:bg-white rounded hover:text-[#074DA1] hover:border hover:border-[#074DA1] transition-all duration-500">
            Submit And Continue
          </button>
        </div>
      </form>
      {/* Agent */}
      <Modal isOpen={isModalAgentOpen}>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Check Agent Information</h2>
          <IoCloseOutline
            size={24}
            className="cursor-pointer"
            onClick={closeAgentModal}
          />
        </div>
        <hr />
        <div className="mt-3">
          <div>
            <label className="font-bold">
              Agent Name <span className="text-red-500">*</span>
            </label>
            <div>
              <input
                ref={agentNameRef}
                type="text"
                className="w-full p-2 border-[#074DA1] border rounded mt-2 uppercase"
                placeholder="ENTER AGENT NAME"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="font-bold">
              Agent License Number <span className="text-red-500">*</span>
            </label>
            <div>
              <input
                ref={agentLicenseNumRef}
                type="text"
                className="w-full p-2 border-[#074DA1] border rounded mt-2 uppercase"
                placeholder="ENTER AGENT LICENSE NO."
              />
            </div>
          </div>
          {agent === "error" && (
            <p className="text-red-600 mt-5 font-semibold">
              Please check again your "Agent Name" and "Agent License".
            </p>
          )}
        </div>
        <button
          className="bg-[#074DA1] py-2 px-7 mt-5 text-white hover:bg-white rounded hover:text-[#074DA1] hover:border hover:border-[#074DA1] transition-all duration-500"
          onClick={getAgent}
        >
          Check Agent
        </button>
      </Modal>
      {/* Association */}
      <Modal isOpen={isModalAssociationOpen}>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Check Agent Information</h2>
          <IoCloseOutline
            size={24}
            className="cursor-pointer"
            onClick={closeAssociationModal}
          />
        </div>
        <hr />
        <div className="mt-3">
          <div>
            <label className="font-bold">
              Agent License Number <span className="text-red-500">*</span>
            </label>
            <div>
              <input
                type="text"
                className="w-full p-2 border-[#074DA1] border rounded mt-2 uppercase"
                placeholder="ENTER AGENT LICENSE NUMBER"
                ref={associationLicenseNumRef}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="font-bold">
              Password <span className="text-red-500">*</span>
            </label>
            <div>
              <input
                type="text"
                className="w-full p-2 border-[#074DA1] border rounded mt-2 uppercase"
                placeholder="00-0000"
                ref={associationPasswordRef}
              />
            </div>
          </div>
          {association === "error" && (
            <p className="text-red-600 mt-5 font-semibold">
              Please check again your "Agent License Number" and "Password".
            </p>
          )}
        </div>
        <button
          type="button"
          className="bg-[#074DA1] py-2 px-7 mt-5 text-white hover:bg-white rounded hover:text-[#074DA1] hover:border hover:border-[#074DA1] transition-all duration-500"
          onClick={getAssociation}
        >
          Check Agent
        </button>
      </Modal>
      {/* Confirm Modal */}
      <Modal isOpen={isModalConfirmOpen} modal={confirm}>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4 underline">
            Premium Information and Choose Payment Method
          </h2>
          <IoCloseOutline
            size={24}
            className="cursor-pointer"
            onClick={closeConfirmModal}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[rgba(0,0,0,.03)]  border-white ">
            <tbody className="text-black">
              <tr className="align-top border-b border-white">
                <td className="px-4 py-2 text-gray-700">Insured For</td>
                <td className="px-4 py-2 font-bold border-white">
                  {formik.values.insuredPersonforChild === "child"
                    ? "Buy for child"
                    : "Buy for this passport holder"}
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Premium Amount</td>
                <td className=" px-4 py-2 font-bold">
                  {premiumRate?.rates} MMK
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Net Premium</td>
                <td className=" px-4 py-2 font-bold">
                  {premiumRate?.rates} MMK
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Age (Year)</td>
                <td className=" px-4 py-2 font-bold">{age}</td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Coverage Plan</td>
                <td className=" px-4 py-2 font-bold">
                  {formik.values.proposalCoveragePlan} Days
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Packages</td>
                <td className=" px-4 py-2 font-bold">
                  {formatCurrency(formik.values.proposalPackages)} MMK
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Passport Number</td>
                <td className=" px-4 py-2 font-bold">
                  {formik.values.insuredPersonPassportNumber}
                </td>
              </tr>
              <tr className="align-top border-b border-white">
                <td className=" px-4 py-2 text-gray-700">
                  Name <br />
                  (as per passport)
                </td>
                <td className=" px-4 py-2 font-bold">
                  {formik.values.insuredPersonName}
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">
                  Estimated Departure Date
                </td>
                <td className=" px-4 py-2 font-bold">
                  {formik.values.proposalEstimatedDepartureDate}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="my-5">
            <h2 className="font-bold text-xl">Choose Payment Method</h2>
            <div className="border flex p-5 gap-5">
              <div
                className="relative"
                name="paymentMethod"
                data-value="mpu"
                onClick={handlePayment}
              >
                <img
                  src={MPU}
                  alt=""
                  className={`border cursor-pointer rounded ${
                    formik.values.paymentMethod === "mpu" && "border-[#074DA1]"
                  }`}
                />
                {formik.values.paymentMethod === "mpu" && (
                  <GiConfirmed className="absolute -top-2 right-0" size={25} />
                )}
              </div>
              <div
                className="relative"
                name="paymentMethod"
                data-value="cb"
                onClick={handlePayment}
              >
                <img
                  src={CB}
                  alt=""
                  className={`border cursor-pointer rounded ${
                    formik.values.paymentMethod === "cb" && "border-[#074DA1]"
                  }`}
                />
                {formik.values.paymentMethod === "cb" && (
                  <GiConfirmed className="absolute -top-2 right-0" size={25} />
                )}
              </div>

              <div
                className="relative"
                name="paymentMethod"
                data-value="kbz"
                onClick={handlePayment}
              >
                <img
                  src={KBZ}
                  alt=""
                  className={`border cursor-pointer rounded ${
                    formik.values.paymentMethod === "kbz" && "border-[#074DA1]"
                  }`}
                />
                {formik.values.paymentMethod === "kbz" && (
                  <GiConfirmed className="absolute -top-2 right-0" size={25} />
                )}
              </div>
              <div
                className="relative"
                name="paymentMethod"
                data-value="okdollar"
                onClick={handlePayment}
              >
                <img
                  src={OKDollar}
                  alt=""
                  className={`border cursor-pointer rounded ${
                    formik.values.paymentMethod === "okdollar" &&
                    "border-[#074DA1]"
                  }`}
                />
                {formik.values.paymentMethod === "okdollar" && (
                  <GiConfirmed className="absolute -top-2 right-0" size={25} />
                )}
              </div>
              <div
                className="relative"
                name="paymentMethod"
                data-value="aya"
                onClick={handlePayment}
              >
                <img
                  src={AYA}
                  alt=""
                  className={`border cursor-pointer rounded ${
                    formik.values.paymentMethod === "aya" && "border-[#074DA1]"
                  }`}
                />
                {formik.values.paymentMethod === "aya" && (
                  <GiConfirmed className="absolute -top-2 right-0" size={25} />
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          className="bg-[#074DA1] py-2 px-7 mt-5 text-white hover:bg-white rounded hover:text-[#074DA1] hover:border hover:border-[#074DA1] transition-all duration-500"
          onClick={goto}
        >
          NEXT
        </button>
      </Modal>
    </div>
  );
};

export default UsdFormPage;
