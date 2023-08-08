export const utilService = {
   makeId,
   getRandomIntInclusive,
   debounce,
   saveToStorage,
   getCurrentDay,
   loadFromStorage,
   getDate,
}

function makeId(length = 6) {
   var txt = ''
   var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

   for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
   }

   return txt
}

function getRandomIntInclusive(min, max) {
   min = Math.ceil(min)
   max = Math.floor(max)
   return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function debounce(func, timeout = 300) {
   let timer
   return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
         func.apply(this, args)
      }, timeout)
   }
}

function getCurrentDay() {
   const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
   ]
   const currentDate = new Date()
   const currentDayIndex = currentDate.getDay()
   const currentDay = daysOfWeek[currentDayIndex]
   return currentDay
}

function getDate() {
   const currentDate = new Date()
   const year = currentDate.getFullYear() 
   const month = currentDate.getMonth() + 1 
   const day = currentDate.getDate() 
   const hours = currentDate.getHours() 
   const currDate = day + '/' + month + '/' + year
   return currDate
}


function saveToStorage(key, value) {
   localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
   const data = localStorage.getItem(key)
   return data ? JSON.parse(data) : undefined
}
