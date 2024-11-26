import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";
const CheckEmail = () => {
  const [email,setEmail] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    try {
      
      const response = await axiosInstance.post("/email", {email: email});
      console.log(response);
      
      if (response.data.success) {
        toast.success(response?.data?.message);
        setEmail("")
  
        navigate('/password',{
          state:response?.data?.data
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
    <div className='bg-white w-full max-w-md rounded-lg mx-2 overflow-hidden p-4 py-8 md:mx-auto mt-20'>
      
      <div className="w-fit mx-auto my-3">
        <PiUserCircle 
          size={80}
        />
      </div>
      
      <h3 className="flex justify-center items-center text-2xl font-bold">Welcome to Chat app!</h3>

      <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>

        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="bg-slate-100 px-2 py-3 focus:outline-primary w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

      


        <button className="bg-primary text-lg font-bold px-4 py-3 rounded text-white my-8 hover:bg-secondary">
          Let&apos;s go !
        </button>
      </form>

      <p className="flex justify-center items-center">
        Don&apos;t have account ?<Link to={"/register"} className="text-primary font-semibold hover:text-secondary hover:underline">Register</Link>
      </p>
    </div>
  </div>
  )
}

export default CheckEmail