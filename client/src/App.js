import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/common/Navbar'
import FooterNavbar from './components/common/FooterNavbar'

const App = () => {
  return (
    <div id="wrapper">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <FooterNavbar />
      </BrowserRouter>
    </div>
  )
}

export default App
