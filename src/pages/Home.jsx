import { Outlet } from 'react-router-dom'

const Home = () => {
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