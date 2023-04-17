import { Buffer } from 'buffer'
import axios from 'axios'

const tokenName = 'WANDERLUST-TOKEN'

export const getPayload = () => {
  const token = localStorage.getItem(tokenName) // get full token from localStorage
  if (!token) return
  const splitToken = token.split('.') // split token into 3 parts using split
  const payloadString = splitToken[1] // take the middle payload string and save it to a variable
  return JSON.parse(Buffer.from(payloadString, 'base64'))
}

export const isAuthenticated = () => {
  const payload = getPayload() // get payload object containing the expiry date under the exp key
  if (!payload) return false // if it's undefined, it doesn't exist and so we return false
  const currentTime = Date.now() / 1000 // we get the current time by using Date.now() but need to convert to seconds from miliseconds so divide by 1000
  return currentTime < payload.exp // finally we check if the expiry is bigger than the current timestamp, if it is, it's valid
}

export const getUserID = () => {
  const payload = getPayload() // get payload object containing the expiry date under the exp key
  if (!payload) return false // if it's undefined, it doesn't exist and so we return false
  return payload.sub // finally we check if the expiry is bigger than the current timestamp, if it is, it's valid
}

export const getToken = () => {
  return localStorage.getItem(tokenName)
}

export const authenticated = axios.create({
  baseURL: '',
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

export const isAdmin = async () => {
  try {
    const { data: { isAdmin } } = await authenticated.get('/api/profile')
    console.log(isAdmin)
    return isAdmin
  } catch (err) {
    console.log(err)
  }
  // return currentTime < payload.exp // finally we check if the expiry is bigger than the current timestamp, if it is, it's valid
}

export const removeToken = () => {
  localStorage.removeItem(tokenName)
  // axios.delete.headers['Authorization']
}