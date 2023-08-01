import { useState } from "react"
import { tradeService } from "../../services/trade.service.local"

export function CalcContainer(){
   const [calcExitPoint, setCalcExitPoint] = useState(tradeService.newCalcExitPoint())
   const [tradeExitPrice, setTradeExitPrice] = useState(null)
   const [riskManagement, setRiskManagement] = useState(tradeService.newRiskManagement)
   const [riskManagementRes, setRiskManagementRes] = useState(null)
   
   function handleExitTradeChange(ev) {
      const { name, value } = ev.target
      setCalcExitPoint((prevRiskCalc) => ({
         ...prevRiskCalc,
         [name]: value,
      }))
      console.log('calcExitPoint', calcExitPoint)
   }

   function calcTradeRisk() {
      const res = tradeService.calculatePercentageAndPrice(
         calcExitPoint.tradeRisk,
         calcExitPoint.sharesAmount,
         calcExitPoint.riskEntryPrice
      )
      console.log('res', res)
      setTradeExitPrice(res)
   }

   function onRiskManagementChange(ev) {
      const { name, value } = ev.target
      setRiskManagement((newRisk) => ({
         ...newRisk,
         [name]: value,
      }))
   }

   function calcRisk() {
      const res = tradeService.calculateRiskAmount(
         riskManagement.size,
         riskManagement.percentage
      )
      setRiskManagementRes(res)
   }


    return (
        <section>
            <div className='trade-exit-calculator-container input-container-style-dash'>
                  <h2>Calculate trade exit</h2>
                  <div className='exit-calculator-inner-container'>
                     <label htmlFor=''>Maximum risk</label>
                     <input
                        type='number'
                        name='tradeRisk'
                        onChange={(ev) => handleExitTradeChange(ev)}
                     />
                     <label htmlFor=''>Shares amount</label>
                     <input
                        type='number'
                        name='sharesAmount'
                        onChange={(ev) => handleExitTradeChange(ev)}
                     />
                     <label htmlFor=''>Entry price</label>
                     <input
                        type='number'
                        name='riskEntryPrice'
                        onChange={(ev) => handleExitTradeChange(ev)}
                     />
                     <button
                        className='btn-style-3'
                        onClick={() => calcTradeRisk()}
                     >
                        Calculate
                     </button>
                     <h3>
                        exit price:{' '}
                        <span>
                           {tradeExitPrice &&
                              tradeExitPrice.newPricePerShare + '$'}
                        </span>
                     </h3>
                     <h3>
                        percentage change:{' '}
                        <span>
                           {tradeExitPrice &&
                              tradeExitPrice.percentageDecrease + '%'}
                        </span>
                     </h3>
                  </div>
               </div>

               <div className='dashboard-risk-main-container'>
                  <div className='dashboard-risk-inner-container input-container-style-dash'>
                     <h2 className=''>Risk management calculator</h2>
                     <div>
                        <input
                           type='number'
                           name='size'
                           placeholder='account size'
                           onChange={(ev) => onRiskManagementChange(ev)}
                        />
                     </div>
                     <div className='risk-percentage-container'>
                        <input
                           type='number'
                           name='percentage'
                           placeholder='risk-percentage'
                           onChange={(ev) => onRiskManagementChange(ev)}
                        />
                     </div>
                     <button
                        className='risk-calc-btn btn-style-3'
                        onClick={() => calcRisk()}
                     >
                        Calculate
                     </button>
                     <div>
                        <h3>
                           Maximum loss:{' '}
                           <span>
                              {riskManagementRes}
                              {riskManagementRes && '$'}
                           </span>
                        </h3>
                     </div>
                  </div>
               </div>
        </section>
    )
}