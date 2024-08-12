import React from "react";
import Logo from "../assets/ft_logo.png";
import { FaFacebookF } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="bg-[#074DA1] text-white py-3">
      <div className="max-w-[1200px]  mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
          <div className="text-center lg:text-start">
            <p>2024 Myanma Insurance.</p>
            <p>All Rights Reserved by Myanma Insurance</p>
          </div>
          <img src={Logo} alt="mmi_logo" />
          <div className="p-3 bg-white rounded-md">
            <FaFacebookF className="text-[#074DA1] " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
