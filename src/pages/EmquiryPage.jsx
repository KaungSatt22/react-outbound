import React, { useEffect, useState } from "react";
import { getAllCountry } from "../api/country";
import { getEnquiry } from "../api/enquiry";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../components/PdfDocument";
import { useFormik } from "formik";
import * as yup from "yup";
import { formatDate } from "../ultils/dateFormat";

const EmquiryPage = () => {
  const [countries, setCountries] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  console.log(purchaseHistory);

  const validationSchema = yup.object({
    passportNumber: yup.string().required("This Field is required"),
    passportIssuedCountry: yup.string().required("This Field is required"),
  });
  const formik = useFormik({
    validationSchema,
    initialValues: {
      passportNumber: "",
      passportIssuedCountry: "",
    },
    onSubmit: async (values) => {
      const form = new FormData();
      form.append("passportNumber", values.passportNumber);
      form.append("passportIssuedCountry", +values.passportIssuedCountry);
      try {
        const res = await getEnquiry(form);
        setPurchaseHistory(res.data);
      } catch (error) {
        console.log(error.message);
      }
    },
  });
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
  return (
    <div className="bg-[#f0f4f9]">
      <div className=" w-[1200px] mx-auto py-5">
        <h2 className="mx-auto text-center text-2xl font-bold text-[#074DA1] py-5">
          Outbound Travel Accident Insurance
        </h2>
        <div className="bg-white p-10">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex gap-3 ">
              <div className="flex-1">
                <label className="font-bold text-[#074DA1]">
                  Passport Number
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="..."
                    className="p-2 border w-full mt-2"
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
              <div className="flex-1">
                <label htmlFor="" className="font-bold text-[#074DA1]">
                  Passport Issued Country
                </label>
                <div>
                  <select
                    name="passportIssuedCountry"
                    className="w-full border p-2 mt-2 uppercase"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.passportIssuedCountry}
                  >
                    <option value="">SELECT ONE</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
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
            </div>
            <button
              className="bg-[#074DA1] text-white py-2 px-5 mt-5"
              type="submit"
            >
              Search
            </button>
          </form>
          {purchaseHistory.length > 0 && (
            <>
              <h2 className="font-bold text-[#074DA1] my-5">
                Inbound Travel Accident Insurance Purchase History
              </h2>
              <table className="border border-blue-500 w-full">
                <thead>
                  <tr className="text-center">
                    <th className="bg-[#074DA1] border text-white  py-2">
                      No.
                    </th>
                    <th className="bg-[#074DA1] border text-white  py-2">
                      Certificate No.
                    </th>
                    <th className="bg-[#074DA1] border text-white  py-2">
                      Insured Name
                    </th>
                    <th className="bg-[#074DA1] border text-white  py-2">
                      Age
                    </th>
                    <th className="bg-[#074DA1] border text-white  py-2">
                      Contact No.
                    </th>
                    <th className="bg-[#074DA1] border text-white  py-2">
                      Coverage Plan (Days)
                    </th>
                    <th className="bg-[#074DA1] border text-white  py-2">
                      Premium Amount
                    </th>
                    <th className="bg-[#074DA1] border text-white  py-2">
                      Payment Date
                    </th>
                    <th className="bg-[#074DA1] border text-white  py-2">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border  py-2">{index + 1}.</td>
                      <td className="border  py-2">{item.certificateNumber}</td>
                      <td className="border  py-2">
                        {item.forChild ? item.childName : item.name}
                      </td>
                      <td className="border  py-2">{item.age}</td>
                      <td className="border  py-2">{item.contactPhone}</td>
                      <td className="border  py-2">{item.coveragePlan}</td>
                      <td className="border  py-2">{item.rates}</td>
                      <td className="border  py-2">
                        {formatDate(item.submittedDate)}
                      </td>
                      <td className="border  py-2">
                        <PDFDownloadLink
                          document={<PdfDocument item={item} />}
                          fileName="insurance_purchase_history.pdf"
                        >
                          {({ loading }) => (
                            <button className="bg-[#074DA1] text-white p-2 rounded">
                              {loading ? "Loading document..." : "Download"}
                            </button>
                          )}
                        </PDFDownloadLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmquiryPage;
