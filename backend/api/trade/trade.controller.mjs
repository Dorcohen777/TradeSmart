import {tradeService} from './trade.service.mjs'
import {logger} from '../../services/logger.service.mjs'

export async function getTrades(req, res) {
  try {
    logger.debug('Getting Trades:', req.query)
    const filterBy = {
      txt: req.query.txt || '',
      pageIdx: req.query.pageIdx
    }
    const trades = await tradeService.query(filterBy)
    res.json(trades)
  } catch (err) {
    logger.error('Failed to get trades', err)
    res.status(400).send({ err: 'Failed to get trades' })
  }
}

export async function getTradeById(req, res) {
  try {
    const tradeId = req.params.id
    const trade = await tradeService.getById(tradeId)
    res.json(trade)
  } catch (err) {
    logger.error('Failed to get trade', err)
    res.status(400).send({ err: 'Failed to get trade' })
  }
}

export async function addTrade(req, res) {
  const {loggedinUser} = req
  console.log('from front', req.body)
  try {
    const trade = req.body
    trade.owner = loggedinUser
    const addedTrade = await tradeService.add(trade)
    res.json(addedTrade)
  } catch (err) {
    logger.error('Failed to add trade', err)
    res.status(400).send({ err: 'Failed to add trade' })
  }
}


export async function updateTrade(req, res) {
  try {
    const trade = req.body
    const updatedTrade = await tradeService.update(trade)
    res.json(updatedTrade)
  } catch (err) {
    logger.error('Failed to update trade', err)
    res.status(400).send({ err: 'Failed to update trade' })

  }
}

export async function removeTrade(req, res) {
  try {
    const tradeId = req.params.id
    const removedId = await tradeService.remove(tradeId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove trade', err)
    res.status(400).send({ err: 'Failed to remove trade' })
  }
}

export async function addTradeMsg(req, res) {
  const {loggedinUser} = req
  try {
    const tradeId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await tradeService.addTradeMsg(tradeId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update trade', err)
    res.status(400).send({ err: 'Failed to update trade' })

  }
}

export async function removeTradeMsg(req, res) {
  const {loggedinUser} = req
  try {
    const tradeId = req.params.id
    const {msgId} = req.params

    const removedId = await tradeService.removeTradeMsg(tradeId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove trade msg', err)
    res.status(400).send({ err: 'Failed to remove trade msg' })

  }
}


