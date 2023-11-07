import { storageService } from './async-storage.service'
import { httpService } from './http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
   login,
   logout,
   signup,
   getLoggedinUser,
   saveLocalUser,
   getUsers,
   getById,
   remove,
   update,
}

window.userService = userService

function getUsers() {
   // return storageService.query('user') ## This is for local storage
   return httpService.get(`user/`)
}

async function getById(userId) {
   // const user = await storageService.get('user', userId) ## This is for local storage
   const user = await httpService.get(`user/${userId}`)
   return user
}

function remove(userId) {
   // return storageService.remove('user', userId) ## This is for local storage
   return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
   const user = await storageService.get('user', _id)
   user.score = score
   await storageService.put('user', user)

   // const user = await httpService.put(`user/${_id}`, {_id, score})
   // Handle case in which admin updates other user's details
   if (getLoggedinUser()._id === user._id) saveLocalUser(user)
   return user
}

async function login(userCred) {
   try {
      const user = await httpService.post('auth/login', userCred)
      return saveLocalUser(user)
   } catch (err) {
      throw err
   }
}

function saveLocalUser(user) {
   user = {
      _id: user._id,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
   }
   sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
   return user
}

async function signup(userCred) {
   if (!userCred.imgUrl)
      userCred.imgUrl =
         'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
   // const user = await storageService.post('user', userCred) ## This is for local storage
   const user = await httpService.post('auth/signup', userCred)
   return saveLocalUser(user)
}

async function logout() {
   sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER) //## This is for local storage
   return await httpService.post('auth/logout')
}

function getLoggedinUser() {
   return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
