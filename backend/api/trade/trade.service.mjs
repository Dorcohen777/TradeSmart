import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const PAGE_SIZE = 3

async function query(filterBy = { txt: '' }) {
   try {
      const criteria = {
         vendor: { $regex: filterBy.txt, $options: 'i' },
      }
      const collection = await dbService.getCollection('trade')
      var tradeCursor = await collection.find(criteria)

      if (filterBy.pageIdx !== undefined) {
         tradeCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
      }

      const trades = tradeCursor.toArray()
      return trades
   } catch (err) {
      logger.error('cannot find trades', err)
      throw err
   }
}

async function getById(tradeId) {
   try {
      const collection = await dbService.getCollection('trade')
      const trade = collection.findOne({ _id: ObjectId(tradeId) })
      return trade
   } catch (err) {
      logger.error(`while finding trade ${tradeId}`, err)
      throw err
   }
}

async function remove(tradeId) {
   try {
      const collection = await dbService.getCollection('trade')
      await collection.deleteOne({ _id: ObjectId(tradeId) })
      return tradeId
   } catch (err) {
      logger.error(`cannot remove trade ${tradeId}`, err)
      throw err
   }
}

async function add(trade) {
   try {
      const collection = await dbService.getCollection('trade')
      await collection.insertOne(trade)
      return trade
   } catch (err) {
      logger.error('cannot insert trade', err)
      throw err
   }
}

async function update(trade) {
   try {
      const tradeToSave = {
         amount: trade.amount,
         entryPrice: trade.entryPrice,
         exitPrice: trade.exitPrice,
      }

      const collection = await dbService.getCollection('trade')
      await collection.updateOne(
         { _id: ObjectId(trade._id) },
         { $set: tradeToSave }
      )
      return trade
   } catch (err) {
      logger.error(`cannot update trade ${tradeId}`, err)
      throw err
   }
}

async function addTradeMsg(tradeId, msg) {
   try {
      msg.id = utilService.makeId()
      const collection = await dbService.getCollection('trade')
      await collection.updateOne(
         { _id: ObjectId(tradeId) },
         { $push: { msgs: msg } }
      )
      return msg
   } catch (err) {
      logger.error(`cannot add trade msg ${tradeId}`, err)
      throw err
   }
}

async function removeTradeMsg(tradeId, msgId) {
   try {
      const collection = await dbService.getCollection('trade')
      await collection.updateOne(
         { _id: ObjectId(tradeId) },
         { $pull: { msgs: { id: msgId } } }
      )
      return msgId
   } catch (err) {
      logger.error(`cannot add trade msg ${tradeId}`, err)
      throw err
   }
}

export const tradeService = {
   remove,
   query,
   getById,
   add,
   update,
   addTradeMsg,
   removeTradeMsg,
}
