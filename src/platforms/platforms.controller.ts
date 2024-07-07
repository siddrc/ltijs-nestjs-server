import {
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Provider as lti } from 'ltijs';
import { ApiAuthGuard } from 'src/api-auth/api-auth.guard';
import { CustomersService } from 'src/customers/customers.service';
import { RevivePlatformDto } from './dtos/revive-platform.dto';
import { UpdatePlatformDto } from './dtos/update-platform-dto';
import { RegisterPlatformDto } from './dtos/register-platform.dto copy';
@Controller('api/platforms')
export class PlatformsController {
  private readonly logger = new Logger(PlatformsController.name);
  constructor(private customersService: CustomersService) {}

  @Delete('unregister/:clientId')
  @UseGuards(ApiAuthGuard)
  async unregisterPlatform(
    @Req() req: Request,
    @Res() res: Response,
    @Param('clientId') clientId: string,
  ) {
    let message = '';
    let status = 200;
    try {
      const customer = await this.customersService.getCustomerData(clientId);
      await lti.deletePlatform(customer.platformURL, clientId);
      await this.customersService.deleteCustomerData(clientId);
      status = 200;
      message = 'Platform unregistered';
    } catch (e) {
      status = 500;
      message = e.message;
    } finally {
      res.status(status).send(message);
    }
  }
  @Post('register')
  @UseGuards(ApiAuthGuard)
  async registerPlatform(
    @Req() req: Request,
    @Res() res: Response,
    @Body() platform: RegisterPlatformDto,
  ) {
    let message = '';
    let status = 200;
    try {
      await lti.registerPlatform({
        url: platform.platformURL,
        name: platform.name,
        clientId: platform.clientId,
        authenticationEndpoint: platform.authenticationEndpoint,
        accesstokenEndpoint: platform.accesstokenEndpoint,
        authConfig: {
          method: 'JWK_SET',
          key: platform.authConfigKeyEndpoint,
        },
      });
      await this.customersService.upsertPlatform({
        platformURL: platform.platformURL,
        name: platform.name,
        customerKey: platform.name,
        contactEmail: platform.contactEmail,
        isEnabled: platform.isEnabled,
        isLtiV3Customer: true,
        ltiV3ClientId: platform.clientId,
        isLtiV3DeeplinkingEnabled: platform.isLtiV3DeeplinkingEnabled,
        isLtiV3GradeServiceEnabled: platform.isLtiV3GradeServiceEnabled,
        numberOfLicensesPurchased: platform.numberOfLicensesPurchased,
      });
      status = 200;
      message = 'Platform registered';
    } catch (e) {
      status = 500;
      message = e.message;
    } finally {
      res.status(status).send(message);
    }
  }

  @Put('/revive')
  @UseGuards(ApiAuthGuard)
  async revivePlatform(
    @Req() req: Request,
    @Res() res: Response,
    @Body() platform: RevivePlatformDto,
  ) {
    let message = '';
    let status = 200;
    try {
      await lti.registerPlatform({
        url: platform.platformURL,
        name: platform.name,
        clientId: platform.clientId,
        authenticationEndpoint: platform.authenticationEndpoint,
        accesstokenEndpoint: platform.accesstokenEndpoint,
        authConfig: {
          method: 'JWK_SET',
          key: platform.authConfigKeyEndpoint,
        },
      });
      await this.customersService.updatePlatform({
        isEnabled: platform.isEnabled,
        ltiV3ClientId: platform.clientId,
        isLtiV3DeeplinkingEnabled: platform.isLtiV3DeeplinkingEnabled,
        isLtiV3GradeServiceEnabled: platform.isLtiV3GradeServiceEnabled,
        numberOfLicensesPurchased: platform.numberOfLicensesPurchased,
      });
      status = 200;
      message = 'Platform revived';
    } catch (e) {
      status = 500;
      message = e.message;
      this.logger.error('Error reviving platform', e.message);
    } finally {
      res.status(status).send(message);
    }
  }
  @Put('/update/:clientId')
  @UseGuards(ApiAuthGuard)
  async updatePlatform(
    @Req() req: Request,
    @Res() res: Response,
    @Body() platform: UpdatePlatformDto,
    @Param('clientId') clientId: string,
  ) {
    let message = '';
    let status = 200;
    try {
      const customer = await this.customersService.getCustomerData(clientId);
      if (customer && customer.isLtiV3Customer === true)
        await this.customersService.updatePlatform({
          isEnabled: platform.isEnabled,
          ltiV3ClientId: clientId,
          isLtiV3DeeplinkingEnabled: platform.isLtiV3DeeplinkingEnabled,
          isLtiV3GradeServiceEnabled: platform.isLtiV3GradeServiceEnabled,
          numberOfLicensesPurchased: platform.numberOfLicensesPurchased,
        });
      else
        throw new Error(
          `Platform(${clientId}) is not LTI v1.3 customer or does not exist`,
        );
      status = 200;
      message = 'Platform updated';
    } catch (e) {
      status = 500;
      message = e.message;
      this.logger.error('Error updating platform', e.message);
    } finally {
      res.status(status).send(message);
    }
  }
}
