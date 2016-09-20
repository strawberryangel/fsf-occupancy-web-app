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
var ws_connection_service_1 = require("./ws.connection.service");
var RoomsService = (function () {
    function RoomsService(server) {
        var _this = this;
        this.server = server;
        this.clearCache = function () {
            _this.cache = new Map();
        };
        this.connected = function () {
            _this.server.send({ command: "rooms" });
        };
        this.getData = function () {
            return Array.from(_this.cache.values());
        };
        this.subscribe = function () {
            _this.server.observables.connected.subscribe(function () { return _this.connected(); });
            var observable = _this.server.observables.data.filter(function (x) { return x && x.room != null; });
            observable.subscribe(function (data) { return _this.update(data); }, function (error) { return console.error("RoomsService.subscription encountered an error: ", error); }, function () { return console.error("RoomsService.subscription should never complete but received a completion."); });
        };
        this.update = function (data) {
            if (data.delete != null) {
                _this.cache.delete(data.delete);
                return;
            }
            _this.cache.set(data.room._id, data.room);
        };
        console.info("Starting RoomsService.");
        this.clearCache();
        this.subscribe();
    }
    RoomsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [ws_connection_service_1.WsConnectionService])
    ], RoomsService);
    return RoomsService;
}());
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map