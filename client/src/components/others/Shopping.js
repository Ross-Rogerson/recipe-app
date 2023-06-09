import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const Shopping = () => {
  const [list, setList] = useState([])
  const [recipeList, setRecipeList] = useState([])
  const [itemsToRemove, setItemsToRemove] = useState([])
  const [isActive, setIsActive] = useState({
    shopping: true,
    recipes: false,
  })

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

  // Show/Hide Display & Ingredients
  const handleShowShoppingList = () => {
    setShowShoppingList(true)
    setShowRecipes(false)
    recipesRef.current.style.display = 'none'
    shoppingRef.current.style.display = 'block'
    setIsActive({
      shopping: true,
      recipes: false,
    })
  }

  const handleShowRecipes = () => {
    setShowShoppingList(false)
    setShowRecipes(true)
    recipesRef.current.style.display = 'flex'
    shoppingRef.current.style.display = 'none'
    setIsActive({
      shopping: false,
      recipes: true,
    })
  }

  const handleSelectIngredient = (item) => {
    if (itemsToRemove.includes(item)) {
      setItemsToRemove(itemsToRemove.filter(itemId => itemId !== item))
    } else {
      setItemsToRemove([...itemsToRemove, item])
    }
  }

  const displayShoppingList = () => {
    return list.map((item, i) => {
      const { name, plural, unit, qty, substitutes, id } = item
      const margin = unit.length > 5 & unit !== ''
      const nameMargin = !unit & !qty
      const selected = itemsToRemove.includes(item)
      return (
        <div id="shopping-list-item" key={i} className={i}>
          <input type="checkbox" id={`item${id}`} name={`item${id}`} onChange={() => handleSelectIngredient(item)} checked={itemsToRemove.includes(item)} />
          <label id="shopping-list-item-details" htmlFor={`item${id}`}>
            <div id="shopping-list-item-qty" className={selected ? 'strikethrough' : ''} >
              {qty ? Math.round(qty, 0) : ''}
            </div>
            <div id="shopping-list-item-unit" className={margin & selected ? 'add-margin strikethrough' : margin ? 'add-margin' : selected ? 'strikethrough' : ''}>
              {unit}
            </div>
            <div id="shopping-list-item-name" className={!nameMargin & selected ? 'add-margin  strikethrough' : !nameMargin ? 'add-margin' : selected ? 'strikethrough' : ''}>
              {qty > 1 ? plural : name}
            </div>
          </label>
          <div id="substitutes-container">
            <button id="subs-button">
              {/* Substitutes */}
            </button>
          </div>
          <div id="shopping-list-item-subs" style={{ display: showShoppingList ? 'none' : 'none' }}>
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
          <div id="recipe-on-list" style={{ backgroundImage: `url('${image}')` }}>
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
    if (list.length === 0) setRecipeList([])
    setList(newList)
    setItemsToRemove([])
  }

  useEffect(() => {
    localStorage.setItem('SHOPPING-LIST', JSON.stringify(list))
  }, [list])

  const handleClearList = () => {
    setList([])
    setRecipeList([])
    setItemsToRemove([])
    localStorage.setItem('SHOPPING-LIST', JSON.stringify([]))
    localStorage.setItem('RECIPE-LIST', JSON.stringify([]))
  }

  return (
    <main>
      <section id="shopping-view-buttons">
        <button id="shopping-list-view-button" className={isActive.shopping ? 'view-button active' : 'view-button'} onClick={handleShowShoppingList}>Shopping List</button>
        <button id="recipe-view-button" className={isActive.recipes ? 'view-button active' : 'view-button'} onClick={handleShowRecipes}>Recipes</button>
      </section>
      <section id="shopping-display">
        <section id="shopping-list" ref={shoppingRef} style={{ display: showShoppingList ? 'block' : 'none' }}>
          {
            list.length > 0 ?
              <div id="clear-button-container">
                <button id="remove-selected-button" onClick={handleRemoveSelected}>
                  Remove
                </button>
                <button id="clear-list-button" onClick={handleClearList}>
                  Clear list
                </button>
              </div>
              :
              <div id="no-recipes">Your shopping list is currently empty.</div>
          }
          {displayShoppingList()}
        </section>
        <section id="shopping-recipes" ref={recipesRef} style={{ display: showRecipes ? 'flex' : 'none' }}>
          {
            list.length > 0 ?
              displayRecipes()
              :
              <div id="no-recipes">Find some recipes you like and add the ingredients to your shopping list!</div>
          }
        </section>
      </section>
    </main >
  )
}

export default Shopping
