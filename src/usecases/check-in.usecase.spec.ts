import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckingUseCase } from './check-in.usecase'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkinsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkingUseCase: CheckingUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkingUseCase = new CheckingUseCase(checkinsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Academia 1',
      description: 'Teste',
      phone: '',
      latitude: new Decimal(-23.510182),
      longitude: new Decimal(-46.6560802),
    })

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia 1',
      description: 'Teste',
      phone: '',
      latitude: -23.51026,
      longitude: -46.656,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await checkingUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.510182,
      userLongitude: -46.6560802,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkingUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.510182,
      userLongitude: -46.6560802,
    })

    await expect(() =>
      checkingUseCase.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -23.510182,
        userLongitude: -46.6560802,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia 1',
      description: 'Teste',
      phone: '',
      latitude: new Decimal(-23.5187337),
      longitude: new Decimal(-46.6603771),
    })

    await expect(() =>
      checkingUseCase.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -23.510182,
        userLongitude: -46.6560802,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
