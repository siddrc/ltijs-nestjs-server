import {
  Injectable,
  Logger,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Provider as lti } from 'ltijs';
import * as Database from 'ltijs-sequelize';
import * as path from 'path';
import { CustomerLearnerLicensesService } from 'src/customer-learner-licenses/customer-learner-licenses.service';
import { Token } from 'src/lti-data-types';
import { CustomersService } from 'src/customers/customers.service';
import { ERROR_TOKENS } from './client-url.constants';

@Injectable()
export class PlatformsAuthenticationMiddleware
  implements NestMiddleware, OnModuleInit
{
  private readonly logger = new Logger(PlatformsAuthenticationMiddleware.name);
  private SSL_BASED_ENVIRONMENTS = ['production', 'staging', 'development'];
  constructor(
    private configService: ConfigService,
    private customerLearnerLicensesService: CustomerLearnerLicensesService,
    private customersService: CustomersService,
  ) {}
  async onModuleInit() {
    this.logger.log('LTI middleware initializing...');
    const isSSLMode = this.SSL_BASED_ENVIRONMENTS.includes(
      this.configService.get('NODE_ENV'),
    );
    const dialectOptions = isSSLMode
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {};
    const db = new Database(
      this.configService.get('LTI_PLATFORMS_DB'),
      this.configService.get('DB_USER'),
      this.configService.get('DB_PASSWORD'),
      {
        host: this.configService.get('DB_HOST'),
        port: +this.configService.get('DB_PORT'),
        dialect: 'postgres',
        dialectOptions,
        logging: this.logger.log,
      },
    );

    lti.setup(
      this.configService.get('LTI_KEY'),
      {
        plugin: db,
      },
      {
        appRoute: '/',
        invalidTokenRoute: '/invalidtoken', //TODO: this needs to be tested
        sessionTimeoutRoute: '/sessionTimeout', //TODO: this needs to be tested
        keysetRoute: '/keys',
        loginRoute: '/login',
        dynRegRoute: '/registration',
        tokenMaxAge: +this.configService.get('TOKEN_MAX_AGE'), // might need to change this to a more bigger value
        staticPath: path.join(__dirname, '../../public'), // Path to static files
        ltiaas: true,
        cookies: {
          secure: this.configService.get('COOKIE_SECURE') === 'true',
          sameSite: this.configService.get('COOKIE_SAME_SITE'),
        },
      },
    );

    // Whitelisting the main app route and /nolti to create a landing page
    lti.whitelist(
      {
        route: new RegExp(/^\/nolti$/),
        method: 'get',
      },
      {
        route: new RegExp(/^\/ping$/),
        method: 'get',
      },
      {
        route: new RegExp(/^\/registerPlatform$/),
        method: 'post',
      },
      {
        route: '/static/*',
        method: 'get',
      },
    );
    lti.onConnect(async (token, req: Request, res: Response) => {
      try {
        this.logger.log('Reached successfully to onConnect...');
        if (token) {
          const generatedToken: Token = token;
          const customer = await this.customersService.getCustomerData(
            generatedToken.clientId,
          );
          if (customer && customer.isEnabled && customer.isLtiV3Customer) {
            await this.customerLearnerLicensesService.logUsage(
              generatedToken.clientId,
              generatedToken.userInfo.given_name,
              generatedToken.userInfo.family_name,
              generatedToken.userInfo.email,
            );
            this.logger.log('Checking if deep linking is enabled...');
            const { custom } = generatedToken.platformContext;
            if (custom && custom.value) {
              this.logger.log('Redirecting to deep-linked course...');
              return lti.redirect(
                res,
                `/?redirectUrl=${this.configService.get('CLIENT_URL')}/course-details/${custom.value}`,
                { sameSite: 'None' },
              );
            }
            this.logger.log('Redirecting to client app...');
            lti.redirect(
              res,
              `/?redirectUrl=${this.configService.get('CLIENT_URL')}/courses`,
              { sameSite: 'None' },
            );
          } else {
            this.logger.log('Redirecting to /not-enabled...');
            return res.redirect(
              `/?redirectUrl=${this.configService.get('CLIENT_URL')}/errors/${ERROR_TOKENS.CUSTOMER_NOT_ENABLED}`,
            );
          }
        } else
          res.redirect(
            `/?redirectUrl=${this.configService.get('CLIENT_URL')}/errors/${ERROR_TOKENS.NO_LTI_TOKEN}`,
          );
      } catch (e) {
        this.logger.error('Error onConnect...', e);
        res.redirect(
          `/?redirectUrl=${this.configService.get('CLIENT_URL')}/errors/${ERROR_TOKENS.ERROR_IN_LTI_AUTH}`,
        );
      }
    });
    lti.onDeepLinking(async (token, req: Request, res: Response) => {
      this.logger.log('Got request for deep linking...');
      const generatedToken: Token = token;
      const customer = await this.customersService.getCustomerData(
        generatedToken.clientId,
      );
      if (customer && customer.isLtiV3DeeplinkingEnabled) {
        this.logger.log('Redirecting to client app for deep-linking...');
        return lti.redirect(
          res,
          `/deep-link.html?redirectUrl=${this.configService.get('CLIENT_URL')}/deeplink`,
          { isNewResource: true },
        );
      } else {
        this.logger.log('Redirecting to /deeplinking-not-enabled...');
        return res.redirect(
          `/?redirectUrl=${this.configService.get('CLIENT_URL')}/errors/${ERROR_TOKENS.DEEP_LINKING_NOT_ENABLED}`,
        );
      }
    });
    lti.onDynamicRegistration(async (_, res) => {
      return res.redirect(
        `/?redirectUrl=${this.configService.get('CLIENT_URL')}/errors/${ERROR_TOKENS.DYNAMIC_REGISTRATION_NOT_ENABLED}`,
      );
    });
    await lti.deploy({ serverless: true, silent: false });
  }
  use(req: Request, res: Response, next: () => void) {
    this.logger.log(`!!!!!!Signed Cookies [${req.signedCookies}]`);
    this.logger.log(`LTI middleware running for URL [${req.url}]`);
    lti.app(req, res, next);
  }
}
