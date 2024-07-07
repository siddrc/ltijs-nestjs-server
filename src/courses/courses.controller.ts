import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Token } from 'src/lti-data-types';

@Controller('lti/courses')
export class CoursesController {
  private readonly logger = new Logger(CoursesController.name);
  @Get('/:id')
  async getCourse(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = res.locals.token as Token;
    res.json({course:"This is a course"});
  }
}
