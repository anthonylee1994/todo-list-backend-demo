import { Component, Inject, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { validate, ValidationError } from 'class-validator';

@Component()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) {
    }

    private bindData(task: Task, data: Partial<Task>) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                task[key] = data[key];
            }
        }
        task.dueDate = new Date(task.dueDate);
        return task;
    }

    async list(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    async show(id: number): Promise<Task> {
        const found = await this.taskRepository.findOneById(id);
        if (!found) {
            throw new NotFoundException({ id });
        }
        return found;
    }

    async save(task: Task): Promise<Task> {
        const errors: ValidationError[] = await validate(task);
        if (errors.length > 0) {
            throw new UnprocessableEntityException(errors);
        }
        return await this.taskRepository.save(task);
    }
    async updateByItem(task: Partial<Task>): Promise<Task> {

        if (!task) {
            throw new NotFoundException();
        }

        const found = await this.taskRepository.findOneById(task.id);

        if (!found) {
            throw new NotFoundException(JSON.parse(JSON.stringify(task)));
        }

        const errors: ValidationError[] = await validate(this.bindData(found, task));
        if (errors.length > 0) {
            throw new UnprocessableEntityException(errors);
        }

        const { id, dateCreated, dateUpdated, ...rest } = task;
        if (Object.keys(rest).length > 0) {
            await this.taskRepository.updateById(task.id, rest);
        }
        return await this.taskRepository.findOneById(task.id);
    }

    async updateByItems(tasks: Partial<Task>[]): Promise<Task[]> {
        const updatedTasks = [];
        for (const task of tasks) {
            const updated = await this.updateByItem(task);
            updatedTasks.push(updated);
        }
        return updatedTasks;
    }

    async removeById(id: number) {
        if (!id) {
            throw new UnprocessableEntityException([
                {
                    children: [],
                    constraints: {
                        isNotEmpty: 'id should not be empty',
                    }, property: 'id',
                    target: {},
                },
            ]);
        }
        if (isNaN(id)) {
            throw new UnprocessableEntityException([
                {
                    children: [],
                    constraints: {
                        isInt: 'id must be an integer number',
                    }, property: 'id',
                    target: {},
                },
            ]);
        }
        await this.taskRepository.removeById(id);
    }
    async removeByIds(ids: number[]) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new UnprocessableEntityException([
                {
                    children: [],
                    constraints: {
                        isNotEmpty: 'ids should not be empty',
                    }, property: 'ids',
                    target: {},
                },
            ]);
        }
        await this.taskRepository.removeById(ids);
    }

    async removeAll() {
        await this.taskRepository.query('DELETE FROM task');
        await this.taskRepository.query('DELETE FROM SQLITE_SEQUENCE WHERE name=\'task\'');
    }
}