import { FastifyInstance } from 'fastify'
import { userController } from './controllers/user.controller'
import { authenticateController } from './controllers/authenticate.controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', userController)

  app.post('/sessions', authenticateController)
}
