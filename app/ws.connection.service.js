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
/*
 Service to talk to the websocket server.
 */
var core_1 = require('@angular/core');
var Rx = require('rxjs/Rx');
var WsConnectionService = (function () {
    function WsConnectionService() {
        var _this = this;
        this.connect = function () {
            return new Promise(function (resolve, reject) {
                if (_this.connection) {
                    console.info("WsConnectionService.connect: Already connected.");
                    _this.observables.connected.next(true);
                    resolve();
                    return;
                }
                try {
                    var connectionString = "ws://" + _this.host + ":" + _this.port;
                    console.info("Connecting to " + connectionString);
                    _this.connection = new WebSocket(connectionString);
                }
                catch (error) {
                    console.error("Caught an error while trying to connect to the server: ", error);
                    reject(error);
                    return;
                }
                _this.connection.onmessage = function (event) {
                    var json;
                    try {
                        json = JSON.parse(event.data);
                    }
                    catch (error) {
                        console.error("Error receiving data: ", error);
                        return;
                    }
                    _this.observables.data.next(json);
                };
                _this.connection.onerror = function (error) {
                    _this.observables.data.next({
                        error: error
                    });
                    console.error("WebSocket Error: ", error);
                };
                _this.connection.onclose = function () {
                    _this.observables.connected.next(false);
                    _this.connection = null;
                    console.info("WebSocket closed.");
                };
                _this.connection.onopen = function () {
                    console.info("WebSocket opened.");
                    _this.observables.connected.next(true);
                    resolve();
                };
                setTimeout(function () {
                    reject();
                }, 10000);
            });
        };
        this.disconnect = function () {
            if (_this.connection)
                _this.connection.close();
        };
        this.getAgent = function (uuid) { return _this.send({
            command: "agent",
            uuid: uuid
        }); };
        this.getRooms = function () { return _this.send({ command: "rooms" }); };
        this.send = function (data) {
            var json;
            try {
                json = JSON.stringify(data);
            }
            catch (error) {
                console.error("send: JSON.stringify failed:", error.message);
                return;
            }
            if (_this.connection)
                _this.connection.send(json);
            else
                console.error("Cannot sent to server because not connected: ", json);
        };
        this.connection = null;
        this.host = "162.243.199.109";
        this.port = 2999;
        console.info("Starting WsConnectionService.");
        this.observables = {
            connected: new Rx.Subject(),
            data: new Rx.Subject(),
        };
        this.observables.error = this.observables.data.filter(function (x) { return x && x.error != null; });
        // Error handling/logging should be in its own service
        this.error = this.observables.error.subscribe(function (error) { return console.error("Error: " + error.error); });
    }
    WsConnectionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], WsConnectionService);
    return WsConnectionService;
}());
exports.WsConnectionService = WsConnectionService;
//# sourceMappingURL=ws.connection.service.js.map