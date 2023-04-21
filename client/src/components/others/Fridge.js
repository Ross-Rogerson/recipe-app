import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { getToken, removeToken } from '../../helpers/auth'
import { useParams, Link, useNavigate } from 'react-router-dom'

const Fridge = () => {
  const [error, setError] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [fridgeItems, setFridgeItems] = useState([])
  const [filteredIngredients, setFilteredIngredients] = useState([])
  const [filters, setFilters] = useState({
    category: 'All',
    search: '',
  })
  const [recipeRequest, setRecipeRequest] = useState({})

  const [showRecipes, setShowRecipes] = useState(false)
  const [showIngredients, setShowIngredients] = useState(true)
  const [showFridge, setShowFridge] = useState(true)
  const recipesRef = useRef(null)
  const fridgeRef = useRef(null)
  const ingredientsRef = useRef(null)

  // Get ingredients data on mount
  useEffect(() => {
    const getIngredients = async () => {
      try {
        const { data } = await axios.get('/api/fridge/')
        setIngredients(data)
      } catch (err) {
        console.log('error', err)
        setError(err.response.data.message)
      }
    }
    getIngredients()

    // Set lists: if falsey, empty array
    const initialList = localStorage.getItem('FRIDGE-ITEMS') ? JSON.parse(localStorage.getItem('FRIDGE-ITEMS')) : []
    setFridgeItems(initialList)

    // Set recipe request
    const initialRecipeRequest = initialList.reduce((obj, item) => {
      obj[item.name] = item.id
      return obj
    }, {})
    
    setRecipeRequest(initialRecipeRequest)
  }, [])

  // Display Ingredients on mount
  const displayIngredients = () => {
    return (
      filteredIngredients.map(ingredient => {
        const { name, plural, id, category } = ingredient
        return (
          <button key={id} id="fridge-inrgedient-button" onClick={() => handleAddToFridge(ingredient)} className={fridgeItems.map(item => item.id).includes(id) ? 'selected' : ''}>
            <h3 id="fridge-inrgedient-name">{plural}</h3>
            <h4 id="fridge-inrgedient-cat">{category}</h4>
          </button>
        )
      })
    )
  }

  // Show/Hide  Ingredients/Fridge/Recipes
  const handleShowIngredients = () => {
    setShowIngredients(true)
    setShowRecipes(false)
    setShowFridge(false)
    recipesRef.current.style.display = 'none'
    ingredientsRef.current.style.display = 'block'
    fridgeRef.current.style.display = 'none'
  }

  const handleShowRecipes = () => {
    setShowIngredients(false)
    setShowRecipes(true)
    setShowFridge(false)
    recipesRef.current.style.display = 'block'
    ingredientsRef.current.style.display = 'none'
    fridgeRef.current.style.display = 'none'
  }

  const handleShowFridge = () => {
    setShowIngredients(false)
    setShowRecipes(false)
    setShowFridge(true)
    recipesRef.current.style.display = 'none'
    ingredientsRef.current.style.display = 'none'
    fridgeRef.current.style.display = 'block'
  }

  // Filters
  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
  }

  useEffect(() => {
    const regex = new RegExp(filters.search, 'i')
    const newFilteredIngredients = ingredients.filter(ingredient => {
      return regex.test(ingredient.name) && (ingredient.category === filters.category || filters.category === 'All')
    }).sort((a, b) => a.name > b.name ? 1 : -1)
    setFilteredIngredients(newFilteredIngredients)
  }, [filters, ingredients])

  // Add to fridge
  const handleAddToFridge = (item) => {
    if (fridgeItems.map(fridgeItem => fridgeItem.id).includes(item.id)) {
      setFridgeItems(fridgeItems.filter(fridgeItem => fridgeItem.id !== item.id))
      const newRecipeRequest = { ...recipeRequest }
      delete newRecipeRequest[item.name]
      setRecipeRequest(newRecipeRequest)
    } else {
      setFridgeItems([...fridgeItems, item])
      setRecipeRequest({ ...recipeRequest, [item.name]: item.id })
    }
  }

  // Display fridge
  const displayFridgeItems = () => {
    if (fridgeItems.length === 0) {
      return <div id="no-items-in-fridge">Your fridge is empty. Add items in the Ingredients section.</div>
    }
    return (
      fridgeItems.map(item => {
        const { name, plural, id, category } = item
        return (
          <div key={id} id="fridge-item-button" >
            <button id="remove-ingredient-button" onClick={() => handleAddToFridge(item)}>Remove</button>
            <h3 id="fridge-item-name">{plural}</h3>
            <h4 id="fridge-item-cat">{category}</h4>
          </div>
        )
      })
    )
  }

  useEffect(() => {
    localStorage.setItem('FRIDGE-ITEMS', JSON.stringify(fridgeItems))
    console.log('FRIDGE ITEMS ->', fridgeItems)
    if (fridgeItems.length === 0) {
      setRecipes([])
    } else {
      const getRecipes = async () => {
        try {
          const { data } = await axios.post('/api/fridge/', recipeRequest)
          console.log('RECIPES ->', data)
          setRecipes(data)
        } catch (err) {
          setError(err)
        }
      }
      getRecipes()
    }
  }, [fridgeItems])

  useEffect(() => {
    console.log('RECIPES ->', recipes)
  }, [recipes])

  const displayRecipes = () => {
    if (fridgeItems.length === 0) {
      return <div id="no-recipes">Add ingredients to fridge to find recipes.</div>
    }

    if (recipes.length === 0) {
      return <div id="no-recipes">None of our recipes contained all of the items in your fridge.</div>
    }

    return recipes.map(recipe => {
      const { name, id, image } = recipe
      return (
        <Link key={id} to={`/recipes/${id}/`}>
          <div id="recipe-in-fridge" >
            <div id="fridge-recipe-img">
              <img src={image} alt={name} />
            </div>
            <div id="firdge-recipe-name">
              {name}
            </div>
          </div>
        </Link>
      )
    })
  }

  const handleEmptyFridge = () => {
    setRecipeRequest({})
    setRecipes([])
    setFridgeItems([])
  }

  return (
    <main>
      {
        <>
          <section id="fridge-view-buttons">
            <button id="ingredients-list-button" onClick={handleShowIngredients}>Ingredients</button>
            <button id="fridge-ingredients-view-button" onClick={handleShowFridge}>Fridge</button>
            <button id="recipe-view-button" onClick={handleShowRecipes}>Recipes</button>
          </section>
          <section id='fridge-ingredients' ref={ingredientsRef} style={{ display: showIngredients ? 'block' : 'none' }}>
            <section className="fridge-filters">
              <select name="category" value={filters.category} onChange={handleChange}>
                <option value="All">All</option>
                {ingredients &&
                  [...new Set(ingredients.map(ingredient => ingredient.category))].sort().map(category => {
                    return <option key={category} value={category}>{category}</option>
                  })}
              </select>
              <input type="text" name="search" placeholder='Search...' onChange={handleChange} value={filters.search} />
              <button id="thats-everything-button">That&#39;s everything!</button>
              <button id="ingredients-empty-fridge-button" alt="clear selections" onClick={handleEmptyFridge}>Empty fridge</button>
            </section>
            {ingredients && displayIngredients()}
          </section>
          <section id="fridge-items-in" ref={fridgeRef} style={{ display: showFridge ? 'block' : 'none' }}>
            <div id="fridge-buttons">
              {
                fridgeItems.length > 0 ?
                  <button id="empty-fridge-button" alt="clear selections" onClick={handleEmptyFridge}>Empty fridge</button>
                  :
                  ''
              }
            </div>
            {ingredients && displayFridgeItems()}
          </section>
          <section id="fridge-recipes" ref={recipesRef} style={{ display: showRecipes ? 'block' : 'none' }}>
            {ingredients && displayRecipes()}
          </section>
        </>
      }
    </main >
  )
}

export default Fridge
