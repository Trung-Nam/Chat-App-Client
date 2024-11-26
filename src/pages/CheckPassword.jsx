import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
const CheckPassword = () => {
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {

      const response = await axiosInstance({
        method: 'POST',
        url: "/password",
        data: {
          userId: location?.state?._id,
          password: password,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response?.data?.message);
        setPassword("")

        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className='bg-white w-full max-w-md rounded-lg mx-2 overflow-hidden p-4 py-8 md:mx-auto mt-20'>

        <div className="w-fit mx-auto my-3">
          <Avatar
            width={80}
            height={80}
            name={location?.state?.name}
            imgUrl={location?.state?.profile_pic}
          />
        </div>

        <h3 className="flex justify-center items-center text-2xl font-bold">{location?.state?.name}</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>

          <div className="flex flex-col gap-1 items-start">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-3 focus:outline-primary w-full rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>




          <button className="bg-primary text-lg font-bold px-4 py-3 rounded text-white my-8 hover:bg-secondary">
            Login
          </button>
        </form>

        <p className="flex justify-center items-center">
          <Link to={"/forgot-password"} className="text-primary font-semibold hover:text-secondary hover:underline">Forgot password ?</Link>
        </p>
      </div>
    </div>
  )
}

export default CheckPassword