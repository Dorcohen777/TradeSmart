import { logger } from '../../services/logger.service.mjs'
import { strategyService } from './strategy.service.mjs'

export async function getStrategies(req, res) {
   try {
      logger.debug('Getting strategies:', req.query)
      const strategies = await strategyService.query()
      res.json(strategies)
   } catch (err) {
      logger.error('Failed to get strategies', err)
   }
}

export async function addStrategy(req, res) {
   try {
      const { loggedinUser } = req
      const strategyName = req.body
      strategyName.owner = loggedinUser
      const addedStrategy = await strategyService.add(strategyName)
      res.json(addedStrategy)
   } catch (err) {
    logger.error('Failed to add strategy', err)
    res.status(400).send({err: 'Failed to add strategy'})
   }
}
