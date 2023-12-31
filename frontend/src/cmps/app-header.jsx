import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

import { login, logout, signup } from '../store/user.actions.js'
import { LoginSignup } from './login-signup.jsx'
import { userService } from '../services/user.service'
import { useEffect, useState } from 'react'

// img
import logo from '../assets/img/logo.png'

export function AppHeader() {
   const user = useSelector((storeState) => storeState.userModule.user)
   const location = useLocation()
   const currentPath = location.pathname
   const [headerStyle, setHeaderStyle] = useState('')
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const dynamicParam = currentPath.split('/').pop() // Get the dynamic part of the URL

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
         {currentPath !== '/user-dashboard' &&
            currentPath !== `/user-dashboard/edit/${dynamicParam}` &&
            currentPath !== '/user-dashboard/alert' && (
               <div className='navbar-main-container full'>
                  <header
                     className='app-header'
                     style={{ backgroundColor: headerStyle }}
                  >
                     <div className='navbar-content'>
                        <h2 className='h2-website-logo'>
                           <img
                              src={logo}
                              alt='TradeSmart logo'
                              className='website-logo'
                           />
                           TradeSmart
                        </h2>

                        <div
                           onClick={() => setIsMenuOpen(!isMenuOpen)}
                           className='hamburger-menu'
                        >
                           &#9776;
                        </div>

                        <nav
                           className={`nav-container ${
                              isMenuOpen ? 'mobile-nav-open' : ''
                           }`}
                        >
                           <ul>
                              <li>
                                 <Link to={'/'}>Home</Link>
                              </li>
                              <li>
                                 <Link to={'/sign-up'}>Sign up</Link>
                              </li>
                              <li>
                                 <Link to={'/about-us'}>About us</Link>
                              </li>
                              <li>
                                 <Link to={'/market-timing'}>Market timing</Link>
                              </li>
                              {user && (
                                 <li>
                                    <Link to={'/user-dashboard'}>
                                       User Dashboard
                                    </Link>
                                 </li>
                              )}
                           </ul>
                        </nav>

                        {user && (
                           <div className='user-info'>
                              <img
                                 src={user.imgUrl}
                                 className='user-img pointer'
                              />
                           </div>
                        )}
                     </div>
                  </header>
               </div>
            )}
      </>
   )
}
