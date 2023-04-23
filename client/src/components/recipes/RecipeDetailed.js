import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { getToken, userTokenFunction, isAuthenticated, getUserID } from '../../helpers/auth'
import { useParams, Link, useNavigate, useFetcher } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDisplay, faHeart as liked } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'

const RecipeDetailed = () => {
  const [error, setError] = useState('')
  const [recipe, setRecipe] = useState()
  const [likes, setLikes] = useState([])
  const [list, setList] = useState([])
  const [recipeList, setRecipeList] = useState([])
  const [isActive, setIsActive] = useState({
    method: true,
    ingredients: false,
  })

  const { recipeId } = useParams()

  const [showMethod, setShowMethod] = useState(true)
  const [showIngredients, setShowIngredients] = useState(false)
  const ingredientsRef = useRef(null)
  const methodRef = useRef(null)

  // Get data on mount
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/recipes/${recipeId}/`)
        setRecipe(data)
      } catch (err) {
        setError(err.response.data.message)
      }
    }
    getData()

    // Set lists: if falsey, empty array
    const initialList = localStorage.getItem('SHOPPING-LIST') ? JSON.parse(localStorage.getItem('SHOPPING-LIST')) : []
    setList(initialList)

    const initialRecipeList = localStorage.getItem('RECIPE-LIST') ? JSON.parse(localStorage.getItem('RECIPE-LIST')) : []
    setRecipeList(initialRecipeList)

  }, [])

  // Initially set likes and recipe like counts
  useEffect(() => {
    const likedRecipes = []
    if (recipe) {
      if (recipe.likes_received.map(user => user.id).includes(getUserID())) {
        likedRecipes.push(getUserID())
      }
      setLikes(likedRecipes)
    }
  }, [recipe])

  // Handle like
  const handleLike = (value) => {
    if (likes) {
      if (likes.includes(value)) {
        setLikes(likes.filter(likeId => likeId !== value))
      } else {
        setLikes([...likes, value])
      }
      postLike(value)
    }
  }

  const postLike = async () => {
    const requestBody = {
      'liked_recipe_id': recipeId,
    }
    try {
      await axios.post(`/api/recipes/${recipeId}/`, requestBody, userTokenFunction())
    } catch (err) {
      setError(err)
    }
  }

  const handleAddToShoppingList = () => {
    if (recipe.ingredients) {
      const ingredientsToAdd = recipe.ingredients.map(ingredient => {
        const { detail = ingredient['ingredient_detail'], unit, qty } = ingredient
        const { name, plural, substitutes, id } = detail

        const itemObject = {}
        const existingIndex = list.findIndex(ingredient => ingredient.name === name && ingredient.unit === unit)
        if (existingIndex !== -1) {
          const existingItem = list[existingIndex]
          itemObject.qty = qty ? parseInt(qty) + parseInt(existingItem.qty) : qty
          list.splice(existingIndex, 1)
        } else {
          itemObject.qty = qty ? parseInt(qty) : qty
        }
        itemObject.unit = unit
        itemObject.name = name
        itemObject.plural = plural
        itemObject.substitutes = substitutes
        itemObject.id = id

        return itemObject
      })

      const newList = [...list, ...ingredientsToAdd]

      setList(newList)

      const newRecipeList = recipeList.map(recipe => recipe.id).includes(recipe.id) ?
        recipeList
        :
        [...recipeList, { id: recipe.id, name: recipe.name, image: recipe.image }]

      setRecipeList(newRecipeList)
    }
  }

  useEffect(() => {
    localStorage.setItem('SHOPPING-LIST', JSON.stringify(list))
    localStorage.setItem('RECIPE-LIST', JSON.stringify(recipeList))
  }, [list])

  const displayIngredients = () => {
    if (recipe.ingredients) {
      return recipe.ingredients.map((ingredient, i) => {
        const { detail = ingredient['ingredient_detail'], unit, qty } = ingredient
        const { name, plural } = detail
        return (
          <div key={i} >
            <div id="recipe-ingredient-qty">
              {qty ? Math.round(qty, 0) : ''}
            </div>
            <div id="recipe-ingredient-unit">
              {unit}
            </div>
            <div id="recipe-ingredient-name">
              {qty > 1 ? plural : name}
            </div>
          </div>
        )
      })
    }
  }

  const displayMethod = () => {
    if (recipe.method) {
      const splitMethod = recipe.method.split('.')
      return splitMethod.map((step, i) => {
        return (
          <div key={i} id="recipe-method-step">
            {step}.
          </div>
        )
      })
    }
  }

  // Show/Hide Display & Ingredients
  const handleShowIngredients = () => {
    setShowIngredients(true)
    setShowMethod(false)
    ingredientsRef.current.style.display = 'block'
    methodRef.current.style.display = 'none'
    setIsActive({
      method: false,
      ingredients: true,
    })
  
  }

  const handleShowMethod = () => {
    setShowIngredients(false)
    setShowMethod(true)
    ingredientsRef.current.style.display = 'none'
    methodRef.current.style.display = 'block'
    setIsActive({
      method: true,
      ingredients: false,
    })
  
  }

  return (
    <main>
      {recipe ?
        <>
          <section id="hero" style={{ backgroundImage: `url("${recipe.image}")` }}>
            <h1>{recipe.name}</h1>
            <div>{recipe.description}</div>
            <div id="feed-recipe-origin">{recipe.continent}</div>
          </section>
          <div id="post-owner">
            <div id="post-recipe-owner">{recipe.owner.username}</div>
            <div id="post-owner-img">
              <img src={recipe.owner.profile_image} />
            </div>
          </div>
          <div id="recipe-content">
            <div id="content-top-row">
              <div id="recipe-likes-content">
                <button id="feed-like-button" onClick={() => handleLike(getUserID())} disabled={!isAuthenticated()}>
                  {
                    likes.includes(getUserID()) ?
                      <FontAwesomeIcon icon={liked} id="feed-liked" />
                      :
                      <FontAwesomeIcon icon={faHeart} />
                  }
                </button>
              </div>
              <div id="feed-dietary">
                {recipe.is_vegetarian ?
                  <div id="feed-vegetarian">V</div>
                  :
                  ''
                }
                {recipe.is_vegan ?
                  <div id="feed-vegan">Ve</div>
                  :
                  ''
                }
                {recipe.is_glutenFree ?
                  <div id="feed-gluten-free">GF</div>
                  :
                  ''
                }
              </div>
            </div>
          </div>
          <section id="recipe-view-buttons">
            <button id="method-view-button" className={isActive.method ? 'view-button active' : 'view-button'} onClick={handleShowMethod}>Method</button>
            <button id="ingredients-view-button" className={isActive.ingredients ? 'view-button active' : 'view-button'} onClick={handleShowIngredients}>Ingredients</button>
          </section>
          <section id="recipe-details">
            <section id="recipe-method" ref={methodRef} style={{ display: showMethod ? 'block' : 'none' }}>
              {recipe && displayMethod()}
            </section>
            <section id="recipe-ingredients" ref={ingredientsRef} style={{ display: showIngredients ? 'block' : 'none' }}>
              {recipe && displayIngredients()}
              <button id="add-to-shopping-list" onClick={() => handleAddToShoppingList()}>
                Add to shopping list
              </button>
            </section>
          </section>
        </>
        :
        <>
        </>
      }
    </main>
  )
}

export default RecipeDetailed
