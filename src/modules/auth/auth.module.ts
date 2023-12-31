import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config'

import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { LocalStrategy } from './strategies/local.strategy'
import { SessionSerializer } from './strategies/session.serializer'

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  exports: [AuthService]
})
export class AuthModule {}
