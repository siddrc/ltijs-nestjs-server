import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PlatformsAuthenticationMiddleware } from './platforms.authentication.middleware';
import { PlatformsLtiController } from './platforms.lti.controller';
import { CustomerLearnerLicensesModule } from '../customer-learner-licenses/customer-learner-licenses.module';
import { CustomersModule } from '../customers/customers.module';
import { PlatformsController } from './platforms.controller';

@Module({
  imports: [CustomerLearnerLicensesModule, CustomersModule],
  controllers: [PlatformsLtiController, PlatformsController],
})
export class PlatformsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PlatformsAuthenticationMiddleware).forRoutes('lti');
  }
}
