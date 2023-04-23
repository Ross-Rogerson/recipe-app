import { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken, removeToken, userTokenFunction, isAuthenticated } from '../../helpers/auth'
import { useParams, Link, useNavigate } from 'react-router-dom'

const EditRecipe = () => {
  const [error, setError] = useState('')
  const [recipe, setRecipe] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [ingredientCount, setIngredientCount] = useState()
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
  const [editedIngredients, setEditedIngredients] = useState([])
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
        console.log('error', err)
        setError(err.response.data.message)
      }
    }
    getIngredients()
  }, [])

  useEffect(() => {
    setRecipeIngredients(recipe.ingredients)
    const initialNutritionData = {
      ...nutritionData,
      calories: recipe.calories,
      carbohydrates: recipe.carbohydrates,
      fat: recipe.fat,
      fibre: recipe.fibre,
      protein: recipe.protein,
      salt: recipe.salt,
      saturates: recipe.saturates,
      sugars: recipe.sugars,
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
        } else {
          return { ...item, [e.target.name]: e.target.value }
        }
      }
      return item
    })
    setRecipeIngredients(updatedIngredients)
  }

  useEffect(() => {
    recipeIngredients && setIngredientCount(recipeIngredients.length + 1)
  }, [recipeIngredients])

  const generateIngredientsForm = () => {
    if (recipeIngredients) {
      return recipeIngredients.map((recipeIngredient, index) => {
        const { name = recipeIngredient['ingredient_detail'].name, qty, unit  } = recipeIngredient
        return (
          <div key={index}>
            <label id="ingredient-label">Ingredient {index + 1}
              <select name="ingredient_detail" value={recipeIngredients.ingredient_detail} defaultValue={name} onChange={(e) => handleIngredientChange(e, index)}>
                {ingredients.length > 0 &&
                  ingredients.map(ingredient => ingredient.name).sort().map(name => {
                    return <option key={name} value={name} >{name}</option>
                  })}
              </select>
            </label>
            <label>Unit
              <select name="unit" value={recipeIngredients.ingredient_unit} defaultValue={unit} onChange={(e) => handleIngredientChange(e, index)}>
                <option>-- Select Unit --</option>
                <option value='g' >g</option>
                <option value='kg' >kg</option>
                <option value='ml' >ml</option>
                <option value='l' >l</option>
                <option value='cm' >cm</option>
                <option value='tsp' >tsp</option>
                <option value='tbsp' >tbsp</option>
                <option value='sprig(s)' >sprigs</option>
                <option value='bunch(es)' >bunches</option>
                <option value='handful(s)' >handfuls</option>
                <option value='stick(s)' >sticks</option>
                <option value='pinch(es)' >pinches</option>
                <option value='' >-</option>
              </select>
            </label>
            <label>Qty/Weight
              <input type="text" name="qty" pattern="[0-9]*\.?[0-9]+" placeholder="Enter amount" value={recipeIngredients.qty} defaultValue={qty} onChange={(e) => handleIngredientChange(e, index)} />
            </label>
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
      const { name, id  } = detail
      ingredientMap[name] = id
    })
    
    // Replace ingredient names with ids
    const ingredientsBody = recipeIngredients.map(ingredient => {
      return { ...ingredient, ingredient_detail: ingredientMap[ingredient.ingredient_detail.name] }
    })
    console.log(ingredientsBody)

    // Create request body
    const editBody = { ...standardData, ...nutritionData, ingredients: ingredientsBody }

    // console.log(editBody)

    try {
      await axios.put(`/api/recipes/${recipeId}/edit/`, editBody, userTokenFunction())
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }
  }

  return (
    <main>
      <h1>Edit recipe</h1>
      <form id="editForm" onSubmit={submitEdit}>
        <section className="standard-form">
          <label>Name
            <input type="text" name="name" placeholder="Recipe name" value={standardData.name} onChange={handleStandardChange} />
          </label>
          <label>Description
            <input type="text" name="description" placeholder="Recipe description" value={standardData.description} onChange={handleStandardChange} />
          </label>
          <label>Continent of Origin
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
          </label>
          <label>Serves
            <input type="text" name="serves" placeholder="Serves" value={standardData.serves} onChange={handleStandardChange} />
          </label>
          <label>Prep Time
            <input type="text" name="cook_time" placeholder="Prep time (include cooking time)" value={standardData.cook_time} onChange={handleStandardChange} />
          </label>
          <label>Image
            <input type="text" name="image" placeholder="Image URL" value={standardData.image} onChange={handleStandardChange} />
          </label>
          <label>Method
            <input type="text" name="method" placeholder="Recipe method" value={standardData.method} onChange={handleStandardChange} />
          </label>
        </section>
        <section className="ingredients-form">
          {generateIngredientsForm()
          }
        </section>
        <section className="nutrition-form">
          <label>Calories
            <input type="text" name="calories" placeholder="Enter amount (kcal)" value={nutritionData.calories} onChange={handleNutritionChange} />
          </label>
          <label>Fat
            <input type="text" name="fat" placeholder="Enter amount (g)" value={nutritionData.fat} onChange={handleNutritionChange} />
          </label>
          <label>Saturates
            <input type="text" name="saturates" placeholder="Enter amount (g)" value={nutritionData.saturates} onChange={handleNutritionChange} />
          </label>
          <label>Sugars
            <input type="text" name="sugars" placeholder="Enter amount (g)" value={nutritionData.sugars} onChange={handleNutritionChange} />
          </label>
          <label>Salt
            <input type="text" name="salt" placeholder="Enter amount (g)" value={nutritionData.salt} onChange={handleNutritionChange} />
          </label>
          <label>Protein
            <input type="text" name="protein" placeholder="Enter amount (g)" value={nutritionData.protein} onChange={handleNutritionChange} />
          </label>
          <label>Carbohydrates
            <input type="text" name="carbohydrates" placeholder="Enter amount (g)" value={nutritionData.carbohydrates} onChange={handleNutritionChange} />
          </label>
          <label>Fibre
            <input type="text" name="fibre" placeholder="Enter amount (g)" value={nutritionData.fibre} onChange={handleNutritionChange} />
          </label>
        </section>
        <button id="submitEdit" type="submit">Submit edit</button>
      </form>
    </main >
  )
}

export default EditRecipe
