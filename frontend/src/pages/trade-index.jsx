import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadCars } from '../store/car.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { carService } from '../services/car.service.js'

export function CarIndex() {
   //    const cars = useSelector((storeState) => storeState.carModule.cars)

   useEffect(() => {
      loadCars()
   }, [])

   return (
      <div>
         <h3>TradeSmart App</h3>
         <main></main>
      </div>
   )
}
