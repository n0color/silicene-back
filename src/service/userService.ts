import prisma from "~/utils/prisma.js";
import randomstring from "randomstring";
import bcrypt from 'bcrypt';
import tokenService from "./tokenService.js";
import ApiErrors from "~/exceptions/apiErrors.js";
import UserDto from "~/dtos/userDto.js";

class UserService {
  async registration(login: string, password: string) {
    try {
      const candidate = await prisma.users.findUnique({
        where: {
          login: login,
        }});
      if (candidate) {
        throw ApiErrors.BadRequest('Такой логин занят');
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const inviteLink = randomstring.generate(32);
      const user = await prisma.users.create({
        data: {
          login: login,
          password: hashPassword,
          invite: inviteLink,
        }
      });
      const userDto = new UserDto(user.id, user.login);
      const tokens = tokenService.generateTokens({ id: userDto.id, login: userDto.login });
      tokenService.saveToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user: userDto,
      }
    } catch (e) {
      console.log(e);
      throw e; // пробрасываем ошибку дальше
    }
  }

  async login(login: string, password: string) {
    const user = await prisma.users.findUnique({
      where: { login: login }
    });
    if (!user) {
      throw ApiErrors.BadRequest('Пользователь не найден');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw ApiErrors.BadRequest('Неверный пароль');
    }
    const userDto = new UserDto(user.id, user.login);
    const tokens = tokenService.generateTokens({ id: userDto.id, login: userDto.login });
    tokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    }
  }

  async logout(refreshToken: string) {
    const token = await prisma.tokens.findFirst({
      where: { refreshToken: refreshToken }
    });
    if (token) {
      await prisma.tokens.delete({
        where: { id: token.id }
      });
    }
    return token;
  }
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiErrors.UnauthorizedError();
    }
    
    // Валидируем токен и получаем данные пользователя
    const userData = tokenService.validateRefreshToken(refreshToken) as any;
    const user = await prisma.users.findUnique({
      where: { id: userData.id } // берем id из токена
    });  
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!user) {
      throw ApiErrors.UnauthorizedError();
    }
    if (!userData || !tokenFromDb) {
      throw ApiErrors.UnauthorizedError();
    }
    const userDto = new UserDto(user.id, user.login);
    const tokens = tokenService.generateTokens({ id: userDto.id, login: userDto.login });
    tokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    }
  }
  async getAllUsers() {
    const users = await prisma.users.findMany();
    return users;
  }
}

export default new UserService();