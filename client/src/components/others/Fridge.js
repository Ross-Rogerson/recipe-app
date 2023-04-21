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

  // useEffect(() => {
  //   const getRecipes = async () => {
  //     try {
  //       const { data } = await axios.post('/api/fridge/')
  //       console.log(data)
  //       setRecipes(data)
  //     } catch (err) {
  //       console.log('error', err)
  //       setError(err.response.data.message)
  //     }
  //   }
  //   getRecipes()
  // }, [])
  

  // Show/Hide Display & Ingredients
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

  const handleAddToFridge = (item) => {
    if (fridgeItems.map(fridgeItem => fridgeItem.id).includes(item.id)) {
      setFridgeItems(fridgeItems.filter(fridgeItem => fridgeItem.id !== item.id))
    } else {
      setFridgeItems([...fridgeItems, item])
    }
  }

  const displayFridgeItems = () => {
    return (
      fridgeItems.map(item => {
        const { name, plural, id, category } = item
        return (
          <button key={id} id="fridge-item-button" >
            <h3 id="fridge-item-name">{plural}</h3>
            <h4 id="fridge-item-cat">{category}</h4>
          </button>
        )
      })
    )
  }

  useEffect(() => {
    console.log(fridgeItems)
  }, [fridgeItems])

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
            <section className="filters">
              <select name="category" value={filters.category} onChange={handleChange}>
                <option value="All">All</option>
                {ingredients &&
                  [...new Set(ingredients.map(ingredient => ingredient.category))].sort().map(category => {
                    return <option key={category} value={category}>{category}</option>
                  })}
              </select>
              <input type="text" name="search" placeholder='Search...' onChange={handleChange} value={filters.search} />
              <button>
                That&#39;s everything!
              </button>
            </section>
            {ingredients && displayIngredients()}
          </section>
          <section id='fridge-items-in' ref={fridgeRef} style={{ display: showFridge ? 'block' : 'none' }}>
            {fridgeItems && displayFridgeItems()}
          </section>
          <section id='fridge-recipes' ref={recipesRef} style={{ display: showRecipes ? 'block' : 'none' }}>
            recipes
          </section>
        </>
      }
    </main >
  )
}

export default Fridge
