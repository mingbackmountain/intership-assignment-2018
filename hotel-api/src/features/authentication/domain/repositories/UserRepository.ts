import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(hotelId: string, email: string, password: string) {
    const user = this.create({
      id: parseInt(hotelId),
      email: email,
      password: password
    });

    await this.save(user);
  }

  async getUser(email: string, password: string) {
    const user = await this.findOneOrFail({
      email: email
    });

    return user;
  }
}
