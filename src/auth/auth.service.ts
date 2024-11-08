import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs'

@Injectable()
export class AuthService {
  //creamos el constructor para usar el servicio de usuario
  constructor(
    private readonly jwtService: JwtService) { }
  async create(createAuthDto: CreateAuthDto) {
   
  }
}
