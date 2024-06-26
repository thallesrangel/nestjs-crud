import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
   
  ) {}

  async canActivate(context: ExecutionContext) {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    const rolesFiltered = requiredRoles.filter(role => role === user.role);
    
    if (rolesFiltered.length > 0) {
      return true;
    } else {
      throw new UnauthorizedException('Você não tem permissão para executar esta ação.');
    }
  }
}
