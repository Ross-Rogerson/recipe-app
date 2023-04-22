import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { getToken, removeToken, userTokenFunction, isAuthenticated, getUserID } from '../../helpers/auth'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'

const Profile = () => {
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [ownedRecipes, setOwnedRecipes] = useState([])
  const [likedRecipes, setLikedRecipes] = useState([])

  const { userId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [showOwnedRecipes, setShowOwnedRecipes] = useState(false)
  const [showLikedRecipes, setShowLikedRecipes] = useState(true)
  const likedRecipesRef = useRef(null)
  const ownedRecipesRef = useRef(null)

  useEffect(() => {
    console.log(getUserID()) &
      !isAuthenticated() && navigate('/login')
  }, [navigate])

  // Get profile data on mount
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.create(userTokenFunction()).get(`/api/profile/${getUserID()}`)
        setProfileData(data)
        setLikedRecipes(data.liked_by_user)
        setOwnedRecipes(data.recipes)
        console.log(data)

      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [])

  // Logout
  const handleLogOut = () => {
    (location.pathname === '/admin' || location.pathname === `/profile/${userId}/`) ?
      navigate('/recipes/')
      :
      navigate(location)
    removeToken()
  }

  // Show/Hide Display & Ingredients
  const handleShowOwnedRecipes = () => {
    setShowOwnedRecipes(true)
    setShowLikedRecipes(false)
    likedRecipesRef.current.style.display = 'none'
    ownedRecipesRef.current.style.display = 'block'
  }

  const handleShowLikedRecipes = () => {
    setShowOwnedRecipes(false)
    setShowLikedRecipes(true)
    likedRecipesRef.current.style.display = 'block'
    ownedRecipesRef.current.style.display = 'none'
  }

  const displayLikedRecipes = () => {
    return likedRecipes.map(recipe => {
      const { name, id, image } = recipe
      return (
        <Link key={id} to={`/recipes/${id}/`}>
          <div id="recipe-on-list" >
            <div id="shopping-list-recipe-img">
              <img src={image} alt={name} />
            </div>
            <div id="shopping-list-recipe-name">
              {name}
            </div>
          </div>
        </Link>
      )
    })
  }

  const handleDelete = async (id) => {
    const requestBody = {
      'recipe_id': id,
    }
    try {
      await axios.delete(`/api/profile/${getUserID()}/`, { data: requestBody, ...userTokenFunction() })
    } catch (err) {
      setError(err)
    }
  }

  const displayOwnedRecipes = () => {
    return ownedRecipes.map(recipe => {
      const { name, id, image } = recipe
      return (
        <div key={id} id="owned-recipe">
          <Link to={`/recipes/${id}/`}>
            <div id="owned-recipe-img">
              <img src={image} alt={name} />
            </div>
            <div id="owned-recipe-name">
              {name}
            </div>
          </Link>
          <button id="delete-recipe-btn" onClick={() => handleDelete(id)}>Delete</button>
          <Link id="edit-recipe-btn" to={`/recipes/${id}/edit`}>
            <div id="edit-recipe-div" >Edit</div>
          </Link>
        </div >
      )
    })
  }

  return (
    <main>
      {profileData &&
        <>
          <h1>Profile Page</h1>
          <section id="shopping-view-buttons">
            <button id="shopping-list-view-button" onClick={handleShowOwnedRecipes}>Owned Recipes</button>
            <button id="recipe-view-button" onClick={handleShowLikedRecipes}>Liked Recipes</button>
          </section>
          <section id="recipes-display">
            <section id="liked-recipes" ref={likedRecipesRef} style={{ display: showLikedRecipes ? 'block' : 'none' }}>
              {displayLikedRecipes()}
            </section>
            <section id="owned-recipes" ref={ownedRecipesRef} style={{ display: showOwnedRecipes ? 'block' : 'none' }}>
              {displayOwnedRecipes()}
            </section>
          </section>
          <button onClick={handleLogOut}>Logout</button>
        </>

      }
    </main >
  )
}

export default Profile
