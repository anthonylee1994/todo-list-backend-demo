import { ValidationError } from 'class-validator';
import { Task } from '../task.entity';
import { TaskController } from '../task.controller';
import { Test } from '@nestjs/testing';
import { TaskService } from '../task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDB } from '../../config/database';
import { UnprocessableEntityException } from '@nestjs/common';

describe('TaskService', () => {

    let taskService: TaskService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(testDB as any),
                TypeOrmModule.forFeature([Task]),
            ],
            controllers: [TaskController],
            components: [TaskService],
        }).compile();
        taskService = module.get<TaskService>(TaskService);
        await taskService.removeAll();
    });

    it('can save tasks', async () => {
        const task1 = new Task();
        task1.name = 'Task 1';
        task1.position = 0;
        task1.dueDate = new Date('2018-05-01');
        const savedTask1 = await taskService.save(task1);
        expect(savedTask1.id).toEqual(1);

        const task2 = new Task();
        task2.name = 'Task 2';
        task2.position = 1;
        task2.dueDate = new Date('2018-05-02');
        const savedTask2 = await taskService.save(task2);
        expect(savedTask2.id).toEqual(2);

        const wrongTask = new Task();

        let error;
        try {
            await taskService.save(wrongTask);
        } catch (e) {
            error = e.message;
        }

        expect(error).toEqual({
            error: 'Unprocessable Entity',
            message: [
                {
                    children: [],
                    constraints: {
                        isNotEmpty: 'name should not be empty',
                        isString: 'name must be a string',
                    }, property: 'name',
                    target: {},
                }, {
                    children: [],
                    constraints: {
                        isDate: 'dueDate must be a Date instance',
                        isNotEmpty: 'dueDate should not be empty',
                    }, property: 'dueDate',
                    target: {},
                },
            ],
            statusCode: 422,
        });
    });

    it('can list all tasks', async () => {
        expect((await taskService.list()).length).toEqual(2);
    });

    it('can show single task by id', async () => {
        expect((await taskService.show(2)).name).toEqual('Task 2');
    });

    it('can update by single item', async () => {
        const task1 = {
            id: 1,
            name: 'Updated Task 1',
            position: 1,
        };

        const updateTask1 = await taskService.updateByItem(task1);
        expect(updateTask1.id).toEqual(task1.id);
        expect(updateTask1.name).toEqual(task1.name);
        expect(updateTask1.position).toEqual(task1.position);
        expect(new Date(updateTask1.dueDate).getTime()).toEqual(new Date('2018-05-01').getTime());

        const task2 = {
            id: 2,
            name: 'Updated Task 2',
            position: 0,
        };

        const updateTask2 = await taskService.updateByItem(task2);
        expect(updateTask2.id).toEqual(task2.id);
        expect(updateTask2.name).toEqual(task2.name);
        expect(updateTask2.position).toEqual(task2.position);
        expect(new Date(updateTask2.dueDate).getTime()).toEqual(new Date('2018-05-02').getTime());

        const notFoundTask = { id: 3 };

        let error;

        try {
            await taskService.updateByItem(notFoundTask);
        } catch (e) {
            error = e.message;
        }
        expect(error).toEqual({
            error: 'Not Found',
            message: {
                id: 3,
            },
            statusCode: 404,
        });

        const wrongTask = {
            id: 2,
            name: 'I am wrong',
            position: 'ABC',
        };

        try {
            await taskService.updateByItem(wrongTask as any);
        } catch (e) {
            error = e.message;
        }

        const secondTask = await taskService.show(2);

        expect(error).toEqual({
            error: 'Unprocessable Entity',
            message: [{
                children: [],
                constraints: {
                    isInt: 'position must be an integer number',
                },
                property: 'position',
                target: {
                    ...secondTask,
                    ...wrongTask,
                    dueDate: new Date(secondTask.dueDate),
                },
                value: 'ABC',
            }],
            statusCode: 422,
        });

    });

    it('can update by multiple items', async () => {
        const tasks = [
            {
                id: 1,
                name: 'Multiple Updated Task 1',
                position: 0,
            },
            {
                id: 2,
                name: 'Multiple Updated Task 2',
                position: 1,
            },
        ];
        const updatedTasks = await taskService.updateByItems(tasks);
        expect(updatedTasks[0].id).toEqual(tasks[0].id);
        expect(updatedTasks[0].name).toEqual(tasks[0].name);
        expect(updatedTasks[0].position).toEqual(tasks[0].position);
        expect(new Date(updatedTasks[0].dueDate).getTime()).toEqual(new Date('2018-05-01').getTime());
        expect(updatedTasks[1].id).toEqual(tasks[1].id);
        expect(updatedTasks[1].name).toEqual(tasks[1].name);
        expect(updatedTasks[1].position).toEqual(tasks[1].position);
        expect(new Date(updatedTasks[1].dueDate).getTime()).toEqual(new Date('2018-05-02').getTime());
    });

    it('can remove by single id', async () => {
        await taskService.removeById(1);

        let error;

        try {
            await taskService.show(1);
        } catch (e) {
            error = e.message;
        }

        expect(error).toEqual({ error: 'Not Found', message: { id: 1 }, statusCode: 404 });

        try {
            await (taskService as any).removeById();
        } catch (e) {
            error = e.message;
        }

        expect(error).toEqual({
            error: 'Unprocessable Entity',
            message: [
                {
                    children: [],
                    constraints: {
                        isNotEmpty: 'id should not be empty',
                    }, property: 'id',
                    target: {},
                },
            ],
            statusCode: 422,
        });
    });

    it('can remove by multiple ids', async () => {
        await taskService.removeByIds([2]);

        let error;

        try {
            await taskService.show(2);
        } catch (e) {
            error = e.message;
        }

        expect(error).toEqual({ error: 'Not Found', message: { id: 2 }, statusCode: 404 });

        try {
            await (taskService as any).removeByIds([]);
        } catch (e) {
            error = e.message;
        }
        expect(error).toEqual({
            error: 'Unprocessable Entity',
            message: [
                {
                    children: [],
                    constraints: {
                        isNotEmpty: 'ids should not be empty',
                    }, property: 'ids',
                    target: {},
                },
            ],
            statusCode: 422,
        });
    });

});