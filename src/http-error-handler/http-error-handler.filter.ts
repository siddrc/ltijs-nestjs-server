/* eslint-disable max-len */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
@Catch(HttpException)
export class HttpErrorHandler implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { message } = exception;
    const status = exception.getStatus();
    if (process.env.NODE_ENV === 'production')
      this.sendToTeams(exception, host);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
  sendToTeams(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const httpService = new HttpService();
    httpService
      .post(process.env.TEAMS_WEBHOOK_URL, {
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        themeColor: '0076D7',
        summary: 'LTIv1p3 API Error',
        sections: [
          {
            activityTitle: 'LTIv1p3 API Error',
            activitySubtitle: `url:${request.url} , body: ${JSON.stringify(request.body)} , message: ${
              exception.message
            }`,
            facts: [
              {
                name: 'Status Code',
                value: status,
              },
              {
                name: 'Timestamp',
                value: new Date().toISOString(),
              },
              {
                name: 'Message',
                value: exception.message,
              },
            ],
            markdown: true,
          },
        ],
      })
      .subscribe();
  }
}
