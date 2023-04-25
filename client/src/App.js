import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/common/Navbar'
import FooterNavbar from './components/common/FooterNavbar'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Profile from './components/profile/Profile'
import RecipeDetailed from './components/recipes/RecipeDetailed'
import EditRecipe from './components/recipes/EditRecipe'
import AddRecipe from './components/recipes/AddRecipe'
import Fridge from './components/others/Fridge'
import Shopping from './components/others/Shopping'

const App = () => {
  return (
    <div id="wrapper">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Fridge/" element={<Fridge />} />
          <Route path="/Shopping/" element={<Shopping />} />
          <Route path="/Profile/:userId/" element={<Profile />} />
          <Route path="/Recipes/:recipeId/" element={<RecipeDetailed />} />
          <Route path="/Recipes/:recipeId/edit" element={<EditRecipe />} />
          <Route path="/Recipes/add/" element={<AddRecipe />} />

        </Routes>
        <FooterNavbar />
      </BrowserRouter>
    </div>
  )
}

export default App
