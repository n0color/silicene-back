import { error } from 'console';
import jwt from 'jsonwebtoken'
import prisma from '~/utils/prisma.js';

class TokenService {

  generateTokens(payload: object) {
    const accessSecret = process.env.JWT_ACCESS_SECRET || "syperstring";
    const accessToken = jwt.sign(payload, accessSecret, {expiresIn: '45m'})
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "syperstring";
    const refreshToken = jwt.sign(payload, refreshSecret, {expiresIn: '45d'})
    return {
      accessToken,
      refreshToken
    }
  }
  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "syperstring");
      return userData;
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(token: string) { 
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "syperstring");
      return userData;
    } catch (e) {
      return null;
    }
  }
  async findToken(refreshToken: string) {
    return await prisma.tokens.findFirst({
      where: { refreshToken: refreshToken }
    });
  }
  
  async saveToken(userId: number, refreshToken: string ) {
    const tokenData = await prisma.tokens.findUnique({
      where: {
        user_id: userId,
      },
    });
    
    if (tokenData) {
      await prisma.tokens.update({
        where: {
          user_id: userId,
        },
        data: {
          refreshToken: refreshToken,
        },
      });
    }
    const token = await prisma.tokens.create({
      data: {
        user_id: userId,
        refreshToken: refreshToken,
      }
    });
    return token;
    
  }

} 

export default new TokenService();