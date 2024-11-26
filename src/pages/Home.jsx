import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import io from 'socket.io-client'
const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("user",user);
  
  useEffect(() => {
    fetchUserDetails();
  }, [])


  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: "/user-details",
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }

      // console.log(response);

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  // Socket connection

  useEffect(()=>{
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL,{
      auth : {
        token : localStorage.getItem('token')
      },
    })

    socketConnection.on('onlineUser',(data)=>{
      console.log(data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])
  


  const basePath = location.pathname === '/';

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${basePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>

      <section className={`${basePath && 'hidden'}`}>
        <Outlet />
      </section>

      <div className={`flex-col justify-center items-center gap-2 hidden ${!basePath ? 'hidden' : 'lg:flex'}`}>
        <div>
          <img
            src={'/assets/logo.png'}
            alt="logo"
            width={250}
          />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send messages</p>
      </div>
    </div>
  )
}

export default Home