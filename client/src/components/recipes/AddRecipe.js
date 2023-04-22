import { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken, removeToken, userTokenFunction, isAuthenticated } from '../../helpers/auth'
import { useParams, Link, useNavigate } from 'react-router-dom'

const AddRecipe = () => {
  const [error, setError] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [ingredientCount, setIngredientCount] = useState()
  const [filteredIngredients, setFilteredIngredients] = useState([])
  const [filters, setFilters] = useState({})
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
        console.log(data)
        setIngredients(data)
      } catch (err) {
        console.log('error', err)
        setError(err.response.data.message)
      }
    }
    getIngredients()
  }, [])

  // Ingredients Filters
  // const handleDisabled = (index) => {
  //   if (recipeIngredients.length > index) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  // const handleFilterChange = (index, e) => {
  //   const newFilters = { ...filters, [index]: e.target.value }
  //   setFilters(newFilters)
  // }

  // useEffect(() => {
  //   const newFilteredIngredients = ingredients.filter(ingredient => {
  //     return (ingredient.category === filters.category || filters.category === 'All')
  //   }).sort((a, b) => a.name > b.name ? 1 : -1)
  //   setFilteredIngredients(newFilteredIngredients)
  // }, [filters, ingredients])

  {/* <select name="category" value={filters.category} onChange={(e) => handleFilterChange(index, e)}>
            <option value="All" disabled={recipeIngredients.length > index ? true : false}>All</option>
            {ingredients &&
              [...new Set(ingredients.map(ingredient => ingredient.category))].sort().map(category => {
                return <option key={category} value={category}>{category}</option>
              })}
          </select> */}

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
    console.log(recipeIngredients)
    setIngredientCount(recipeIngredients.length + 1)
  }, [recipeIngredients])

  const generateIngredientsForm = () => {
    return [...Array(ingredientCount)].map((_, index) => {
      return (
        <div key={index}>
          <label id="ingredient-label">Ingredient {index + 1}
            <select name="ingredient_detail" value={recipeIngredients.ingredient_detail} onChange={(e) => handleIngredientChange(e, index)}>
              <option>-- Select Ingredient --</option>
              {ingredients &&
                ingredients.map(ingredient => ingredient.name).sort().map(name => {
                  return <option key={name} value={name} >{name}</option>
                })}
            </select>
          </label>
          <label>Unit
            <select name="unit" value={recipeIngredients.ingredient_unit} onChange={(e) => handleIngredientChange(e, index)}>
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
            <input type="text" name="qty" pattern="[0-9]*" placeholder="Enter amount" value={recipeIngredients.qty} onChange={(e) => handleIngredientChange(e, index)} />
          </label>
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

    console.log(addBody)


    try {
      await axios.post('/api/recipes/add/', addBody, userTokenFunction())
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }
  }


  return (
    <main>
      <h1>Add Recipe</h1>
      <form id="addForm" onSubmit={submitAdd}>
        <section className="standard-form">
          <label>Name
            <input type="text" name="name" placeholder="Recipe name" value={recipeStandard.name} onChange={handleStandardChange} />
          </label>
          <label>Description
            <input type="text" name="description" placeholder="Recipe description" value={recipeStandard.description} onChange={handleStandardChange} />
          </label>
          <label>Continent of Origin
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
          </label>
          <label>Serves
            <input type="text" name="serves" placeholder="Serves" value={recipeStandard.serves} onChange={handleStandardChange} />
          </label>
          <label>Prep Time
            <input type="text" name="cook_time" placeholder="Prep time (include cooking time)" value={recipeStandard.cook_time} onChange={handleStandardChange} />
          </label>
          <label>Image
            <input type="text" name="image" placeholder="Image URL" value={recipeStandard.image} onChange={handleStandardChange} />
          </label>
          <label>Method
            <input type="text" name="method" placeholder="Recipe method" value={recipeStandard.method} onChange={handleStandardChange} />
          </label>
        </section>
        <section className="ingredients-form">
          {generateIngredientsForm()
          }
          <button type="button" >Add Ingredient</button>
          {/* onClick={addIngredient} */}
        </section>
        <section className="nutrition-form">
          <label>Calories
            <input type="text" name="calories" placeholder="Enter amount (kcal)" value={recipeNutrition.calories} onChange={handleNutritionChange} />
          </label>
          <label>Fat
            <input type="text" name="fat" placeholder="Enter amount (g)" value={recipeNutrition.fat} onChange={handleNutritionChange} />
          </label>
          <label>Saturates
            <input type="text" name="saturates" placeholder="Enter amount (g)" value={recipeNutrition.saturates} onChange={handleNutritionChange} />
          </label>
          <label>Sugars
            <input type="text" name="sugars" placeholder="Enter amount (g)" value={recipeNutrition.sugars} onChange={handleNutritionChange} />
          </label>
          <label>Salt
            <input type="text" name="salt" placeholder="Enter amount (g)" value={recipeNutrition.salt} onChange={handleNutritionChange} />
          </label>
          <label>Protein
            <input type="text" name="protein" placeholder="Enter amount (g)" value={recipeNutrition.protein} onChange={handleNutritionChange} />
          </label>
          <label>Carbohydrates
            <input type="text" name="carbohydrates" placeholder="Enter amount (g)" value={recipeNutrition.carbohydrates} onChange={handleNutritionChange} />
          </label>
          <label>Fibre
            <input type="text" name="fibre" placeholder="Enter amount (g)" value={recipeNutrition.fibre} onChange={handleNutritionChange} />
          </label>
        </section>
        <button id="submitEdit" type="submit">Create recipe</button>
      </form>
    </main >
  )
}

export default AddRecipe
