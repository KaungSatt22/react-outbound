import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Outbound = () => {
  const location = useLocation();
  const { modal } = location.state || {};

  useEffect(() => {
    if (modal) {
      Swal.fire({
        title: "DONE!",
        text: "Payment Successfully",
        icon: "success",
      });
    }
  }, [modal]);

  return (
    <div className="bg-[#f0f4f9]">
      <div className="max-w-[1200px] mx-auto py-10">
        <h2 className="font-bold uppercase text-[#074DA1]  lg:text-xl">
          Outbound Travel Accident Insurance
        </h2>
        <div className="flex gap-10 mt-10 px-5 lg:px-0">
          <div className="bg-[#074DA1]  text-[yellow]  p-5 w-[350px] h-[180px]">
            <NavLink
              to="/mmk"
              className="flex flex-col items-center text-center gap-5"
            >
              <img
                src="https://www.mminsurance.gov.mm/wp-content/uploads/2023/05/mmk_icon.png"
                alt=""
                className=""
              />
              <p className=" font-bold text-lg mt-2">
                မြန်မာကျပ်ငွေဖြင့် ပေးသွင်းရန်
              </p>
            </NavLink>
          </div>
          <div className="bg-[#074DA1]  text-[yellow] p-5 w-[350px] h-[180px]">
            <NavLink
              to="/usd"
              className="flex flex-col items-center text-center gap-5"
            >
              <img
                src="https://www.mminsurance.gov.mm/wp-content/uploads/2023/05/usd_icon.png"
                alt=""
                className=""
              />
              <p className="font-bold text-lg mt-2">USD ဖြင့် ပေးသွင်းရန်</p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outbound;
