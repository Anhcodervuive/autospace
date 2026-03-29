import { Injectable } from '@nestjs/common';
import { add } from '@autospace/sample-lib';

@Injectable()
export class AppService {
  getHello(): string {
    return `1 + 1 = ${add(1, 1)}`;
  }
}
