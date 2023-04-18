import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/common/Navbar'
import FooterNavbar from './components/common/FooterNavbar'
import Login from './components/auth/login'
import Profile from './components/profile/profile'

const App = () => {
  return (
    <div id="wrapper">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/Recipes" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile/:userId/" element={<Profile />} />
        </Routes>
        <FooterNavbar />
      </BrowserRouter>
    </div>
  )
}

export default App
