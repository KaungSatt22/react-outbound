import React, { useEffect, useRef, useState } from "react";
import Self from "../assets/self1.svg";
import Agent from "../assets/agent1.svg";
import Association from "../assets/agent_assoc.png";
import { IoCloseOutline } from "react-icons/io5";
import Visa from "../assets/visa_icon.png";
import Master from "../assets/master_card.png";
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
import ScrollTop from "../components/ScrollTop";

const UsdFormPage = () => {
  const [isModalAgentOpen, setIsModalAgentOpen] = useState(false);
  const [isModalAssociationOpen, setIsModalAssociationOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [premiumRate, setPremiumRate] = useState();
  const { insuredPerson } = useSelector(insuredPersonState);
  const formik = useFormik({
    initialValues: {
      passportNumber: insuredPerson?.passportNumber || "",
      passportIssuedCountry: insuredPerson?.passportIssuedCountry || "",
      passportIssuedDate: insuredPerson?.passportIssuedDate || "",
      insuredPersonContactPhoneNo:
        insuredPerson?.insuredPersonContactPhoneNo || "",
      insuredPersonContactPhoneCode:
        insuredPerson?.insuredPersonContactPhoneCode || "+93",
      insuredPersonName: insuredPerson?.insuredPersonName || "",
      insuredPersonDOB: insuredPerson?.insuredPersonDOB || "",
      insuredPersonGender: insuredPerson?.insuredPersonGender || "",
      forChild: insuredPerson?.forChild === "child" ? "child" : "self",
      journeyFrom: insuredPerson?.journeyFrom || "Myanmar",
      foreignContactPhoneNo: insuredPerson?.foreignContactPhoneNo || "",
      foreignContactPhoneCode: insuredPerson?.foreignContactPhoneCode || "+93",
      fatherName: insuredPerson?.fatherName || "",
      race: insuredPerson?.race || "",
      occupation: insuredPerson?.occupation || "",
      maritalStatus: insuredPerson?.maritalStatus || "single",
      insuredPersonEmail: insuredPerson?.insuredPersonEmail || "",
      addressInMyanmar: insuredPerson?.addressInMyanmar || "",
      addressAbroad: insuredPerson?.addressAbroad || "",
      insuredPersonNRC: insuredPerson?.insuredPersonNRC || "",
      journeyTo: insuredPerson?.journeyTo || "",
      countryForDestination: insuredPerson?.countryForDestination || "",
      beneficiaryName: insuredPerson?.beneficiaryName || "",
      beneficiaryDOB: insuredPerson?.beneficiaryDOB || "",
      beneficiaryContactPhoneNo: insuredPerson?.beneficiaryContactPhoneNo || "",
      beneficiaryContactPhoneCode:
        insuredPerson?.beneficiaryContactPhoneCode || "+93",
      beneficiaryRelationship: insuredPerson?.beneficiaryRelationship || "",
      beneficiaryNRC: insuredPerson?.beneficiaryNRC || "",
      beneficiaryEmail: insuredPerson?.beneficiaryEmail || "",
      beneficiaryAddress: insuredPerson?.beneficiaryAddress || "",
      childName: insuredPerson?.childName || "",
      childDOB: insuredPerson?.childDOB || "",
      childGender: insuredPerson?.childGender || "",
      guardianceName: insuredPerson?.guardianceName || "",
      childRelationship: insuredPerson?.childRelationship || "",
      coveragePlan: insuredPerson?.coveragePlan || "",
      rates: insuredPerson?.rates || "",
      estimatedDepartureDate: insuredPerson?.estimatedDepartureDate || "",
      policyStartDate: insuredPerson?.policyStartDate || "",
      insuredPersonAge: insuredPerson?.insuredPersonAge || "",
      packages: insuredPerson?.packages || "",
      paymentMethod: insuredPerson?.paymentMethod || "visa",
      agentId: insuredPerson?.agentId || "",
      buy: insuredPerson?.buy || "usd",
      selectedAgent: insuredPerson?.selectedAgent || "self",
      agentState: insuredPerson?.agentState || "",
      associationState: insuredPerson?.associationState || "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
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
    formik.values.childDOB !== "" && formik.values.forChild === "child"
      ? new Date().getFullYear() -
        new Date(formik.values.childDOB).getFullYear()
      : new Date().getFullYear() -
        new Date(formik.values.insuredPersonDOB).getFullYear();
  const handleRadioChange = (event) => {
    if (event.target.id === "agent") {
      setIsModalAgentOpen(true);
      formik.setFieldValue("selectedAgent", "agent");
    } else if (event.target.id === "association") {
      formik.setFieldValue("selectedAgent", "association");
      setIsModalAssociationOpen(true);
    } else {
      formik.setFieldValue("selectedAgent", "self");
    }
    formik.setFieldValue("agentState", "");
    formik.setFieldValue("associationState", "");
    if (agentNameRef?.current?.value) {
      agentNameRef.current.value = "";
    }
    if (agentLicenseNumRef?.current?.value) {
      agentLicenseNumRef.current.value = "";
    }
    if (associationLicenseNumRef?.current?.value) {
      associationLicenseNumRef.current.value = "";
    }
    if (associationPasswordRef?.current?.value) {
      associationPasswordRef.current.value = "";
    }
    formik.setFieldValue("agentId", "");
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
      form.append("packages", formik.values.packages);
      form.append("days", formik.values.coveragePlan);
      let res = await getPermiumRateByAgeandPackageAndDay(form);
      setPremiumRate(res.data);
      formik.setFieldValue("insuredPersonAge", age);
      formik.setFieldValue("rates", res.data.rates);
    } catch (error) {
      console.log(error);
    }
  };
  const closeAgentModal = () => {
    if (formik.values.agentState === "error") {
      formik.setFieldValue("agentState", "");
    }
    setIsModalAgentOpen(false);
  };

  const closeAssociationModal = () => {
    if (formik.values.associationState === "error") {
      formik.setFieldValue("associationState", "");
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
      formik.setFieldValue("agentState", res.data === "" ? "error" : res.data);
      formik.setFieldValue("agentId", res.data?.id);
      if (res.data) {
        closeAgentModal();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const getAssociation = async () => {
    const form = new FormData();
    form.append("agentLicenseNumber", associationLicenseNumRef.current.value);
    form.append("password", associationPasswordRef.current.value);
    try {
      const res = await getAssociationByLicenseNumandPassword(form);
      formik.setFieldValue(
        "associationState",
        res.data === "" ? "error" : res.data
      );
      formik.setFieldValue("agentId", res.data?.id);
      if (res.data) {
        closeAssociationModal();
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(formik.values);
  const goto = () => {
    navigate("/confirm");
    dispatch(addInsuredPerson(formik.values));
  };

  return (
    <div className="bg-[#f0f4f9] py-10">
      <ScrollTop />
      <form
        className="max-w-[1200px] mx-auto pb-10"
        onSubmit={formik.handleSubmit}
      >
        <h2 className="mx-auto text-center text-2xl font-bold text-[#074DA1] py-5">
          Outbound Travel Accident Insurance (USD)
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
                    name="passportNumber"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.passportNumber}
                  />
                </div>
                {formik.touched.passportNumber &&
                formik.errors.passportNumber ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.passportNumber}
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
                    name="passportIssuedDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.passportIssuedDate}
                    max={
                      new Date(new Date().setDate(new Date().getDate() - 1))
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>
                {formik.touched.passportIssuedDate &&
                formik.errors.passportIssuedDate ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.passportIssuedDate}
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
                    name="passportIssuedCountry"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.passportIssuedCountry}
                  >
                    <option>SELECT ONE</option>
                    {countries.map((country) => (
                      <option value={country.id} key={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.passportIssuedCountry &&
                formik.errors.passportIssuedCountry ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.passportIssuedCountry}
                  </div>
                ) : null}
              </div>
              {(formik.values.passportIssuedCountry == 1 ||
                formik.values.passportIssuedCountry == 124) && (
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
                name="forChild"
                id="urself"
                value={"self"}
                checked={formik.values.forChild === "self"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="urself" className="font-bold">
                <p>Buy for yourself (This passport holder)</p>
              </label>
            </div>
            <div className="space-x-2 flex my-5">
              <input
                type="radio"
                name="forChild"
                id="child"
                value="child"
                checked={formik.values.forChild === "child"}
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
                    name="insuredPersonDOB"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonDOB}
                    max={
                      new Date(new Date().setDate(new Date().getDate() - 1))
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>
                {formik.touched.insuredPersonDOB &&
                formik.errors.insuredPersonDOB ? (
                  <div className="text-red-500">
                    {formik.errors.insuredPersonDOB}
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
                    name="estimatedDepartureDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.estimatedDepartureDate}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {formik.touched.estimatedDepartureDate &&
                formik.errors.estimatedDepartureDate ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.estimatedDepartureDate}
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
                    readOnly
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
                    name="journeyTo"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.journeyTo}
                  >
                    <option value="">Select One</option>
                    {countries.map((country) => (
                      <option value={country.id} key={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.journeyTo && formik.errors.journeyTo ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.journeyTo}
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
                    name="policyStartDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.policyStartDate}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {formik.touched.policyStartDate &&
                formik.errors.policyStartDate ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.policyStartDate}
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
                    name="coveragePlan"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.coveragePlan}
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
                {formik.touched.coveragePlan && formik.errors.coveragePlan ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.coveragePlan}
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
                    name="packages"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.packages}
                  >
                    <option value="">Select One</option>
                    <option value="10000">USD 10,000</option>
                    <option value="30000">USD 30,000</option>
                    <option value="50000">USD 50,000</option>
                  </select>
                </div>
                {formik.touched.packages && formik.errors.packages ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.packages}
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
                      value={formik.values.insuredPersonContactPhoneCode}
                      name="insuredPersonContactPhoneCode"
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
                      name="foreignContactPhoneNo"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.foreignContactPhoneNo}
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
                    name="fatherName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fatherName}
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
                    name="race"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.race}
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
                    name="occupation"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.occupation}
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
                      name="maritalStatus"
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
                      name="maritalStatus"
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
                    name="insuredPersonEmail"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.insuredPersonEmail}
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
                    name="addressInMyanmar"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.addressInMyanmar}
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
                    name="addressAbroad"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.addressAbroad}
                  ></textarea>
                </div>
                {formik.touched.addressAbroad && formik.errors.addressAbroad ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.addressAbroad}
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
                    name="countryForDestination"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.countryForDestination}
                  >
                    <option value="">Select One</option>
                    {countries.map((country) => (
                      <option value={country.id} key={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.countryForDestination &&
                formik.errors.countryForDestination ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.countryForDestination}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {formik.values.forChild === "child" && (
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
                      max={
                        new Date(new Date().setDate(new Date().getDate() - 1))
                          .toISOString()
                          .split("T")[0]
                      }
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
                      name="guardianceName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.guardianceName}
                    />
                  </div>
                  {formik.touched.guardianceName &&
                  formik.errors.guardianceName ? (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.guardianceName}
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
                    max={
                      new Date(new Date().setDate(new Date().getDate() - 1))
                        .toISOString()
                        .split("T")[0]
                    }
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
                    name="beneficiaryRelationship"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryRelationship}
                  />
                </div>
                {formik.touched.beneficiaryRelationship &&
                formik.errors.beneficiaryRelationship ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.beneficiaryRelationship}
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
                      value={formik.values.beneficiaryContactPhoneCode}
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
                      name="beneficiaryContactPhoneNo"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.beneficiaryContactPhoneNo}
                    />
                  </div>
                </div>
                {formik.touched.beneficiaryContactPhoneNo &&
                formik.errors.beneficiaryContactPhoneNo ? (
                  <div className="text-red-500 font-semibold">
                    {formik.errors.beneficiaryContactPhoneNo}
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
                    name="beneficiaryNRC"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryNRC}
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
                    name="beneficiaryEmail"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryEmail}
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
                    name="beneficiaryAddress"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.beneficiaryAddress}
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
                  checked={formik.values.selectedAgent === "self"}
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
                  checked={formik.values.selectedAgent === "agent"}
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
                  checked={formik.values.selectedAgent === "association"}
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
            {formik.values.agentState && (
              <div className="flex gap-5 px-5 py-5">
                <div className="flex-1">
                  <label className="font-bold">
                    Agent Name <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder="Agent Name"
                      value={formik.values.agentState.agentName}
                      className="p-2 w-full mt-2 uppercase"
                      readOnly
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
                      value={formik.values.agentState.agentLicenseNumber}
                      className="p-2 w-full mt-2 uppercase"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex-1 mt-10">
                  <button
                    className="underline font-bold "
                    type="button"
                    onClick={() => setIsModalAgentOpen(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
            {formik.values.associationState && (
              <div className="flex gap-5 px-5 py-5">
                <div className="flex-1">
                  <label className="font-bold">
                    Agent Name <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder="Agent Name"
                      value={formik.values.associationState.agentName}
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
                      value={formik.values.associationState.agentLicenseNumber}
                      className="p-2 w-full mt-2 uppercase"
                    />
                  </div>
                </div>
                <div className="flex-1 mt-10">
                  <button
                    className="underline font-bold "
                    type="button"
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
          {formik.values.agentState === "error" && (
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
          {formik.values.associationState === "error" && (
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
                  {formik.values.forChild === "child"
                    ? "Buy for child"
                    : "Buy for this passport holder"}
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Premium Amount</td>
                <td className=" px-4 py-2 font-bold">
                  {premiumRate?.rates} USD
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Net Premium</td>
                <td className=" px-4 py-2 font-bold">
                  {premiumRate?.rates} USD
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Age (Year)</td>
                <td className=" px-4 py-2 font-bold">{age}</td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Coverage Plan</td>
                <td className=" px-4 py-2 font-bold">
                  {formik.values.coveragePlan} Days
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Packages</td>
                <td className=" px-4 py-2 font-bold">
                  {formatCurrency(formik.values.packages)} USD
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className=" px-4 py-2 text-gray-700">Passport Number</td>
                <td className=" px-4 py-2 font-bold">
                  {formik.values.passportNumber}
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
                  {formik.values.estimatedDepartureDate}
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
                data-value="visa"
                onClick={handlePayment}
              >
                <img
                  src={Visa}
                  alt=""
                  className={`border cursor-pointer rounded ${
                    formik.values.paymentMethod === "visa" && "border-[#074DA1]"
                  }`}
                />
                {formik.values.paymentMethod === "visa" && (
                  <GiConfirmed className="absolute -top-2 right-0" size={25} />
                )}
              </div>
              <div
                className="relative"
                name="paymentMethod"
                data-value="master"
                onClick={handlePayment}
              >
                <img
                  src={Master}
                  alt=""
                  className={`border cursor-pointer rounded ${
                    formik.values.paymentMethod === "master" &&
                    "border-[#074DA1]"
                  }`}
                />
                {formik.values.paymentMethod === "master" && (
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
