import { Module } from '@nestjs/common';
import { DeepLinkingController } from './deep-linking.controller';

@Module({
  controllers: [DeepLinkingController],
})
export class DeepLinkingModule {}
