import { Repository } from "typeorm";
import createHttpError from "http-errors";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import { UserData } from "../types";
import { Roles } from "../constants";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async create({ firstName, lastName, email, password, role }: UserData) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user) {
      const err = createHttpError(400, "Email is already exists!");
      throw err;
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to store the data in the database",
      );
      throw error;
    }
  }
}
