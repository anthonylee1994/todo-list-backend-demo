import { TaskModule } from './task/task.module';
import {
  Module,
  MiddlewaresConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { defaultDB } from './config/database';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(defaultDB as any),
    TaskModule,
  ],
  components: [],
  controllers: [AppController],
})
export class AppModule {
}
