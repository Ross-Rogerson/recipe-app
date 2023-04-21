import { useEffect, useState, useRef } from 'react'
import { Link, useFetcher, useNavigate } from 'react-router-dom'

const Shopping = () => {
  const [error, setError] = useState('')
  const [list, setList] = useState([])
  const [recipeList, setRecipeList] = useState([])
  const [itemsToRemove, setItemsToRemove] = useState([])
  const [checked, setChecked] = useState({})


  const [showRecipes, setShowRecipes] = useState(false)
  const [showShoppingList, setShowShoppingList] = useState(true)
  const recipesRef = useRef(null)
  const shoppingRef = useRef(null)

  useEffect(() => {
    // Set lists: if falsey, empty array
    const initialList = localStorage.getItem('SHOPPING-LIST') ? JSON.parse(localStorage.getItem('SHOPPING-LIST')) : []
    setList(initialList)

    const initialRecipeList = localStorage.getItem('RECIPE-LIST') ? JSON.parse(localStorage.getItem('RECIPE-LIST')) : []
    setRecipeList(initialRecipeList)
  }, [])

  useEffect(() => {
    console.log('SHOPPING LIST ->', list)
    console.log('RECIPES ->', recipeList)
  }, [list, recipeList])

  // Show/Hide Display & Ingredients
  const handleShowShoppingList = () => {
    setShowShoppingList(true)
    setShowRecipes(false)
    recipesRef.current.style.display = 'none'
    shoppingRef.current.style.display = 'block'
  }

  const handleShowRecipes = () => {
    setShowShoppingList(false)
    setShowRecipes(true)
    recipesRef.current.style.display = 'block'
    shoppingRef.current.style.display = 'none'
  }

  const handleSelectIngredient = (item) => {
    console.log(item)
    if (itemsToRemove.includes(item)) {
      setItemsToRemove(itemsToRemove.filter(itemId => itemId !== item))
    } else {
      setItemsToRemove([...itemsToRemove, item])
    }
    setChecked({ ...checked, [item.id]: !checked[item.id] })
  }

  useEffect(() => {
    console.log('ITEMS TO REMOVE->', itemsToRemove)
  }, [itemsToRemove])

  const displayShoppingList = () => {
    return list.map((item, i) => {
      const { name, plural, unit, qty, substitutes, id } = item
      return (
        <div id="shopping-list-item" key={i} >
          <input type="checkbox" id={`item${id}`} name={`item${id}`} onClick={() => handleSelectIngredient(item)} checked={checked[id]}/>
          <label id="shopping-list-item-qty" htmlFor={`item${id}`}>
            <div id="shopping-list-item-qty" >
              {qty ? Math.round(qty, 0) : ''}
            </div>
            <div id="shopping-list-item-unit">
              {(qty && !unit) ? `${unit} x` : unit}
            </div>
            <div id="shopping-list-item-name">
              {qty > 1 ? plural : name}
            </div>
          </label>
          <button>
            Substitutes
          </button>
          <div id="shopping-list-item-subs">
            {substitutes}
          </div>
        </div>
      )
    })
  }

  const displayRecipes = () => {
    return recipeList.map(recipe => {
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

  const handleRemoveSelected = () => {
    const newList = list.filter(item => {
      const existingIndex = itemsToRemove.findIndex(ingredient => ingredient.name === item.name 
        && ingredient.unit === item.unit)
      if (existingIndex === -1) return item
    })
    setList(newList)
    setItemsToRemove([])
    setChecked({})
  }

  useEffect(() => {
    localStorage.setItem('SHOPPING-LIST', JSON.stringify(list))
  }, [list])

  const handleClearList = () => {
    setList([])
    setRecipeList([])
    setItemsToRemove([])
    setChecked({})
    localStorage.setItem('SHOPPING-LIST', JSON.stringify([]))
    localStorage.setItem('RECIPE-LIST', JSON.stringify([]))
  }

  return (
    <main>
      <section id="shopping-view-buttons">
        <button id="shopping-list-view-button" onClick={handleShowShoppingList}>Shopping List</button>
        <button id="recipe-view-button" onClick={handleShowRecipes}>Recipes</button>
      </section>
      <section id="shopping-display">
        <section id="shopping-list" ref={shoppingRef} style={{ display: showShoppingList ? 'block' : 'none' }}>
          {displayShoppingList()}
          <button id="remove-selected-button" onClick={handleRemoveSelected}>
            Remove selected items
          </button>
          <button id="clear-list-button" onClick={handleClearList}>
            Clear shopping list
          </button>
        </section>
        <section id="shopping-recipes" ref={recipesRef} style={{ display: showRecipes ? 'block' : 'none' }}>
          {displayRecipes()}
        </section>
      </section>
    </main >
  )
}

export default Shopping
