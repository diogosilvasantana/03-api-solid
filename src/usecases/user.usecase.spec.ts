import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserUseCase } from './user.usecase'

let usersRepository: InMemoryUsersRepository
let userUseCase: UserUseCase

describe('User UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userUseCase = new UserUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await userUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await userUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345',
    })

    const isPasswordCorrectlyHashed = await compare('12345', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'john.doe@example.com'

    await userUseCase.execute({
      name: 'John Doe',
      email,
      password: '12345',
    })

    await expect(() =>
      userUseCase.execute({
        name: 'John Doe',
        email,
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
