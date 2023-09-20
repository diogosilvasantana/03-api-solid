import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym.usecase'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym UseCase', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Smartfit',
      description: 'Smartfit',
      phone: '+551199999999',
      latitude: -23.51026,
      longitude: -46.656,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
