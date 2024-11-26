import { useState } from "react"
import { IoCloudUploadOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom'
import uploadFile from "../utils/uploadFile";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  })

  const navigate = useNavigate();

  const [uploadPhoto, setUploadPhoto] = useState("");

  console.log(uploadPhoto);

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    try {
      if (uploadPhoto) {
        const result = await uploadFile(uploadPhoto);
  
        if (result) {
          data.profile_pic = result?.url;
        }
      }
  
      const response = await axiosInstance.post("/register", data);
  
      if (response.data.success) {
        toast.success(response?.data?.message);
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        });
  
        navigate('/email');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };


  return (
    <div className="mt-5">
      <div className='bg-white w-full max-w-md rounded-lg mx-2 overflow-hidden p-4 py-8 md:mx-auto mt-20'>
        <h3 className="flex justify-center items-center text-2xl font-bold">Welcome to Chat app!</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 items-start">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-3 focus:outline-primary w-full rounded"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1 items-start">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-3 focus:outline-primary w-full rounded"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1 items-start">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-3 focus:outline-primary w-full rounded"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>


          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="profile_pic" className="w-full flex flex-col justify-center items-start">
              Profile picture:
              <div className="h-14 w-full bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="flex text-md">
                  {uploadPhoto?.name ? uploadPhoto?.name :
                    (
                      <span className="flex justify-center items-center gap-3">
                        Choice Your Photo
                        <IoCloudUploadOutline
                          size={22}
                          className="mt-1"
                        />
                      </span>
                    )
                  }
                </p>
              </div>
            </label>

            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-3 focus:outline-primary hidden w-full"
              onChange={(e) => setUploadPhoto(e.target.files[0])}
            />
          </div>

          <button className="bg-primary text-lg font-bold px-4 py-3 rounded text-white my-8 hover:bg-secondary">
            Register Now
          </button>
        </form>

        <p className="flex justify-center items-center">
          Already have account ?<Link to={"/email"} className="text-primary font-semibold hover:text-secondary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register