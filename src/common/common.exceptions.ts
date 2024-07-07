import { HttpException, HttpStatus } from '@nestjs/common';

export const generateBadRequestException = (message) => {
  throw new HttpException(
    {
      statusCode: HttpStatus.BAD_REQUEST,
      message,
    },
    HttpStatus.BAD_REQUEST,
  );
};

export const generateNotFoundException = (entity: string) => {
  throw new HttpException(
    {
      statusCode: HttpStatus.NOT_FOUND,
      message: `${entity} not found.`,
    },
    HttpStatus.NOT_FOUND,
  );
};
