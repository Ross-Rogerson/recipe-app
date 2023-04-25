import { useEffect, useState } from 'react'
import axios from 'axios'
import { userTokenFunction, isAuthenticated } from '../../helpers/auth'
import { useParams, useNavigate } from 'react-router-dom'

const EditRecipe = () => {
  const [error, setError] = useState('')
  const [recipe, setRecipe] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [nutritionData, setNutritionData] = useState({
    calories: '',
    fat: '',
    saturates: '',
    sugars: '',
    salt: '',
    protein: '',
    carbohydrates: '',
    fibre: '',
  })
  const [standardData, setStandardData] = useState({
    name: '',
    description: '',
    continent: '',
    serves: '',
    cook_time: '',
    image: '',
    method: '',
  })
  const [recipeIngredients, setRecipeIngredients] = useState([])

  const navigate = useNavigate()
  const { recipeId } = useParams()

  useEffect(() => {
    !isAuthenticated() && navigate('/login')
  }, [navigate])

  // Get ingredient data on mount
  useEffect(() => {
    const getIngredients = async () => {
      try {
        const { data } = await axios.create(userTokenFunction()).get(`/api/recipes/${recipeId}/edit`)
        setRecipe(data.recipe)
        setIngredients(data.ingredients)

      } catch (err) {
        setError(err.response.data.message)
      }
    }
    getIngredients()
  }, [])

  useEffect(() => {
    setRecipeIngredients(recipe.ingredients)

    // validation to remove null values
    const initialNutritionData = {
      ...nutritionData,
      calories: recipe.calories ? recipe.calories : '',
      carbohydrates: recipe.carbohydrates ? recipe.carbohydrates : '',
      fat: recipe.fat ? recipe.fat : '',
      fibre: recipe.fibre ? recipe.fibre : '',
      protein: recipe.protein ? recipe.protein : '',
      salt: recipe.salt ? recipe.salt : '',
      saturates: recipe.saturates ? recipe.saturates : '',
      sugars: recipe.sugars ? recipe.sugars : '',
    }
    setNutritionData(initialNutritionData)

    const initialStandardData = {
      ...standardData,
      name: recipe.name,
      description: recipe.description,
      continent: recipe.continent,
      serves: recipe.serves,
      cook_time: recipe.cook_time,
      image: recipe.image,
      method: recipe.method,
    }
    setStandardData(initialStandardData)
  }, [recipe])

  const handleIngredientChange = (e, index) => {
    // If new additional ingredient, add ingredient object to recipeIngredients array so all fields are created
    const newIngredientArray = index > recipeIngredients.length - 1 ?
      [...recipeIngredients, { ingredient_detail: '', qty: '', unit: '' }]
      :
      recipeIngredients

    // Find and update correct ingredient object
    const updatedIngredients = newIngredientArray.map((item, i) => {
      if (i === index) {
        if (e.target.name === 'qty') {
          return { ...item, [e.target.name]: parseFloat(e.target.value) }
        } else if (e.target.name === 'ingredient_detail') {
          const lowercase = e.target.value.toLowerCase()
          const ingredientObject = ingredients.filter(ingredient => ingredient.name === lowercase)[0]
          return { ...item, 
            [e.target.name]: ingredientObject,
          }
        } else {
          return { ...item, [e.target.name]: e.target.value }
        }
      }
      return item
    })
    setRecipeIngredients(updatedIngredients)
  }

  const generateIngredientsForm = () => {
    if (recipeIngredients) {
      return [...recipeIngredients, { ingredient_detail: '', qty: '', unit: '' }].map((recipeIngredient, index) => {
        const { name = recipeIngredient['ingredient_detail'].name, qty, unit } = recipeIngredient
        const capitalised = name ? name.charAt(0).toUpperCase() + name.slice(1) : ''
        const rounded = !qty ? qty : Number.isInteger(qty / 1) ? parseInt(qty) : qty
        return (
          <div id="ingredient-div" key={index}>
            <label id="ingredient-label">Ingredient {index + 1}
            </label>
            <label id="name-label">Name</label>
            <select id="ingredient-select" name="ingredient_detail" value={recipeIngredients.ingredient_detail} defaultValue={capitalised} onChange={(e) => handleIngredientChange(e, index)}>
              <option>-- Select Ingredient --</option>
              {ingredients.length > 0 &&
                ingredients.map(ingredient => ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)).sort().map(name => {
                  return <option key={name} value={name} >{name}</option>
                })}
            </select>
            <label>Unit
            </label>
            <select id="unit-select" name="unit" value={recipeIngredients.ingredient_unit} defaultValue={unit} onChange={(e) => handleIngredientChange(e, index)}>
              <option>-- Select Unit --</option>
              <option value='g' >g</option>
              <option value='kg' >kg</option>
              <option value='ml' >ml</option>
              <option value='l' >l</option>
              <option value='cm' >cm</option>
              <option value='tsp' >tsp</option>
              <option value='tbsp' >tbsp</option>
              <option value='sprig(s)' >Sprigs</option>
              <option value='bunch(es)' >Bunches</option>
              <option value='handful(s)' >Handfuls</option>
              <option value='stick(s)' >Sticks</option>
              <option value='pinch(es)' >Pinches</option>
              <option value='' >-</option>
            </select>
            <label>Qty/Weight
            </label>
            <input id="qty-select" type="text" name="qty" pattern="[0-9]*\.?[0-9]+" placeholder="Enter amount" value={recipeIngredients.qty} defaultValue={rounded} onChange={(e) => handleIngredientChange(e, index)} />
          </div>
        )
      })
    }
  }

  const handleStandardChange = (e) => {
    setStandardData({ ...standardData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleNutritionChange = (e) => {
    setNutritionData({ ...nutritionData, [e.target.name]: e.target.value })
    setError('')
  }

  // ! Submit Edit
  const submitEdit = async (e) => {
    e.preventDefault()
    // Create Mapping for ingredients to their IDs
    const ingredientMap = {}
    recipeIngredients.forEach(ingredient => {
      const { detail = ingredient['ingredient_detail'] } = ingredient
      const { name, id } = detail
      ingredientMap[name] = id
    })

    // Replace ingredient names with ids
    const ingredientsBody = recipeIngredients.map(ingredient => {
      return { ...ingredient, ingredient_detail: ingredientMap[ingredient.ingredient_detail.name] }
    })

    // Create request body
    const editBody = { ...standardData, ...nutritionData, ingredients: ingredientsBody }

    try {
      await axios.put(`/api/recipes/${recipeId}/edit/`, editBody, userTokenFunction())
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  return (
    <main>
      <h1>Edit recipe</h1>
      <form id="editForm" onSubmit={submitEdit}>
        <section id="standard-form">
          <label>Name</label>
          <input type="text" name="name" placeholder="Recipe name" value={standardData.name} onChange={handleStandardChange} />
          <label>Description</label>
          <input type="text" name="description" placeholder="Recipe description" value={standardData.description} onChange={handleStandardChange} />
          <label>Continent of Origin</label>
          <select name="continent" value={standardData.continent} onChange={handleStandardChange} >
            <option >-- Select Continent --</option>
            <option value='Africa' >Africa</option>
            <option value='Antarctica' >Antarctica</option>
            <option value='Asia' >Asia</option>
            <option value='Australasia' >Australasia</option>
            <option value='Europe' >Europe</option>
            <option value='North America' >North America</option>
            <option value='South America' >South America</option>
          </select>
          <label>Serves</label>
          <input type="text" name="serves" placeholder="Serves" value={standardData.serves} onChange={handleStandardChange} />
          <label>Prep Time</label>
          <input type="text" name="cook_time" placeholder="Prep time (include cooking time)" value={standardData.cook_time} onChange={handleStandardChange} />
          <label>Image</label>
          <input type="text" name="image" placeholder="Image URL" value={standardData.image} onChange={handleStandardChange} />
          <span>
            <label>Method</label>
            <textarea type="text" name="method" placeholder="Recipe method..." value={standardData.method} onChange={handleStandardChange} />
          </span>
        </section>
        <section id="ingredients-form">
          {generateIngredientsForm()
          }
        </section>
        <section id="nutrition-form">
          <label>Calories</label>
          <input type="text" name="calories" placeholder="Enter amount (kcal)" value={nutritionData.calories} onChange={handleNutritionChange} />
          <label>Fat</label>
          <input type="text" name="fat" placeholder="Enter amount (g)" value={nutritionData.fat} onChange={handleNutritionChange} />
          <label>Saturates</label>
          <input type="text" name="saturates" placeholder="Enter amount (g)" value={nutritionData.saturates} onChange={handleNutritionChange} />
          <label>Sugars</label>
          <input type="text" name="sugars" placeholder="Enter amount (g)" value={nutritionData.sugars} onChange={handleNutritionChange} />
          <label>Salt</label>
          <input type="text" name="salt" placeholder="Enter amount (g)" value={nutritionData.salt} onChange={handleNutritionChange} />
          <label>Protein</label>
          <input type="text" name="protein" placeholder="Enter amount (g)" value={nutritionData.protein} onChange={handleNutritionChange} />
          <label>Carbohydrates</label>
          <input type="text" name="carbohydrates" placeholder="Enter amount (g)" value={nutritionData.carbohydrates} onChange={handleNutritionChange} />
          <label>Fibre</label>
          <input type="text" name="fibre" placeholder="Enter amount (g)" value={nutritionData.fibre} onChange={handleNutritionChange} />
        </section>
        <button id="submitEdit" type="submit">Submit edit</button>
      </form>
    </main >
  )
}

export default EditRecipe
