import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckingUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckingUseCaseResponse {
  checkIn: CheckIn
}

export class CheckingUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepositgymory: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
  }: CheckingUseCaseRequest): Promise<CheckingUseCaseResponse> {
    const gym = await this.gymsRepositgymory.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserInOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
