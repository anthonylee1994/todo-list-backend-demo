"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./task.entity");
const class_validator_1 = require("class-validator");
let TaskService = class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    bindData(task, data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                task[key] = data[key];
            }
        }
        task.dueDate = new Date(task.dueDate);
        return task;
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.taskRepository.find();
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.taskRepository.findOneById(id);
            if (!found) {
                throw new common_1.NotFoundException({ id });
            }
            return found;
        });
    }
    save(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield class_validator_1.validate(task);
            if (errors.length > 0) {
                throw new common_1.UnprocessableEntityException(errors);
            }
            return yield this.taskRepository.save(task);
        });
    }
    updateByItem(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.taskRepository.findOneById(task.id);
            if (!found) {
                throw new common_1.NotFoundException(JSON.parse(JSON.stringify(task)));
            }
            const errors = yield class_validator_1.validate(this.bindData(found, task));
            if (errors.length > 0) {
                throw new common_1.UnprocessableEntityException(errors);
            }
            const { id, dateCreated, dateUpdated } = task, rest = __rest(task, ["id", "dateCreated", "dateUpdated"]);
            if (Object.keys(rest).length > 0) {
                yield this.taskRepository.updateById(task.id, rest);
            }
            return yield this.taskRepository.findOneById(task.id);
        });
    }
    updateByItems(tasks) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTasks = [];
            for (const task of tasks) {
                const updated = yield this.updateByItem(task);
                updatedTasks.push(updated);
            }
            return updatedTasks;
        });
    }
    removeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new common_1.UnprocessableEntityException([
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
                throw new common_1.UnprocessableEntityException([
                    {
                        children: [],
                        constraints: {
                            isInt: 'id must be an integer number',
                        }, property: 'id',
                        target: {},
                    },
                ]);
            }
            yield this.taskRepository.removeById(id);
        });
    }
    removeByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(ids) || ids.length === 0) {
                throw new common_1.UnprocessableEntityException([
                    {
                        children: [],
                        constraints: {
                            isNotEmpty: 'ids should not be empty',
                        }, property: 'ids',
                        target: {},
                    },
                ]);
            }
            yield this.taskRepository.removeById(ids);
        });
    }
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.taskRepository.query('DELETE FROM task');
            yield this.taskRepository.query('DELETE FROM SQLITE_SEQUENCE WHERE name=\'task\'');
        });
    }
};
TaskService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map