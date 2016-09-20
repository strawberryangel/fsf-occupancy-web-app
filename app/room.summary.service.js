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
var core_1 = require('@angular/core');
var agents_service_1 = require("./agents.service");
var occupants_service_1 = require("./occupants.service");
var rooms_service_1 = require("./rooms.service");
var RoomSummaryService = (function () {
    function RoomSummaryService(agentsService, occupantsService, roomsService) {
        var _this = this;
        this.agentsService = agentsService;
        this.occupantsService = occupantsService;
        this.roomsService = roomsService;
        this.assemble = function () {
            // Turn stream of values into a Map.
            var agents = _this.agentsService.getData();
            var occupantsValues = _this.occupantsService.getData();
            var occupants = occupantsValues.map(function (x) {
                return {
                    room: x.room,
                    agent: agents.get(x.agent) || { uuid: x.agent, username: "unknown", displayName: x.agent },
                    when: x.when ? new Date(x.when) : null
                };
            });
            var roomsValues = _this.roomsService.getData();
            var rooms = roomsValues.map(function (r) {
                return {
                    number: r.number,
                    name: r.name,
                    occupants: occupants.filter(function (y) { return y.room === r.number; }).sort(function (a, b) { return a.agent.username > b.agent.username ? 1 : a.agent.username === b.agent.username ? 0 : -1; })
                };
            }).sort(function (a, b) { return a.name > b.name ? 1 : a.name === b.name ? 0 : -1; });
            return rooms;
        };
        this.load = function () { return _this.assemble(); };
    }
    RoomSummaryService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [agents_service_1.AgentsService, occupants_service_1.OccupantsService, rooms_service_1.RoomsService])
    ], RoomSummaryService);
    return RoomSummaryService;
}());
exports.RoomSummaryService = RoomSummaryService;
//# sourceMappingURL=room.summary.service.js.map