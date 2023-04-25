import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { userTokenFunction, isAuthenticated, getUserID } from '../../helpers/auth'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'

const Profile = () => {
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [ownedRecipes, setOwnedRecipes] = useState([])
  const [likedRecipes, setLikedRecipes] = useState([])
  const [isActive, setIsActive] = useState({
    owned: true,
    liked: false,
  })

  const navigate = useNavigate()

  const [showOwnedRecipes, setShowOwnedRecipes] = useState(true)
  const [showLikedRecipes, setShowLikedRecipes] = useState(false)
  const likedRecipesRef = useRef(null)
  const ownedRecipesRef = useRef(null)

  useEffect(() => {
    !isAuthenticated() && navigate('/login')
  }, [navigate])

  // Get profile data on mount
  useEffect(() => {
    if (getUserID()) {
      const getProfile = async () => {
        try {
          const { data } = await axios.create(userTokenFunction()).get(`/api/profile/${getUserID()}`)
          setProfileData(data)
          setLikedRecipes(data.liked_by_user)
          setOwnedRecipes(data.recipes)

        } catch (err) {
          setError(err.message)
        }
      }
      getProfile()
    }
  }, [])

  // Show/Hide Display & Ingredients
  const handleShowOwnedRecipes = () => {
    setShowOwnedRecipes(true)
    setShowLikedRecipes(false)
    likedRecipesRef.current.style.display = 'none'
    ownedRecipesRef.current.style.display = 'flex'
    setIsActive({
      owned: true,
      liked: false,
    })
  }

  const handleShowLikedRecipes = () => {
    setShowOwnedRecipes(false)
    setShowLikedRecipes(true)
    likedRecipesRef.current.style.display = 'flex'
    ownedRecipesRef.current.style.display = 'none'
    setIsActive({
      owned: false,
      liked: true,
    })
  }

  const displayLikedRecipes = () => {
    return likedRecipes.map(recipe => {
      const { name, id, image } = recipe
      return (
        <div id="liked-recipe" key={id} style={{ backgroundImage: `url('${image}')` }}>
          <Link id="liked-recipe-card" key={id} to={`/recipes/${id}/`}>
            <div id="liked-recipe-image" >
              <div id="liked-recipe-name">
                {name}
              </div>
            </div >
          </Link>
        </div>
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
        <div id="owned-recipe" key={id} >
          <div id="owned-recipe-image" style={{ backgroundImage: `url('${image}')` }}>
            <Link to={`/recipes/${id}/`}>
              <div id="owned-recipe-name">
                {name}
              </div>
            </Link>
          </div >
          <div id="profile-recipe-buttons">
            <button id="delete-recipe-btn" onClick={() => handleDelete(id)}>Delete</button>
            <Link id="edit-recipe-btn" to={`/recipes/${id}/edit/`}>
              <div id="edit-recipe-div" >Edit</div>
            </Link>
          </div>
        </div>
      )
    })
  }

  return (
    <main>
      {profileData &&
        <>
          <h1>Profile</h1>
          <section id="profile-view-buttons">
            <button id="owned-recipes-view-button" className={isActive.owned ? 'view-button active' : 'view-button'} onClick={handleShowOwnedRecipes}>Owned Recipes</button>
            <button id="liked-recipes-view-button" className={isActive.liked ? 'view-button active right' : 'view-button'} onClick={handleShowLikedRecipes}>Liked Recipes</button>
          </section>
          <section id="recipes-display">
            <section id="liked-recipes" ref={likedRecipesRef} style={{ display: showLikedRecipes ? 'flex' : 'none' }}>
              {displayLikedRecipes()}
            </section>
            <section id="owned-recipes" ref={ownedRecipesRef} style={{ display: showOwnedRecipes ? 'flex' : 'none' }}>
              {displayOwnedRecipes()}
            </section>
          </section>
        </>

      }
    </main >
  )
}

export default Profile
