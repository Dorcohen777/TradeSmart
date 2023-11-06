import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import mongodb from 'mongodb'
import { utilService } from '../../services/util.service.mjs'
const { ObjectId } = mongodb

async function query() {
   try {
      const collection = await dbService.getCollection('strategy')
      var findStrategies = await collection.find('')
      const strategies = findStrategies.toArray()
      return strategies
   } catch (err) {
      logger.error('cannot find strategies', err)
      throw err
   }
}

async function add(strategyName) {
   try {
      const collection = await dbService.getCollection('strategy')
      await collection.insertOne(strategyName)
      return strategyName
   } catch (err) {
      logger.error('Cannot insert strategy', err)
      throw err
   }
}

export const strategyService = {
   query,
   add,
}
