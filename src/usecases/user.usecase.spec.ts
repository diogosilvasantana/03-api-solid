import { expect, describe, it } from 'vitest'
import { UserUseCase } from './user.usecase'
import { compare } from 'bcryptjs'

describe('User UseCase', () => {
  it('should hash user password upon registration', async () => {
    const userUseCase = new UserUseCase({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async findByEmail(email) {
        return null
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await userUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '12345',
    })

    const isPasswordCorrectlyHashed = await compare('12345', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
