import { TaskModule } from './task/task.module';
import {
  Module,
  MiddlewaresConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { defaultDB } from './config/database';

@Module({
  imports: [
    TypeOrmModule.forRoot(defaultDB as any),
    TaskModule,
  ],
  components: [],
})
export class AppModule {
}
