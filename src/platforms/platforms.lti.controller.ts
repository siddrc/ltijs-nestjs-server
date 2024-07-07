import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { CustomersService } from 'src/customers/customers.service';
@Controller('lti')
export class PlatformsLtiController {
  constructor(
    private configService: ConfigService,
    private customersService: CustomersService,
  ) {}
  @Get('nolti')
  async nolti(@Req() req: Request, @Res() res: Response) {
    res.send(this.configService.get('SUPPORT_MESSAGE'));
  }

  @Get('ping')
  async ping(@Req() req: Request, @Res() res: Response) {
    res.send('pong');
  }

  @Get('protected')
  async protected(@Req() req: Request, @Res() res: Response) {
    res.send('Insecure');
  }
}
