import { Outlet, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../redux/userSlice';

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("redux user", user);


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

      if (response.data.logout) {
        dispatch(logout());
        navigate('/email');
      }

      console.log(response);

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <>
      Home

      <section>
        <Outlet />
      </section>
    </>
  )
}

export default Home