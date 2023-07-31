import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { login, logout, signup } from '../store/user.actions.js'
import { LoginSignup } from './login-signup.jsx'
import { useEffect, useState } from 'react'
import { userService } from '../services/user.service'

export function AppHeader() {
   const user = useSelector((storeState) => storeState.userModule.user)
   const location = useLocation()
   const currentPath = location.pathname
   const [headerStyle, setHeaderStyle] = useState('')

   useEffect(() => {
      if (currentPath !== '/') {
         setHeaderStyle('#4169E1')
      } else {
         setHeaderStyle('')
      }
   }, [currentPath])

   async function onLogin(credentials) {
      try {
         const user = await login(credentials)
         showSuccessMsg(`Welcome: ${user.fullname}`)
      } catch (err) {
         showErrorMsg('Cannot login')
      }
   }

   async function onSignup(credentials) {
      try {
         const user = await signup(credentials)
         showSuccessMsg(`Welcome new user: ${user.fullname}`)
      } catch (err) {
         showErrorMsg('Cannot signup')
      }
   }

   async function onLogout() {
      try {
         await logout()
         showSuccessMsg(`Bye now`)
      } catch (err) {
         showErrorMsg('Cannot logout')
      }
   }

   return (
      <>
         {currentPath !== '/user-dashboard' || currentPath === '/edit'  && (
            <header
               className='app-header'
               style={{ backgroundColor: headerStyle }}
            >
               <nav>
                  <ul>
                     <div className='links-container'>
                        <Link to={'/'}>
                           <li>Home</li>
                        </Link>
                        <Link to={'/sign-up'}>
                           <li>Sign up</li>
                        </Link>
                        <Link to={'/about-us'}>
                           <li>About us</li>
                        </Link>
                        {user && (
                           <Link to={'/user-dashboard'}>
                              <li>User Dashboard</li>
                           </Link>
                        )}
                     </div>
                     <div>
                        {user && (
                           <img
                              src={user.imgUrl}
                              className='user-img pointer'
                           />
                        )}
                     </div>
                  </ul>
                  {/* {user &&
                    <span className="user-info">
                        <Link to={`user/${user._id}`}>
                            {user.imgUrl && <img src={user.imgUrl} />}
                            {user.fullname}
                        </Link>
                        <span className="score">{user.score?.toLocaleString()}</span>
                        <button onClick={onLogout}>Logout</button>
                    </span>
                }
                {!user &&
                    <section className="user-info">
                        <LoginSignup onLogin={onLogin} onSignup={onSignup} />
                    </section>
                } */}
               </nav>
            </header>
         )}
      </>
   )
}
