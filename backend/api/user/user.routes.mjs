import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.mjs'
import { getUser, getUsers, deleteUser, updateUser, addUser } from './user.controller.mjs'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('auth/signup', addUser) // creating new user
router.post('auth/login', getUser) // when user trying to login
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

export const userRoutes = router
