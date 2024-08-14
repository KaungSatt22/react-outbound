import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  insuredPersonState,
  resetInsuredPerson,
} from "../features/insuranceperson/personSlice";
import { getAllCountry } from "../api/country";
import { postInsuranced } from "../api/insuranced";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../ultils/formatCurrency";
import { IoReturnUpBack } from "react-icons/io5";
import ScrollTop from "../components/ScrollTop";

const ConfirmationPage = () => {
  const { insuredPerson } = useSelector(insuredPersonState);
  const [journeyTo, setJourney] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [passportIssuedCountry, setPassportIssuedCountry] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    const form = new FormData();
    form.append("insuredPersonName", insuredPerson.insuredPersonName);
    form.append("insuredPersonDOB", insuredPerson.insuredPersonDOB);
    form.append("insuredPersonGender", insuredPerson.insuredPersonGender);
    form.append(
      "insuredPersonContactPhoneNo",
      `(${insuredPerson.insuredPersonContactPhoneCode}) ${insuredPerson.insuredPersonContactPhoneNo}`
    );
    if (insuredPerson.foreignContactPhoneNo) {
      form.append(
        "foreignContactPhoneNo",
        `(${insuredPerson.foreignContactPhoneCode}) ${insuredPerson.foreignContactPhoneNo}`
      );
    }
    form.append("fatherName", insuredPerson.fatherName);
    form.append("race", insuredPerson.race);
    form.append("occupation", insuredPerson.occupation);
    form.append("maritalStatus", insuredPerson.maritalStatus);
    form.append("insuredPersonEmail", insuredPerson.insuredPersonEmail);
    form.append("addressInMyanmar", insuredPerson.addressInMyanmar);
    form.append("addressAbroad", insuredPerson.addressAbroad);
    form.append("passportNumber", insuredPerson.passportNumber);
    form.append("passportIssuedDate", insuredPerson.passportIssuedDate);
    form.append("insuredPersonNRC", insuredPerson.insuredPersonNRC);
    form.append("forChild", insuredPerson.forChild === "child");
    form.append("journeyTo", insuredPerson.journeyTo);
    form.append("countryForDestination", insuredPerson.countryForDestination);
    form.append("beneficiaryName", insuredPerson.beneficiaryName);
    form.append("beneficiaryDOB", insuredPerson.beneficiaryDOB);
    form.append(
      "beneficiaryRelationship",
      insuredPerson.beneficiaryRelationship
    );
    form.append(
      "beneficiaryContactPhoneNo",
      `(${insuredPerson.beneficiaryContactPhoneCode}) ${insuredPerson.beneficiaryContactPhoneNo}`
    );
    form.append("beneficiaryNRC", insuredPerson.beneficiaryNRC);
    form.append("beneficiaryEmail", insuredPerson.beneficiaryEmail);
    form.append("beneficiaryAddress", insuredPerson.beneficiaryAddress);
    form.append("childName", insuredPerson.childName);
    form.append("childDOB", insuredPerson.childDOB);
    form.append("childGender", insuredPerson.childGender);
    form.append("guardianceName", insuredPerson.guardianceName);
    form.append("childRelationship", insuredPerson.childRelationship);
    if (insuredPerson.agentId) {
      form.append("agentId", insuredPerson.agentId);
    }
    form.append("coveragePlan", insuredPerson.coveragePlan);
    form.append("rates", insuredPerson.rates);
    form.append("estimatedDepartureDate", insuredPerson.estimatedDepartureDate);
    form.append("policyStartDate", insuredPerson.policyStartDate);
    form.append("serviceAmount", serviceAmount);
    form.append("insuredPersonAge", insuredPerson.insuredPersonAge);
    form.append("packages", insuredPerson.packages);
    form.append("passportIssuedCountry", insuredPerson.passportIssuedCountry);

    try {
      await postInsuranced(form);
      dispatch(resetInsuredPerson());
      navigate("/", { state: { modal: true } });
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getCountries();
  }, []);
  console.log("isChild :" + insuredPerson.forChild);
  const getCountries = async () => {
    try {
      let res = await getAllCountry();
      setJourney(
        res.data.filter((country) => country.id == insuredPerson.journeyTo)[0]
          ?.countryName
      );
      setDestinationCountry(
        res.data.filter(
          (country) => country.id == insuredPerson.countryForDestination
        )[0]?.countryName
      );
      setPassportIssuedCountry(
        res.data.filter(
          (country) => country.id == insuredPerson.passportIssuedCountry
        )[0]?.countryName
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const roundUp = (number, decimals) => {
    const factor = Math.pow(10, decimals);
    return (Math.ceil(number * factor) / factor).toFixed(decimals);
  };
  const back = () => {
    navigate(-1);
  };
  const serviceAmount = roundUp((insuredPerson.rates * 3.627) / 100, 2);
  const total = insuredPerson.rates + +serviceAmount;
  return (
    <div className="bg-[#f0f4f9] py-10 ">
      <ScrollTop />
      <div className="w-[1200px] mx-auto bg-white p-5 rounded text-[]">
        <div className="flex justify-end">
          <div
            className="border-2 rounded-full inline-block p-2 cursor-pointer"
            onClick={back}
          >
            <IoReturnUpBack size={32} />
          </div>
        </div>
        <h2 className="font-bold text-[#074DA1] text-xl mb-5">
          Please Check Payment and Insured Person Information
        </h2>
        <h3 className="underline text-[#074DA1] font-bold ">
          Payment Information
        </h3>

        <div className="my-5">
          <table className="min-w-full bg-[#ffef00b3] border border-gray-300">
            <tbody className="text-black">
              <tr className="border-b border-white">
                <td className="px-4 py-2 text-gray-700 font-bold w-[350px]">
                  Payment Channel
                </td>
                <td className="px-4 py-2 uppercase">
                  {insuredPerson.paymentMethod}
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className="px-4 py-2 text-gray-700 font-bold w-[350px]">
                  Premium Amount
                </td>
                <td className="px-4 py-2">
                  {insuredPerson.rates}{" "}
                  {insuredPerson.buy === "usd" ? "USD" : "MMK"}
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className="px-4 py-2 text-gray-700 font-bold w-[350px]">
                  Service Charge ( Visa )
                </td>
                <td className="px-4 py-2">
                  {serviceAmount} {insuredPerson.buy === "usd" ? "USD" : "MMK"}
                </td>
              </tr>
              <tr className="border-b border-white">
                <td className="px-4 py-2 text-gray-700 font-bold w-[350px]">
                  Total Amount (Including Service Charges)
                </td>
                <td className="px-4 py-2">
                  {total} {insuredPerson.buy === "usd" ? "USD" : "MMK"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 font-bold w-[350px]">
                  Net Amount (Including Service Charges)
                </td>
                <td className="px-4 py-2">
                  {total} {insuredPerson.buy === "usd" ? "USD" : "MMK"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="underline text-[#074DA1] font-bold text-xl">
            Insured Person's Passport Information
          </h2>
          <table className="min-w-full ">
            <tbody className="text-black">
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Passport Number</p>
                  <p>(နိုင်ငံကူးလက်မှတ်အမှတ်)</p>
                </td>
                <td className="px-4 py-2 ">{insuredPerson.passportNumber}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  Passport Issued Date <p>(နိုင်ငံကူးလက်မှတ်ထုတ်ပေးသည့်နေ့)</p>
                </td>
                <td className="px-4 py-2">
                  {insuredPerson.passportIssuedDate}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Passport Issued Country</p>
                  <p>(နိုင်ငံကူးလက်မှတ်ထုတ်ပေးသည့်နိုင်ငံ)</p>
                </td>
                <td className="px-4 py-2 ">{passportIssuedCountry}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="my-10">
          <h2 className="underline text-[#074DA1] font-bold text-xl">
            Insured Person Information
          </h2>
          <table className="min-w-full">
            <tbody className="text-black">
              <tr className="border-b border-gray-300 w-[350px]">
                <td className="px-4 py-2 font-bold">Insured For</td>
                <td className="px-4 py-2 uppercase">
                  {insuredPerson.forChild === "child"
                    ? "BUY FOR CHILD"
                    : "BUY FOR THIS PASSPORT HOLDER"}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Name (as per passport)</p>
                  <p>(အမည်(နိုင်ငံကူးလက်မှတ်ပါအမည်))</p>
                </td>
                <td className="px-4 py-2  uppercase">
                  {insuredPerson.insuredPersonName}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Date of Birth (as per passport)</p>
                  <p>(မွေးသက္ကရာဇ်(နိုင်ငံကူးလက်မှတ်ပါမွေးသက္ကရာဇ်))</p>
                </td>
                <td className="px-4 py-2">{insuredPerson.insuredPersonDOB}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Gender (as per passport)</p>
                  <p>(ကျား/မ(နိုင်ငံကူးလက်မှတ်ပါ))</p>
                </td>
                <td className="px-4 py-2">
                  {insuredPerson.insuredPersonGender}
                </td>
              </tr>
              {insuredPerson.insuredPersonNRC && (
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 font-bold w-[350px]">
                    <p>National Identification Number</p>
                    <p className="text-gray-500">
                      (နိုင်ငံသားစိစစ်ရေးကတ်ပြားအမှတ်)
                    </p>
                  </td>
                  <td className="px-4 py-2 ">
                    {insuredPerson.insuredPersonNRC}
                  </td>
                </tr>
              )}
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p> Estimate Departure Date</p>
                  <p>(ထွက်ခွာမည့်နေ့(ခန့်မှန်းခြေ))</p>
                </td>
                <td className="px-4 py-2">
                  {insuredPerson.estimatedDepartureDate}
                </td>
              </tr>
              {insuredPerson.forChild === "child" && (
                <>
                  <tr className="border-b border-gray-300">
                    <td className="px-4 py-2 font-bold w-[350px]">
                      <p>Child Name</p>
                      <p>(ကလေးအမည်)</p>
                    </td>
                    <td className="px-4 py-2 ">{insuredPerson.childName}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="px-4 py-2 font-bold w-[350px]">
                      <p>Date of Birth (child)</p>
                      <p>(မွေးနေ့သက္ကရာဇ်)</p>
                    </td>
                    <td className="px-4 py-2 ">{insuredPerson.childDOB}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="px-4 py-2 font-bold w-[350px]">
                      <p>Gender (Child)</p>
                      <p>ကျား/မ</p>
                    </td>
                    <td className="px-4 py-2 ">{insuredPerson.childGender}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="px-4 py-2 font-bold w-[350px]">
                      <p>Relationship (Child)</p>
                      <p>တော်စပ်ပုံ</p>
                    </td>
                    <td className="px-4 py-2 ">
                      {insuredPerson.childRelationship}
                    </td>
                  </tr>
                </>
              )}
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Journey From</p>
                  <p>(ထွက်ခွာမည့်နိုင်ငံ)</p>
                </td>
                <td className="px-4 py-2 ">Myanmar</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Journey To</p>
                  <p>(ဆိုက်ရောက်မည့်နိုင်ငံ)</p>
                </td>
                <td className="px-4 py-2 ">{journeyTo}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Coverage Plan</p>
                  <p>(အာမခံသက်တမ်း)</p>
                </td>
                <td className="px-4 py-2 ">
                  {insuredPerson.coveragePlan} Days
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Packages</p> <p>(ပက်ကေ့ချ်)</p>
                </td>
                <td className="px-4 py-2 ">
                  {formatCurrency(insuredPerson.packages)}{" "}
                  {insuredPerson.buy === "usd" ? "USD" : "MMK"}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Policy Start Date</p> <p>(ပေါ်လစီစတင်မည့်နေ့)</p>
                </td>
                <td className="px-4 py-2">{insuredPerson.policyStartDate}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Contact Phone Number</p> <p>(ဆက်သွယ်ရမည့်ဖုန်းနံပါတ်)</p>
                </td>
                <td className="px-4 py-2">
                  ({insuredPerson.insuredPersonContactPhoneCode}){" "}
                  {insuredPerson.insuredPersonContactPhoneNo}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Foreign Contact Number</p>{" "}
                  <p>(ဆက်သွယ်ရမည့်နိုင်ငံခြားဖုန်းနံပါတ်)</p>
                </td>
                {insuredPerson.foreignContactPhoneNo && (
                  <td className="px-4 py-2">
                    ({insuredPerson.foreignContactPhoneCode}){" "}
                    {insuredPerson.foreignContactPhoneNo}
                  </td>
                )}
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Father's Name</p> <p>(ဖခင်အမည်)</p>
                </td>
                <td className="px-4 py-2">{insuredPerson.fatherName}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Race</p> <p>(လူမျိုး)</p>
                </td>
                <td className="px-4 py-2 ">{insuredPerson.race}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Occupation</p> <p>(အလုပ်အကိုင်)</p>
                </td>
                <td className="px-4 py-2 ">{insuredPerson.occupation}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Marital Status</p> <p>(အိမ်ထောင်ရှိ/မရှိ)</p>
                </td>
                <td className="px-4 py-2 ">{insuredPerson.maritalStatus}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Insured's Email Address</p> <p>(အီးမေးလ်လိပ်စာ)</p>
                </td>
                <td className="px-4 py-2">
                  {insuredPerson.insuredPersonEmail}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Address Abroad</p>{" "}
                  <p>(ဆိုက်ရောက်မည့်နိုင်ငံနေရပ်လိပ်စာ)</p>
                </td>
                <td className="px-4 py-2 ">{insuredPerson.addressAbroad}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Destination Country</p> <p>(ဆိုက်ရောက်မည့်နိုင်ငံ)</p>
                </td>
                <td className="px-4 py-2 ">{destinationCountry}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold w-[350px]">
                  <p>Address in Myanmar</p> <p>(မြန်မာနိုင်ငံရှိနေရပ်လိပ်စာ)</p>
                </td>
                <td className="px-4 py-2 ">{insuredPerson.addressInMyanmar}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="underline text-[#074DA1] font-bold text-xl">
            Beneficiary Information / အကျိုးခံစားခွင့်ရှိသူနှင့် သက်ဆိုင်သော
            အချက်အလက်
          </h2>
          <table className="w-full ">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-bold w-[350px]">
                  <p>Name</p> <p>အမည်</p>
                </td>
                <td className="p-2 text-uppercase">
                  {insuredPerson.beneficiaryName}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold w-[350px]">
                  <p>Date of Birth</p>
                  <p>မွေးသက္ကရာဇ်</p>
                </td>
                <td className="p-2">{insuredPerson.beneficiaryDOB}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold w-[350px]">
                  <p>Relationship</p> <p>တော်စပ်ပုံ</p>
                </td>
                <td className="p-2 text-uppercase">
                  {insuredPerson.beneficiaryRelationship}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold w-[350px]">
                  <p>National Identification Number</p>{" "}
                  <p>နိုင်ငံသားစိစစ်ရေးကတ်ပြားအမှတ်</p>
                </td>
                <td className="p-2 text-uppercase">
                  {insuredPerson.beneficiaryNRC}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold w-[350px]">
                  <p>Contact Phone Number</p> <p>ဆက်သွယ်ရမည့်ဖုန်းနံပါတ်</p>
                </td>
                <td className="p-2">
                  ({insuredPerson.beneficiaryContactPhoneCode}){" "}
                  {insuredPerson.beneficiaryContactPhoneNo}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold w-[350px]">
                  <p>Email</p>
                  <p>အီးမေးလ်လိပ်စာ</p>
                </td>
                <td className="p-2">{insuredPerson.beneficiaryEmail}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold w-[350px]">
                  <p>Address</p>
                  <p>နေရပ်လိပ်စာ</p>
                </td>
                <td className="p-2 text-uppercase">
                  {insuredPerson.beneficiaryAddress}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          onClick={handleConfirm}
          className="bg-[#074DA1] py-2 px-7 mt-5 text-white hover:bg-white rounded hover:text-[#074DA1] hover:border hover:border-[#074DA1] transition-all duration-500"
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
