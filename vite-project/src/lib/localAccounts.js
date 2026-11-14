const accountsKey = 'fengs-local-accounts-v1'
const sessionKey = 'fengs-local-session-v1'
const ordersKey = 'fengs-local-orders-v1'
const passwordIterations = 310000

function readStoredJson(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored === null ? fallback : JSON.parse(stored)
  } catch (error) {
    console.error(`Could not read local FENGS data (${key}).`, error)
    throw new Error('Saved account data could not be read. Clear this site’s local storage and try again.', { cause: error })
  }
}

function writeStoredJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Could not save local FENGS data (${key}).`, error)
    throw new Error('This browser could not save your data. Check available storage and try again.', { cause: error })
  }
}

function encodeBytes(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function decodeBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

async function derivePasswordHash(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error('Secure password support is unavailable in this browser. Use a modern browser over HTTPS or localhost.')
  }
  const key = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await window.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt,
    iterations: passwordIterations,
    hash: 'SHA-256',
  }, key, 256)
  return new Uint8Array(bits)
}

function toUser(account) {
  return {
    id: account.id,
    email: account.email,
    user_metadata: {
      full_name: account.fullName,
      phone: account.phone || '',
    },
  }
}

function setSession(account) {
  writeStoredJson(sessionKey, { accountId: account.id })
  return toUser(account)
}

export async function registerLocalAccount({ email, password, fullName }) {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = readStoredJson(accountsKey, [])
  if (!Array.isArray(accounts)) {
    throw new Error('Saved account data is invalid. Clear this site’s local storage and try again.')
  }
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists on this device. Sign in instead.')
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const passwordHash = await derivePasswordHash(password, salt)
  const account = {
    id: window.crypto.randomUUID(),
    email: normalizedEmail,
    fullName: fullName.trim(),
    phone: '',
    passwordSalt: encodeBytes(salt),
    passwordHash: encodeBytes(passwordHash),
  }
  writeStoredJson(accountsKey, [...accounts, account])
  return setSession(account)
}

export async function signInLocalAccount({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = readStoredJson(accountsKey, [])
  if (!Array.isArray(accounts)) {
    throw new Error('Saved account data is invalid. Clear this site’s local storage and try again.')
  }
  const account = accounts.find((item) => item.email === normalizedEmail)
  if (!account) throw new Error('No local account was found for this email. Create an account on this device first.')
  const passwordHash = await derivePasswordHash(password, decodeBytes(account.passwordSalt))
  if (encodeBytes(passwordHash) !== account.passwordHash) {
    throw new Error('The email or password is incorrect.')
  }
  return setSession(account)
}

export function getLocalSession() {
  const session = readStoredJson(sessionKey, null)
  if (!session?.accountId) return null
  const accounts = readStoredJson(accountsKey, [])
  if (!Array.isArray(accounts)) {
    throw new Error('Saved account data is invalid. Clear this site’s local storage and try again.')
  }
  const account = accounts.find((item) => item.id === session.accountId)
  if (!account) {
    writeStoredJson(sessionKey, null)
    return null
  }
  return toUser(account)
}

export function updateLocalProfile(userId, { fullName, phone }) {
  const accounts = readStoredJson(accountsKey, [])
  if (!Array.isArray(accounts)) {
    throw new Error('Saved account data is invalid. Clear this site’s local storage and try again.')
  }
  const index = accounts.findIndex((account) => account.id === userId)
  if (index < 0) throw new Error('This local account could not be found. Sign in again.')
  const nextAccounts = [...accounts]
  nextAccounts[index] = { ...nextAccounts[index], fullName: fullName.trim(), phone: phone.trim() }
  writeStoredJson(accountsKey, nextAccounts)
  return toUser(nextAccounts[index])
}

export function signOutLocalAccount() {
  try {
    window.localStorage.removeItem(sessionKey)
  } catch (error) {
    console.error('Could not clear the local FENGS session.', error)
    throw new Error('Could not sign out on this device. Please check browser storage settings.', { cause: error })
  }
}

export function getLocalOrders(userId) {
  const orders = readStoredJson(ordersKey, [])
  if (!Array.isArray(orders)) {
    throw new Error('Saved local order data is invalid. Clear this site’s local storage and try again.')
  }
  return orders.filter((order) => order.user_id === userId)
}

export function createLocalOrder(order) {
  const orders = readStoredJson(ordersKey, [])
  if (!Array.isArray(orders)) {
    throw new Error('Saved local order data is invalid. Clear this site’s local storage and try again.')
  }
  const createdOrder = {
    ...order,
    id: window.crypto.randomUUID(),
    status: 'Requested',
    created_at: new Date().toISOString(),
  }
  writeStoredJson(ordersKey, [...orders, createdOrder])
  return createdOrder
}

export function cancelLocalOrder(userId, orderId) {
  const orders = readStoredJson(ordersKey, [])
  if (!Array.isArray(orders)) {
    throw new Error('Saved local order data is invalid. Clear this site’s local storage and try again.')
  }
  const orderIndex = orders.findIndex((order) => order.id === orderId && order.user_id === userId)
  if (orderIndex < 0) throw new Error('This order could not be found in your local account.')
  if (orders[orderIndex].status !== 'Requested') {
    throw new Error('Only orders awaiting store confirmation can be cancelled.')
  }
  const updatedOrders = [...orders]
  updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], status: 'Cancelled' }
  writeStoredJson(ordersKey, updatedOrders)
  return updatedOrders[orderIndex]
}
