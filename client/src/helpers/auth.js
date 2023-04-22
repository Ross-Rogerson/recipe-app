import { Buffer } from 'buffer'

const tokenName = 'RECIPE-TOKEN'

export const getPayload = () => {
  const token = localStorage.getItem(tokenName) 
  if (!token) return
  const splitToken = token.split('.') 
  const payloadString = splitToken[1] 
  return JSON.parse(Buffer.from(payloadString, 'base64'))
}

export const isAuthenticated = () => {
  const payload = getPayload() 
  if (!payload) return false 
  const currentTime = Date.now() / 1000 
  return currentTime < payload.exp 
}

export const getUserID = () => {
  const payload = getPayload()
  if (!payload) return false
  return payload.sub
}

export const getToken = () => {
  return localStorage.getItem(tokenName)
}

export const removeToken = () => {
  localStorage.removeItem(tokenName)
}

export const userTokenFunction = () => {
  const token = localStorage.getItem(tokenName)
  if (!token) return
  const userToken = {
    headers: { Authorization: `Bearer ${token}` },
  }
  return userToken
}