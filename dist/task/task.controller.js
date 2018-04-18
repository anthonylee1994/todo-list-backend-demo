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
Object.defineProperty(exports, "__esModule", { value: true });
const task_entity_1 = require("./task.entity");
const task_service_1 = require("./task.service");
const common_1 = require("@nestjs/common");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.taskService.list();
        });
    }
    save(task) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.taskService.save(task);
        });
    }
    show(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.taskService.show(params.id);
        });
    }
    update(task) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(task)) {
                return yield this.taskService.updateByItems(task);
            }
            else {
                return yield this.taskService.updateByItem(task);
            }
        });
    }
    remove(body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(body.ids)) {
                return yield this.taskService.removeByIds(body.ids);
            }
            else {
                return yield this.taskService.removeById(body.id);
            }
        });
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "list", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_entity_1.Task]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "save", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "show", null);
__decorate([
    common_1.Patch(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "update", null);
__decorate([
    common_1.Delete(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "remove", null);
TaskController = __decorate([
    common_1.Controller('tasks'),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map