import { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDisplay, faHeart as liked } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'
import { getUserID, isAuthenticated, getToken } from '../helpers/auth'

const Home = () => {
  const [recipes, setRecipes] = useState([])
  const [error, setError] = useState('')
  const [likes, setLikes] = useState([])
  const [likesReceivedCounts, setLikesReceivedCounts] = useState({})

  // Get data on mount
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/recipes/')
        setRecipes(data)
      } catch (err) {
        console.log('error', err)
        setError(err.response.data.message)
      }
    }
    getData()
  }, [])

  // Initially set likes and recipe like counts
  useEffect(() => {
    const likedRecipes = []
    recipes.forEach(recipe => {
      if (recipe.likes_received.map(like => like.id).includes(getUserID())) {
        likedRecipes.push(recipe.id)
      }
    })
    setLikes(likedRecipes)

    const initialLikesReceivedCounts = {}
    recipes.forEach(recipe => {
      initialLikesReceivedCounts[recipe.id] = recipe['likes_received'].length
    })
    setLikesReceivedCounts(initialLikesReceivedCounts)
  }, [recipes])

  // Handle like
  const handleLike = (value) => {
    if (likes.includes(value)) {
      setLikes(likes.filter((likeId) => likeId !== value))
      setLikesReceivedCounts({
        ...likesReceivedCounts,
        [value]: likesReceivedCounts[value] - 1,
      })
    } else {
      setLikes([...likes, value])
      setLikesReceivedCounts({
        ...likesReceivedCounts,
        [value]: likesReceivedCounts[value] + 1,
      })
    }
    postLike(value)
  }

  useEffect(() => {
    // postLike()
  }, [likes])

  const postLike = async (value) => {
    try {
      await axios.post('/api/recipes/',
        { 'liked_recipe_id': value },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
    } catch (err) {
      setError(err)
    }
  }

  return (
    <main>
      {recipes.length > 0 ?
        recipes.map(recipe => {
          const {
            id, name, description, continent, image, likesReceived = recipe['likes_received'],
            userImg = recipe.owner['profile_image'], username = recipe.owner.username, datePosted = recipe['date_posted'],
            vegan = recipe['is_vegan'], vegetarian = recipe['is_vegetarian'], glutenFree = recipe['is_gluten_free'] }
            = recipe
          const displayDate = new Date(datePosted).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          return (
            <div key={id} className="post" >
              <div id="post-owner">
                <div id="post-owner-img">
                  <img src={userImg} />
                </div>
                <div id="post-recipe-owner">{username}</div>
              </div>
              <Link to={`/${id}`}>
                <div id="recipe-image">
                  <img src={image} alt={name} />
                </div>
              </Link>
              <div id="recipe-content">
                <div id="content-top-row">
                  <div id="recipe-likes-content">
                    <button id="feed-like-button" value={id} onClick={() => handleLike(id)} disabled={!isAuthenticated()}>
                      {
                        likes.includes(id) ?
                          <FontAwesomeIcon icon={liked} id="feed-liked" />
                          :
                          <FontAwesomeIcon icon={faHeart} />
                      }
                    </button>
                    <div id="feed-like-count">{likesReceivedCounts[id]}</div>
                  </div>
                  <div id="feed-dietary">
                    {vegetarian ?
                      <div id="feed-vegetarian">V</div>
                      :
                      ''
                    }
                    {vegan ?
                      <div id="feed-vegan">Ve</div>
                      :
                      ''
                    }
                    {glutenFree ?
                      <div id="feed-gluten-free">GF</div>
                      :
                      ''
                    }
                  </div>
                </div>
                <div id="feed-recipe-name">{name}</div>
                {/* <div id="feed-recipe-origin">{continent}</div> */}
                <div id="feed-recipe-description">{description}</div>
                <div id="feed-recipe-date">{displayDate}</div>
              </div>
            </div>
          )
        })
        :
        <>
          {/* {console.log('error')} */}
        </>
      }
    </main>
  )
}

export default Home