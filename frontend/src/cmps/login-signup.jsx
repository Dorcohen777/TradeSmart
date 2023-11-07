import { useState, useEffect } from 'react'
import { userService } from '../services/user.service'
import { login, signup, logout } from '../store/user.actions'
import { ImgUploader } from '../cmps/img-uploader'

// img
import loginSignupImg from '../assets/img/logsign.jpg'
import { useNavigate } from 'react-router-dom'

export function LoginSignup() {
   const [credentials, setCredentials] = useState({
      username: '',
      password: '',
      fullname: '',
   })
   const [isSignup, setIsSignup] = useState(false)
   const [currUser, setCurrUser] = useState(null)
   const [users, setUsers] = useState([])
   const navigate = useNavigate()

   useEffect(() => {
      loadUsers()
      getCurrUser()
   }, [])

   async function loadUsers() {
      const users = await userService.getUsers()
      setUsers(users)
   }

   function getCurrUser() {
      const user = userService.getLoggedinUser()
      setCurrUser(user)
   }

   function clearState() {
      setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
      setIsSignup(false)
   }

   // handle form
   function handleChange(ev) {
      const field = ev.target.name
      const value = ev.target.value
      setCredentials({ ...credentials, [field]: value })
   }

   // login function
   async function onLogin(ev = null) {
      if (ev) ev.preventDefault()
      try {
         await login(credentials)
         getCurrUser()
         clearState()
      } catch (err) {
         console.log('Failed to login, check username and password', err)
      }
   }

   // signup function
   async function onSignup(ev = null) {
      if (ev) ev.preventDefault()
      if (
         !credentials.username ||
         !credentials.password ||
         !credentials.fullname
      )
         return
      await signup(credentials)
      getCurrUser()
      clearState()
   }

   // logout function
   async function onLogOut() {
      await logout()
      setCurrUser(null)
   }

   function onDashboardClick() {
      console.log('clicked dashbaord')
      navigate('/user-dashboard')
   }

   function toggleSignup() {
      setIsSignup(!isSignup)
   }

   function onUploaded(imgUrl) {
      setCredentials({ ...credentials, imgUrl })
   }

   return (
      <div className='login-page'>
         <div className='login-inner-container'>
            <div className='login-info-container'>
               <p>
                  {!currUser && (
                     <button
                        className='btn-link pointer'
                        onClick={toggleSignup}
                     >
                        {!isSignup
                           ? 'New? Signup'
                           : 'Already have account? Login'}
                     </button>
                  )}
                  {currUser ? (
                     <button className='pointer' onClick={() => onLogOut()}>
                        Logout
                     </button>
                  ) : (
                     ''
                  )}
                  {currUser ? (
                     <button
                        className=' pointer'
                        onClick={() => onDashboardClick()}
                     >
                        Account dashboard
                     </button>
                  ) : (
                     ''
                  )}
               </p>
               {!isSignup && (
                  <div className='login-signup-container'>
                     <form className='login-signup-form' onSubmit={onLogin}>
                        <h2 className='underline-style'>Account login</h2>
                        <input
                           type='text'
                           name='username'
                           value={credentials.username}
                           placeholder='Username'
                           onChange={handleChange}
                           required
                           autoFocus
                        />
                        <input
                           type='password'
                           name='password'
                           value={credentials.password}
                           placeholder='Password'
                           onChange={handleChange}
                           required
                        />
                        <button className='btn-login-gradient pointer'>
                           Login
                        </button>
                     </form>
                  </div>
               )}

               <div className='login-signup-container'>
                  {isSignup && (
                     <form className='login-signup-form' onSubmit={onSignup}>
                        <h2 className='underline-style'>Account sign-up</h2>
                        <input
                           type='text'
                           name='fullname'
                           value={credentials.fullname}
                           placeholder='Fullname'
                           onChange={handleChange}
                           required
                        />
                        <input
                           type='text'
                           name='username'
                           value={credentials.username}
                           placeholder='Username'
                           onChange={handleChange}
                           required
                        />
                        <input
                           type='password'
                           name='password'
                           value={credentials.password}
                           placeholder='Password'
                           onChange={handleChange}
                           required
                        />
                        {/* <ImgUploader onUploaded={onUploaded} /> */}
                        <button className='btn-login-gradient pointer'>
                           Signup
                        </button>
                     </form>
                  )}
               </div>
            </div>
         </div>
         <div className='login-image-container'>
            {/* <img
               src={loginSignupImg}
               alt='smart-trade-img'
               className='login-signup-img'
            /> */}
            <div className='inner-image-login-container'>
               <h2>
                  Become a <span>Better Trader</span>
               </h2>
               <h3>
                  Our app gives you the power to track your trades, analyze
                  data, and make informed decisions.
               </h3>{' '}
               <br />
               <h3>Make money the smart way.</h3>
            </div>
         </div>
      </div>
   )
}
