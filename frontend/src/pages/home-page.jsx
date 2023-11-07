import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

// img
import heroImg from '../assets/img/hero-img3.png'
import { HomeInfo } from './home-info'
import { HomeQuote } from './home-quote'

// user actions
import { login, signup } from '../store/user.actions'
//icons
import iconOne from '../assets/img/homePage-icons/free.png'
import iconStar from '../assets/img/homePage-icons/starg.png'
import iconBright from '../assets/img/homePage-icons/brightness.png'
import iconUnlock from '../assets/img/homePage-icons/unlock.png'
import iconControl from '../assets/img/homePage-icons/tablet.png'
import { tradeService } from '../services/trade.service.local'

export function HomePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   async function onDemoClick() {
      const demoUser = tradeService.createDemoUser()
      await signup(demoUser)
      await login(demoUser)
      navigate('/user-dashboard')
   }

   return (
      <div>
         <section className='hero-container main-layout'>
            <div className='hero-info-container align-center'>
               <div className='hero-info'>
                  <h2>
                     Start Earning with Confidence: Your Path to Financial
                     Success
                  </h2>
                  <h3>Supercharge Your Trades with Data-Driven Insights!</h3>
                  <div className='hero-actions'>
                     <Link onClick={() => onDemoClick()}>
                        <button className='btn-style pointer'>Try Demo</button>
                     </Link>
                     <Link to='/sign-up'>
                        <button className='btn-style pointer'>Sign up</button>
                     </Link>
                  </div>
               </div>
               <div className='hero-img'>
                  <img src={heroImg} alt='trade-smart' />
               </div>
            </div>

            <div className='home-page-icons-main-container'>
               <div className='homepage-icon-style'>
                  <img src={iconStar} alt='try free' />
                  <h3>Optimize your strategies</h3>
               </div>
               <div className='homepage-icon-style'>
                  <img src={iconBright} alt='try free' />
                  <h3>Enhance your trading experience</h3>
               </div>
               <div className='homepage-icon-style'>
                  <img src={iconOne} alt='try free' />
                  <h3>Try free</h3>
               </div>
               <div className='homepage-icon-style'>
                  <img src={iconControl} alt='try free' />
                  <h3>Take control of your trades</h3>
               </div>

               <div className='homepage-icon-style'>
                  <img src={iconUnlock} alt='try free' />
                  <h3>Unlock trading insights</h3>
               </div>
            </div>
         </section>
         <HomeInfo />
         <HomeQuote />
      </div>
   )
}
