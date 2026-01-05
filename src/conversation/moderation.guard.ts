import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { findViolations, tokenize } from 'src/utils/moderation';

@Injectable()
export class ModerationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const data = context.switchToWs().getData<{ message: string }>();
    const message = data.message;

    const tokens = tokenize(message);

    const rules: ModerationRule[] = [
      { w1: 'buy', w2: 'drugs', maxDistance: 3 },
      { w1: 'sell', w2: 'drugs', maxDistance: 3 },
      { w1: 'hack', w2: 'system', maxDistance: 5 },
    ];

    const violations = findViolations(tokens, rules);

    if (violations.length > 0) {
      throw new BadRequestException({
        code: 'MODERATION_VIOLATION',
        violations,
      });
    }

    return true;
  }
}
