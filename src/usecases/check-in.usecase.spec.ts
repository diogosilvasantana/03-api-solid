import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import { CheckingUseCase } from './check-in.usecase'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkinsRepository: InMemoryCheckInsRepository
let checkingUseCase: CheckingUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    checkinsRepository = new InMemoryCheckInsRepository()
    checkingUseCase = new CheckingUseCase(checkinsRepository)
  })

  it('should be able to get user profile', async () => {
    const { checkIn } = await checkingUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
