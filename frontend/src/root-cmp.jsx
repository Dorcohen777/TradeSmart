import React from 'react'
import { Routes, Route } from 'react-router'

//cmp
import { HomePage } from './pages/home-page'
import { AppHeader } from './cmps/app-header'
import { LoginSignup } from './cmps/login-signup'
import { UserDashboard } from './cmps/user-dashboard'
import { EditTrade } from './cmps/edit-trade'
import { StockAlert } from './cmps/stock-alert'
import { AboutUs } from './pages/about'
import { AiHelper } from './cmps/ai-helper'
import { MarketTimeing } from './cmps/market-timing'

export function RootCmp() {
   return (
      <div className='app-container main-layout'>
         <AppHeader />
         <main className='main-container full'>
            <Routes>
               <Route path='/TradeSmart' element={<HomePage />} />
               <Route path='/sign-up' element={<LoginSignup />} />
               <Route path='/user-dashboard' element={<UserDashboard />}>
                  <Route path='edit/:id' element={<EditTrade />} />
                  <Route path='alert' element={<StockAlert />} />
               </Route>
               <Route path='/about-us' element={<AboutUs/>}> </Route>
               <Route path='/ai-helper' element={<AiHelper/>}> </Route>
               <Route path='/market-timing' element={<MarketTimeing/>}> </Route> 
            </Routes>
         </main>
      </div>
   )
}
