import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

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
  const [isActive, setIsActive] = useState({
    ingredients: true,
    fridge: false,
    recipes: false,
  })

  const [showRecipes, setShowRecipes] = useState(false)
  const [showIngredients, setShowIngredients] = useState(true)
  const [showFridge, setShowFridge] = useState(false)
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
        const capitalisedPlural = plural.charAt(0).toUpperCase() + plural.slice(1)
        const classCategory = category.replace(/\s+/g, '-').replace('&', '')
        return (
          <button key={id} id="fridge-inrgedient-button" onClick={() => handleAddToFridge(ingredient)} className={fridgeItems.map(item => item.id).includes(id) ? `selected-ingredient ${classCategory}` : `${classCategory}`}>
            <h3 id="fridge-inrgedient-name">{capitalisedPlural}</h3>
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
    setIsActive({
      ingredients: true,
      fridge: false,
      recipes: false,
    })
  }

  const handleShowRecipes = () => {
    setShowIngredients(false)
    setShowRecipes(true)
    setShowFridge(false)
    recipesRef.current.style.display = 'flex'
    ingredientsRef.current.style.display = 'none'
    fridgeRef.current.style.display = 'none'
    setIsActive({
      ingredients: false,
      fridge: false,
      recipes: true,
    })
  }

  const handleShowFridge = () => {
    setShowIngredients(false)
    setShowRecipes(false)
    setShowFridge(true)
    recipesRef.current.style.display = 'none'
    ingredientsRef.current.style.display = 'none'
    fridgeRef.current.style.display = 'block'
    setIsActive({
      ingredients: false,
      fridge: true,
      recipes: false,
    })
  }

  // Filters
  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
  }

  useEffect(() => {
    const regex = new RegExp(filters.search, 'i')
    const newFilteredIngredients = ingredients.filter(ingredient => {
      return regex.test(ingredient.name) && (ingredient.category === filters.category.toLowerCase() || filters.category === 'All')
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
        const { plural, id, category } = item
        const capitalisedPlural = plural.charAt(0).toUpperCase() + plural.slice(1)
        const classCategory = category.replace(/\s+/g, '-').replace('&', '')
        return (
          <button key={id} id="fridge-item-button" className={classCategory} onClick={() => handleAddToFridge(item)}>
            <h3 id="fridge-item-name">{capitalisedPlural}</h3>
          </button>
        )
      })
    )
  }

  useEffect(() => {
    localStorage.setItem('FRIDGE-ITEMS', JSON.stringify(fridgeItems))
    if (fridgeItems.length === 0) {
      setRecipes([])
    } else {
      const getRecipes = async () => {
        try {
          const { data } = await axios.post('/api/fridge/', recipeRequest)
          setRecipes(data)
        } catch (err) {
          setError(err)
        }
      }
      getRecipes()
    }
  }, [fridgeItems])

  const displayRecipes = () => {
    if (fridgeItems.length === 0) {
      return <div id="no-recipes">Add ingredients to the fridge to find recipes.</div>
    }

    if (recipes.length === 0) {
      return <div id="no-recipes">None of our recipes contained all of the items in your fridge.</div>
    }

    return recipes.map(recipe => {
      const { name, id, image } = recipe
      return (
        <Link key={id} id="fridge-recipe-img" to={`/recipes/${id}/`} style={{ backgroundImage: `url('${image}')` }}>
          <div id="recipe-in-fridge" >
            {name}
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
            <button id="ingredients-list-button" className={isActive.ingredients ? 'view-button active' : 'view-button'} onClick={handleShowIngredients}>Ingredients</button>
            <button id="fridge-ingredients-view-button" className={isActive.fridge ? 'view-button active' : 'view-button'} onClick={handleShowFridge}>Fridge</button>
            <button id="recipe-view-button" className={isActive.recipes ? 'view-button active' : 'view-button'} onClick={handleShowRecipes}>Recipes</button>
          </section>
          <section id='fridge-ingredients' ref={ingredientsRef} style={{ display: showIngredients ? 'block' : 'none' }}>
            <section id="fridge-search-buttons">
              <div id="fridge-filters">
                <select name="category" value={filters.category} onChange={handleChange}>
                  <option value="All">Search by category</option>
                  {ingredients &&
                    [...new Set(ingredients.map(ingredient => ingredient.category.charAt(0).toUpperCase() + ingredient.category.slice(1)))].sort().map(category => {
                      return <option key={category} value={category}>{category}</option>
                    })}
                </select>
                <input type="text" name="search" placeholder='Search ingredients...' onChange={handleChange} value={filters.search} />
                <button id="find-recipes-button" onClick={handleShowRecipes}>Find recipes!</button>
              </div>
            </section>
            <section id="ingredients-button-display">
              {ingredients && displayIngredients()}
            </section>
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
            <section id="fridge-items-display">
              {ingredients && displayFridgeItems()}
            </section>
          </section>
          <section id="fridge-recipes" ref={recipesRef} style={{ display: showRecipes ? 'flex' : 'none' }}>
            {ingredients && displayRecipes()}
          </section>
        </>
      }
    </main >
  )
}

export default Fridge
