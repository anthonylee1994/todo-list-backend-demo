import { TaskModule } from './../task.module';
import { TaskController } from './../task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { testDB } from '../../config/database';
import { Task } from '../task.entity';
import { TaskService } from '../task.service';
import express from 'express';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';

describe('TaskController', () => {

    const server = express();
    let taskController: TaskController;
    const taskService = {
        show: async (id: number) => ({
            name: 'Task 1',
            dueDate: '2018-05-01T00:00:00.000Z',
            position: id,
            id,
            dateUpdated: '2018-04-18T07:23:50.097Z',
            dateCreated: '2018-04-18T07:23:50.097Z',
        }),
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(testDB as any),
                TypeOrmModule.forFeature([Task]),
            ],
            controllers: [TaskController],
            components: [TaskService],
        })
            .compile();

        taskController = module.get<TaskController>(TaskController);
        module.get<TaskService>(TaskService).removeAll();

        const app = module.createNestApplication(server);
        await app.init();
    });

    it('/POST task1', () => {
        return request(server)
            .post('/tasks')
            .send({
                name: 'Task 1',
                dueDate: new Date('2018-05-01'),
                position: 1,
            })
            .expect(HttpStatus.CREATED);
    });

    it('/POST task2', () => {
        return request(server)
            .post('/tasks')
            .send({
                name: 'Task 2',
                dueDate: new Date('2018-05-02'),
                position: 2,
            })
            .expect(HttpStatus.CREATED);
    });

    it('/GET tasks', () => {
        return request(server)
            .get('/tasks')
            .expect(HttpStatus.OK);
    });

    it('/GET task 1', () => {
        return request(server)
            .get('/tasks/1')
            .expect(HttpStatus.OK);
    });

    it('/PATCH task 1', () => {
        return request(server)
            .patch('/tasks')
            .send({
                item: {
                    id: 1,
                    name: 'Task X',
                },
            })
            .expect(HttpStatus.OK);
    });

    it('/PATCH tasks', () => {
        return request(server)
            .patch('/tasks')
            .send({
                items: [
                    {
                        id: 1,
                        name: 'Task X',
                    },
                    {
                        id: 2,
                        name: 'Task Y',
                    },
                ],
            })
            .expect(HttpStatus.OK);
    });

    it('/DELETE task 1', () => {
        return request(server)
            .delete('/tasks')
            .send({
                id: 1,
            })
            .expect(HttpStatus.OK);
    });

    it('/DELETE tasks', () => {
        return request(server)
            .delete('/tasks')
            .send({
                ids: [2],
            })
            .expect(HttpStatus.OK);
    });
});