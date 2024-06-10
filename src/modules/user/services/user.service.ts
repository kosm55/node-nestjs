import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { LoggerService } from '../../logger/logger.service';
import { FollowRepository } from '../../repository/services/follow.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../dto/req/update-user.req.dto';
import { UserResDto } from '../dto/res/user.res.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  //private readonly logger = new Logger(TagService.name);

  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
  ) {}

  public async getMe(userData: IUserData): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    return UserMapper.toResponseDTO(user);
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const updatedUser = await this.userRepository.save({ ...user, ...dto });
    return UserMapper.toResponseDTO(updatedUser);
  }

  public async getById(userId: string): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return UserMapper.toResponseDTO(user);
  }

  public async remove(userId: string): Promise<any> {}

  public async follow(userData: IUserData, userId: string): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('you cannot follow yourself');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });
    if (follow) {
      throw new ConflictException('you are already following this user ');
    }
    await this.followRepository.save(
      this.followRepository.create({
        follower_id: userData.userId,
        following_id: userId,
      }),
    );
    //create трасформує наш об'єкт в ентіті , а потім save уже збереже
  }

  public async unfollow(userData: IUserData, userId: string): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('you cannot follow yourself');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });
    if (!follow) {
      throw new ConflictException('you cannot unfollow this user ');
    }
    await this.followRepository.remove(follow);
    //remove видаляє одразу ентіті, а delete по параметрам які ми передаємо
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('email is already taken');
    }
  }
}
