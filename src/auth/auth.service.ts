import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    return { status: 'success', login: 'login' };
  }

  signup() {
    return { status: 'success', login: 'signup' };
  }
}
