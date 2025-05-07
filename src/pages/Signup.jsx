import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [file, setFile] = useState("");
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return setErrorMsg("All fields are required");
    }
    if (name.length < 3) {
      return setErrorMsg("Length of name must be at least 3 characters");
    }
    if (password.length < 5) {
      return setErrorMsg("Length of password must be at least 5 characters");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", file); // must match backend field name

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMsg(response.data.msg || "Signup successful!");
        setErrorMsg("");
        setTimeout(() => {
          navigate("/verify-email");
        }, 1000);
      } else {
        setErrorMsg(response.data?.error || "Signup failed");
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
          alt="signup"
        />
      </div>
      <div className="w-[50%] p-4 flex flex-col justify-center">
        <h1 className="text-center text-4xl text-[#99FFAF]">Signup</h1>
        <form
          className="flex flex-col gap-3 mt-5 self-center w-[400px]"
          onSubmit={handleSubmit}
        >
          <label className="text-[18px]">Name:</label>
          <input
            type="text"
            className="border border-white outline-0 p-2 rounded"
            placeholder="Name..."
            onChange={handleChange}
            value={signupInfo.name}
            name="name"
          />
          <label className="text-[18px]">Email:</label>
          <input
            type="email"
            className="border border-white outline-0 p-2 rounded"
            placeholder="Email..."
            onChange={handleChange}
            value={signupInfo.email}
            name="email"
          />
          <label className="text-[18px]">Password:</label>
          <input
            type="password"
            className="border border-white outline-0 p-2 rounded"
            placeholder="Password..."
            onChange={handleChange}
            value={signupInfo.password}
            name="password"
          />
          <label className="mt-3 cursor-pointer border border-white outline-0 p-2 rounded hover:bg-[#99FFAF] hover:text-[black] hover:border-[none] ">
            Choose profile pic
            <input
              type="file"
              // value={file}
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </label>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="mt-2 h-[100px] w-[100px] self-center object-cover rounded"
            />
          )}

          <button className="bg-[#99FFAF] mt-3 text-black cursor-pointer text-[18px] font-bold p-2 rounded">
            Signup
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

          <span className="text-center">
            Already have an account?{" "}
            <Link className="text-[#99FFAF] font-semibold" to={"/login"}>
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
