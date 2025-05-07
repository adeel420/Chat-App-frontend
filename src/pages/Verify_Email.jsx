import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verify_Email = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      return setErrorMsg("Field are required");
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/verify-email`,
        { code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMsg(response.data.msg || "OTP verified successful!");
        setErrorMsg("");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setErrorMsg(response.data?.error || "Verification failed");
        setSuccessMsg("");
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setSuccessMsg("");
    }
  };
  return (
    <div
      className="flex bg-[#090909] h-[90vh] mt-8 ml-8 mr-8 p-4 rounded-[10px] 
            overflow-y-auto 
            md:h-[90vh] md:mt-8 md:ml-8 md:mr-8 
            sm:mt-4 sm:ml-4 sm:mr-4 sm:h-screen"
    >
      <div className="w-[50%] flex items-center justify-center">
        <img
          src={assets.loginImg}
          className="h-[450px] w-[450px]"
          alt="verify-email"
        />
      </div>
      <div className="w-[50%] p-4 flex flex-col justify-center">
        <h1 className="text-center text-4xl text-[#99FFAF]">Verify Email</h1>
        <form
          className="flex flex-col gap-3 mt-5 self-center w-[400px]"
          onSubmit={handleSubmit}
        >
          <label className="text-[18px]">Code:</label>
          <input
            type="text"
            className="border border-white outline-0 p-2 rounded"
            placeholder="Enter OTP..."
            onChange={(e) => setCode(e.target.value)}
            value={code}
            name="code"
          />
          <button className="bg-[#99FFAF] mt-3 text-black cursor-pointer text-[18px] font-bold p-2 rounded">
            Verify
          </button>

          {/* Error Msg */}
          {errorMsg && (
            <div className="bg-[#efcfd0] text-[brown] max-w-[400px] w-full p-2 text-lg mt-5 rounded border border-brown">
              {errorMsg}
            </div>
          )}

          {/* Success Msg */}
          {successMsg && (
            <div className="bg-[#d1e6dd] text-[#003c40] max-w-[400px] w-full p-2 text-lg mt-3 rounded border border-[#003c40]">
              {successMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Verify_Email;
