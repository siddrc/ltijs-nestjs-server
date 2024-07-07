import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Provider as lti } from 'ltijs';
import { Token } from '../lti-data-types';
import { DeepLinkingDto } from './deep-linking.dto';
@Controller('lti/deeplink')
export class DeepLinkingController {
  private logger = new Logger(DeepLinkingController.name);
  @Post()
  async deeplink(
    @Req() req: Request,
    @Res() res: Response,
    @Body() deeplinkDto: DeepLinkingDto,
  ) {
    try {
      if (
        Array.isArray(deeplinkDto.courses) &&
        deeplinkDto.courses.length > 0
      ) {
        const token = res.locals.token as Token;
        const deepLinkedCourses = deeplinkDto.courses.map((course) => {
          return {
            type: 'ltiResourceLink',
            title: course.courseName,
            custom: {
              name: course.courseName,
              value: course.courseId,
            },
          };
        });
        const deepLinkingMessage =
          await lti.DeepLinking.createDeepLinkingMessage(
            token,
            deepLinkedCourses,
            { message: 'Successfully Registered' },
          );
        const responseJson = {
          deepLinkingMessage,
          lmsEndpoint:
            token.platformContext.deepLinkingSettings.deep_link_return_url,
        };
        if (deepLinkingMessage) res.send(responseJson);
        else throw new Error('No Deep Linking Message created.');
      } else throw new Error('No Courses selected for deep linking.');
    } catch (err) {
      console.log(`${err.message} - ${err.stack}`);
      res.status(500).send(err.message);
    }
  }
}
