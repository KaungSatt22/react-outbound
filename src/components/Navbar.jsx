import React, { useState } from "react";
import { IoMailOpen } from "react-icons/io5";
import { FaPhone, FaSortDown } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import Logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="max-w-[1200px] relative mb-10 mx-auto">
      <div className="flex justify-between items-center py-3 text-[#074DA1] text-sm">
        <img src={Logo} alt="mmi_logo" />
        <div className="flex gap-3">
          <div className="hidden lg:flex items-center gap-1 pr-7 border-r-2 ">
            <div className="p-2 border rounded-full ">
              <IoMailOpen size={24} />
            </div>
            <div>
              <a
                href="mailto: online-support@mminsurance.gov.mm"
                className="font-bold"
              >
                online-support@mminsurance.gov.mm
              </a>
              <p className="text-gray-400">Drop us a mail</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-1 pr-7 border-r-2">
            <div className="p-2 border rounded-full">
              <FaPhone />
            </div>
            <div>
              <p className="font-bold">+959765428630,31</p>
              <p className="text-gray-400">Make a call</p>
            </div>
          </div>
          <div className="hidden lg:flex gap-1">
            <div className="">
              <p className="px-2 py-1 bg-[#074DA1] text-white">MM</p>
            </div>
            <div className="">
              <p className="px-2 py-1 bg-[#074DA1] text-white">EN</p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 text-[#074DA1]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <HiMenu size={30} />
          </button>
        </div>
      </div>
      <div
        className={`absolute  w-full ${
          isMenuOpen ? "block" : "hidden"
        } lg:flex items-center justify-between p-3 bg-[#074DA1] text-sm rounded-lg`}
      >
        <nav>
          <ul className="flex flex-col lg:flex-row gap-2 font-bold text-white text-center lg:text-left lg:justify-start justify-center items-center">
            <li className="hover:text-yellow-300">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                HOME
              </NavLink>
            </li>
            <li className="hover:text-yellow-300">
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start"
              >
                <p>ABOUT US</p>
                <FaSortDown />
              </a>
            </li>
            <li className="hover:text-yellow-300">
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start"
              >
                <p>INSURANCE PRODUCTS</p>
                <FaSortDown />
              </a>
            </li>
            <li className="hover:text-yellow-300">
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start"
              >
                <p>CUSTOMER HUB</p>
                <FaSortDown />
              </a>
            </li>
            <li className="hover:text-yellow-300">
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start"
              >
                <p>NEWS & MEDIA</p>
                <FaSortDown />
              </a>
            </li>
            <li className="hover:text-yellow-300">
              <a href="#" onClick={() => setIsMenuOpen(false)}>
                CONTACT US
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col lg:flex-row gap-1 mt-4 lg:mt-0">
          <div className="bg-white px-1 py-2  rounded text-center text-[#074DA1] font-bold">
            <a href="#">Premium Calculator</a>
          </div>
          <div className="bg-white px-1 py-2   rounded text-center text-[#074DA1] font-bold">
            <NavLink to="emquiry" onClick={() => setIsMenuOpen(false)}>
              Print Certificates
            </NavLink>
          </div>
          <div className="bg-white px-1 py-2  rounded text-center text-[#074DA1] font-bold">
            <a href="#">Online Biller</a>
          </div>
          <div className="bg-white px-1 py-2  rounded text-center text-[#074DA1] font-bold">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
              Buy Online
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
