import { useState } from "react"
import { Link } from "react-router-dom"

export function TableData({onRemoveTrade, userTrades}) {
   return (
      <section>
         <table className='transaction-table'>
            <tbody>
               <tr className='table-header-titles-container'>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Shares</th>
                  <th>Entry price</th>
                  <th>Exit price</th>
                  <th>Side</th>
                  <th>Return $</th>
                  <th>Strategy type</th>
                  <th>Edit trade</th>
                  <th>Delete trade</th>
               </tr>
               {userTrades.length === 0 && (
                  <tr className='tr-no-trades-msg'>
                     <th>No Trades Found - add your first trade</th>
                  </tr>
               )}

               {userTrades
                  ? userTrades.map((trade, idx) => {
                       return (
                          <tr key={idx}>
                             <td
                                className={`td-status ${
                                   trade.pl > 0 ? 'win' : 'lose'
                                }`}
                             >
                                {trade.pl > 0 ? 'WIN' : 'LOSE'}
                             </td>
                             <td>{trade.day}</td>
                             <td className='td-symbol'>{trade.symbol}</td>
                             <td>{trade.amount}</td>
                             <td>{trade.entryPrice}</td>
                             <td>{trade.exitPrice}</td>
                             <td className='td-side'>long</td>
                             <td
                                className={`td-pl ${
                                   trade.pl > 0 ? 'positive' : 'negative'
                                }`}
                             >
                                ${trade.pl}
                             </td>
                             <td>
                                {trade.strategyType ? (
                                   trade.strategyType
                                ) : (
                                   <p>no strategy</p>
                                )}
                             </td>
                             <td>
                                <Link to={`edit/${trade._id}`}>
                                   <button className='btn-style-3'>edit</button>
                                </Link>
                             </td>
                             <td>
                                <button
                                   className='btn-style-3'
                                   onClick={() => onRemoveTrade(trade._id)}
                                >
                                   X
                                </button>
                             </td>
                          </tr>
                       )
                    })
                  : ''}
            </tbody>
         </table>
      </section>
   )
}
