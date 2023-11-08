import { Link } from 'react-router-dom'

// components
import { HomePage } from './home-page'

export function Footer() {
   return (
      <section className='footer-main-container full'>
         <div className='footer-container main-layout'>
            <div className='quick-links-container'>
               <h3 className='underline-style-white'>Quick Links</h3>
               <Link to='/'>Home</Link>
               <Link to='/sign-up'>Sign up</Link>
               <Link to='/about-us'>About us</Link>
               <Link to='/market-timing'>Market timing</Link>
            </div>
            {/* <div className='copyright-container'><p>©TradeSmart</p></div> */}
         </div>
      </section>
   )
}
