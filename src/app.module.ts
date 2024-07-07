import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PlatformsModule } from './platforms/platforms.module';
import { CoursesModule } from './courses/courses.module';
import { DatabaseModule } from './database.module';
import { DeepLinkingModule } from './deep-linking/deep-linking.module';
import { GradesModule } from './grades/grades.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
      exclude: ['/lti/(.*)', '/api/(.*)'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlatformsModule,
    CoursesModule,
    DatabaseModule,
    CoursesModule,
    DeepLinkingModule,
    GradesModule,
  ],
})
export class AppModule {}
