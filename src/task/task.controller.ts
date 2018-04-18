import { Task } from './task.entity';
import { TaskService } from './task.service';
import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';

@Controller('tasks')
export class TaskController {

    constructor(private readonly taskService: TaskService) {
    }

    @Get()
    async list(): Promise<Task[]> {
        return await this.taskService.list();
    }

    @Post()
    async save(@Body() task: Task): Promise<Task> {
        return await this.taskService.save(task);
    }

    @Get(':id')
    async show(@Param() params): Promise<Task> {
        return await this.taskService.show(params.id);
    }

    @Patch()
    async update(@Body() task: Partial<Task> | Partial<Task>[]): Promise<Task | Task[]> {
        if (Array.isArray(task)) {
            return await this.taskService.updateByItems(task);
        } else {
            return await this.taskService.updateByItem(task);
        }
    }

    @Delete()
    async remove(@Body() body: any = {}) {
        if (Array.isArray(body.ids)) {
            return await this.taskService.removeByIds(body.ids);
        } else {
            return await this.taskService.removeById(body.id);
        }
    }
}