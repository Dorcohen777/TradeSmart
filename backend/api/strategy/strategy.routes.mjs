import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.mjs'
import { log } from '../../middlewares/logger.middleware.mjs'
import { getStrategies, addStrategy } from './strategy.controller.mjs'

const router = express.Router()

router.get('/', log, getStrategies)
router.post('/', requireAuth, addStrategy)

export const strategyRoutes = router
