import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { AiOutlineInstagram, AiFillMail } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";

function Footer() {

    return (
      <div className="sm:min-h-64 bg-[#272727] text-white sm:p-4 p-2 sm:text-base text-[10px] flex flex-col overflow-x-hidden">
        <div className="flex justify-evenly sm:mt-8 mt-6 text-zinc-500">
          <div>
            <h1 className="sm:text-2xl text-lg text-white font-serif mb-2">Join us</h1>
            <ul className="flex flex-col gap-4 cursor-pointer">
              <li><a href="https://www.linkedin.com/in/rohit-jadon-60a45429a/" className="flex justify-center items-center gap-2 hover:text-zinc-300">LinkedIn<FaLinkedin /></a></li>
              <li><a href="https://github.com/rohitjadon101/" className="flex justify-center items-center gap-2 hover:text-zinc-300">Github<FaGithub /></a></li>
            </ul>
          </div>
          <div>
            <h1 className="sm:text-2xl text-lg text-white font-serif mb-2">Contact us</h1>
            <ul className="flex flex-col gap-4 cursor-pointer">
              <li><a href="mailto:rohitjadon820@gmail.com" className="flex justify-center items-center gap-2 hover:text-zinc-300">Gmail<AiFillMail /></a></li>
              <li><a href="" className="flex justify-center items-center gap-2 hover:text-zinc-300">Twitter<FaSquareXTwitter /></a></li>
              <li><a href="https://www.instagram.com/rohitjadon_" className="flex justify-center items-center gap-2 hover:text-zinc-300">Instagram<AiOutlineInstagram /></a></li>
            </ul>
          </div>
          <div>
            <h1 className="sm:text-2xl text-lg text-white font-serif mb-2">About us</h1>
            <ul className="flex flex-col gap-2 cursor-pointer">
              <li><a href="" className="flex justify-center items-center gap-2 hover:text-zinc-300">About us</a></li>
              <li><a href="" className="flex justify-center items-center gap-2 hover:text-zinc-300">Feedback</a></li>
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