import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/usecases/errors/user-already-exists.error'
import { makeUserUseCase } from '@/usecases/factories/make-user-usecase'

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
    const userUseCase = makeUserUseCase()

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
