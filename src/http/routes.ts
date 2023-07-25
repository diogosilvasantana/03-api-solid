import { FastifyInstance } from 'fastify'
import { userController } from './controllers/user.controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', userController)
}
