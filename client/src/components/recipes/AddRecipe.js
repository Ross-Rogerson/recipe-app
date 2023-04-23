import { useEffect, useState } from 'react'
import axios from 'axios'
import { userTokenFunction, isAuthenticated } from '../../helpers/auth'
import { useNavigate } from 'react-router-dom'

const AddRecipe = () => {
  const [error, setError] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [ingredientCount, setIngredientCount] = useState()
  const [recipeNutrition, setRecipeNutrition] = useState({
    calories: '',
    fat: '',
    saturates: '',
    sugars: '',
    salt: '',
    protein: '',
    carbohydrates: '',
    fibre: '',
  })
  const [recipeStandard, setRecipeStandard] = useState({
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

  useEffect(() => {
    !isAuthenticated() && navigate('/login')
  }, [navigate])

  // Get ingredients data on mount
  useEffect(() => {
    const getIngredients = async () => {
      try {
        const { data } = await axios.create(userTokenFunction()).get('/api/recipes/add/')
        setIngredients(data)
      } catch (err) {
        setError(err.response.data.message)
      }
    }
    getIngredients()
  }, [])

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
        } else {
          return { ...item, [e.target.name]: e.target.value }
        }
      }
      return item
    })
    setRecipeIngredients(updatedIngredients)
  }

  useEffect(() => {
    setIngredientCount(recipeIngredients.length + 1)
  }, [recipeIngredients])

  const generateIngredientsForm = () => {
    return [...Array(ingredientCount)].map((_, index) => {
      return (
        <div id="ingredient-div" key={index}>
          <label id="ingredient-label">Ingredient {index + 1}
          </label>
          <label id="name-label">Name</label>
          <select id="ingredient-select" name="ingredient_detail" value={recipeIngredients.ingredient_detail} onChange={(e) => handleIngredientChange(e, index)}>
            <option>-- Select Ingredient --</option>
            {ingredients &&
              ingredients.map(ingredient => ingredient.name).sort().map(name => {
                return <option key={name} value={name} >{name}</option>
              })}
          </select>
          <label>Unit
          </label>
          <select id="unit-select" name="unit" value={recipeIngredients.ingredient_unit} onChange={(e) => handleIngredientChange(e, index)}>
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
          <input id="unit-select" type="text" name="qty" pattern="[0-9]*" placeholder="Enter amount" value={recipeIngredients.qty} onChange={(e) => handleIngredientChange(e, index)} />
        </div>
      )
    })
  }

  const handleStandardChange = (e) => {
    setRecipeStandard({ ...recipeStandard, [e.target.name]: e.target.value })
    setError('')
  }

  const handleNutritionChange = (e) => {
    setRecipeNutrition({ ...recipeNutrition, [e.target.name]: e.target.value })
    setError('')
  }

  // ! Submit Add
  const submitAdd = async (e) => {
    e.preventDefault()
    // Create Mapping for ingredients to their IDs
    const ingredientMap = {}
    ingredients.forEach(ingredient => {
      ingredientMap[ingredient.name] = ingredient.id
    })

    // Replace ingredient names with ids
    const ingredientsBody = recipeIngredients.map(item => {
      return { ...item, ingredient_detail: ingredientMap[item.ingredient_detail] }
    })

    // Create request body
    const addBody = { ...recipeStandard, ...recipeNutrition, ingredients: ingredientsBody }

    try {
      await axios.post('/api/recipes/add/', addBody, userTokenFunction())
    } catch (err) {
      setError(err.response.data.message)
    }
  }


  return (
    <main>
      <h1>Create a recipe</h1>
      <form id="addForm" onSubmit={submitAdd}>
        <section id="standard-form">
          <label>Name</label>
          <input type="text" name="name" placeholder="Recipe name" value={recipeStandard.name} onChange={handleStandardChange} />
          <label>Description</label>
          <input type="text" name="description" placeholder="Recipe description" value={recipeStandard.description} onChange={handleStandardChange} />
          <label>Continent of Origin</label>
          <select name="continent" value={recipeStandard.continent} onChange={handleStandardChange} >
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
          <input type="text" name="serves" placeholder="Serves" value={recipeStandard.serves} onChange={handleStandardChange} />
          <label>Prep Time</label>
          <input type="text" name="cook_time" placeholder="Prep time (include cooking time)" value={recipeStandard.cook_time} onChange={handleStandardChange} />
          <label>Image</label>
          <input type="text" name="image" placeholder="Image URL" value={recipeStandard.image} onChange={handleStandardChange} />
          <span>
            <label>Method</label>
            <textarea type="text" name="method" placeholder="Recipe method..." value={recipeStandard.method} onChange={handleStandardChange} />
          </span>
        </section>
        <section id="ingredients-form">
          {generateIngredientsForm()
          }
        </section>
        <section id="nutrition-form">
          <label>Calories</label>
          <input type="text" name="calories" placeholder="Enter amount (kcal)" value={recipeNutrition.calories} onChange={handleNutritionChange} />
          <label>Fat</label>
          <input type="text" name="fat" placeholder="Enter amount (g)" value={recipeNutrition.fat} onChange={handleNutritionChange} />
          <label>Saturates</label>
          <input type="text" name="saturates" placeholder="Enter amount (g)" value={recipeNutrition.saturates} onChange={handleNutritionChange} />
          <label>Sugars</label>
          <input type="text" name="sugars" placeholder="Enter amount (g)" value={recipeNutrition.sugars} onChange={handleNutritionChange} />
          <label>Salt</label>
          <input type="text" name="salt" placeholder="Enter amount (g)" value={recipeNutrition.salt} onChange={handleNutritionChange} />
          <label>Protein</label>
          <input type="text" name="protein" placeholder="Enter amount (g)" value={recipeNutrition.protein} onChange={handleNutritionChange} />
          <label>Carbohydrates</label>
          <input type="text" name="carbohydrates" placeholder="Enter amount (g)" value={recipeNutrition.carbohydrates} onChange={handleNutritionChange} />
          <label>Fibre</label>
          <input type="text" name="fibre" placeholder="Enter amount (g)" value={recipeNutrition.fibre} onChange={handleNutritionChange} />
        </section>
        <button id="submitEdit" type="submit">Post recipe</button>
      </form>
    </main >
  )
}

export default AddRecipe
