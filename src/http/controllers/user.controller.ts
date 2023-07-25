import { PrismaUsersRepository } from './../../repositories/prisma/prisma-users-repository'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserUseCase } from '@/usecases/user.usecase'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/usecases/errors/user-already-exists.error'

export async function userController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchemma = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchemma.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const userUseCase = new UserUseCase(usersRepository)

    await userUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: err.message,
      })
    }

    throw err
  }

  return reply.status(201).send()
}
