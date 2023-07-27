import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckingUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckingUseCaseResponse {
  checkIn: CheckIn
}

export class CheckingUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckingUseCaseRequest): Promise<CheckingUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
