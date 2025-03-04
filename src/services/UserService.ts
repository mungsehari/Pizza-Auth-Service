import { Repository } from "typeorm";
import createHttpError from "http-errors";
import { User } from "../entity/User";
import { UserData } from "../types";
import { Roles } from "../constants";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async create({ firstName, lastName, email, password }: UserData) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role: Roles.CUSTOMER,
      });
    } catch (error) {
      const err = createHttpError(500, "Failed to store the data in database ");
      throw err;
    }
  }
}
