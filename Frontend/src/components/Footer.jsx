import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { AiOutlineInstagram, AiFillMail } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";

function Footer() {

    return (
      <div className="sm:min-h-64 bg-[#272727] text-white sm:p-4 p-2 sm:text-base text-[10px] flex flex-col">
        <div className="flex justify-evenly sm:mt-8 mt-6 text-zinc-500">
          <div>
            <h1 className="sm:text-2xl text-lg text-white font-serif mb-2">Join us</h1>
            <ul className="flex flex-col gap-4 cursor-pointer">
              <li className="flex justify-center items-center gap-2 hover:text-zinc-300">LinkedIn<FaLinkedin /></li>
              <li className="flex justify-center items-center gap-2 hover:text-zinc-300">Github<FaGithub /></li>
              <li className="flex justify-center items-center gap-2 hover:text-zinc-300">Instagram<AiOutlineInstagram /></li>
            </ul>
          </div>
          <div>
            <h1 className="sm:text-2xl text-lg text-white font-serif mb-2">Contact us</h1>
            <ul className="flex flex-col gap-4 cursor-pointer">
              <li className="flex justify-center items-center gap-2 hover:text-zinc-300">Twitter<FaSquareXTwitter /></li>
              <li className="flex justify-center items-center gap-2 hover:text-zinc-300">Gmail<AiFillMail/></li>
            </ul>
          </div>
          <div>
            <h1 className="sm:text-2xl text-lg text-white font-serif mb-2">About us</h1>
            <ul className="flex flex-col gap-2 cursor-pointer">
              <li className="hover:text-zinc-300">About us</li>
              <li className="hover:text-zinc-300">Feedback</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:text-sm">
          <div className="w-full h-[2px] bg-zinc-600 mb-1"></div>
          <p>All Rights Reserved 2024</p>
        </div>
      </div>
    )
  }
  
  export default Footer;