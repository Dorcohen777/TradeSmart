import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.mjs'
import { log } from '../../middlewares/logger.middleware.mjs'
import { getTrades, getTradeById, addTrade, updateTrade, removeTrade, addTradeMsg, removeTradeMsg } from './trade.controller.mjs'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getTrades) // get all trades
router.get('/:id', getTradeById) // get trade by id
router.post('/',requireAuth, addTrade) // add new trade
router.put('/:id', requireAuth, updateTrade) // update existing trade
router.delete('/:id', requireAuth, removeTrade) // remove trade
// router.delete('/:id', requireAuth, requireAdmin, removeTrade)
// router.post('/:id/msg', requireAuth, addTradeMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeTradeMsg)

export const tradeRoutes = router
