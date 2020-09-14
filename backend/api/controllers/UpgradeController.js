/**
 * UpgradeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const filesPath = path.resolve('../backend/api/files');
const runLogsPath = path.resolve('./api/scripts/run_logs');

module.exports = {
    addUpgrade: function (req, res) {
        if (req.isSocket) {
            const scriptPath = path.resolve('../backend/api/scripts/loop.py');
            const id = req.params.id;
            let upgradeId = "";

            Upgrade.create({ hapair: id }).fetch().then(upgrade => {
                upgradeId = upgrade.id;
                Upgrade.subscribe(req, [upgradeId]);
            });

            const process = spawn('python', [
                '-u',
                scriptPath,
            ]);

            process.stdout.on('data', data => {
                const lines = data.toString().split('\r\n').filter(elem => elem !== '');
                const lastLogMessage = lines.slice(-1)[0];
                Upgrade.update({ id: upgradeId }).set({ lastLogMessage: lastLogMessage }).then(() => {
                    Upgrade.publish([upgradeId], { verb: 'upgrade', lastLogMessage: lastLogMessage, id: upgradeId });
                });
            });

            process.stderr.on('data', data => {
                console.log(data.toString());
            });

            process.on('close', (code) => {
                Upgrade.unsubscribe(req, [upgradeId]);
            });

        }
    },
    generateDeviceInfo: function (req, res) {
        const haPairs = req.body;
        const pairs = {};
        for (let pair of haPairs) {
            pairs[pair.ha] = {
                primary: pair.primary,
                secondary: pair.secondary,
                name: pair.name,
                type: pair.type,
                id: pair.pid
            };
        }
        fs.writeFile(filesPath + "/device_info.json", JSON.stringify(pairs), (err) => {
            if (err) throw err;
            res.send("Success!");
        });
    },
    generateBaseDevice: function (req, res) {
        const info = req.body;
        fs.writeFile(filesPath + "/base_device.json", JSON.stringify(info), (err) => {
            if (err) throw err;
            res.send("Success!");
        });
    }
    ,
    getTmpMerged: function (req, res) {
        fs.readFile(runLogsPath + "/tmp_merged.json", (err, data) => {
            if (err) throw err;
            res.send(data);
        });
    },
    getCurrentStatus: function (req, res) {
        if (req.isSocket) {
            const id = 'current_status';
            const currentStatusPath = runLogsPath + "/current_status.json";
            const roomName = id;
            sails.sockets.join(req, roomName, function (err) {
                if (err) {
                    return res.serverError(err);
                }
            });
            fs.readFile(currentStatusPath, (err, data) => {
                if (err) throw err;
                sails.sockets.broadcast(roomName, 'statistics', data.toString());
            });
            fs.watch(currentStatusPath, (eventType) => {
                if (eventType === "change") {
                    fs.readFile(currentStatusPath, (err, data) => {
                        if (err) throw err;
                        sails.sockets.broadcast(roomName, 'statistics', data.toString());
                    });
                }
            });
        }
    },
    getLog: function (req, res) {
        if (req.isSocket) {
            const id = req.body.id;
            const name = req.body.name;
            const roomName = name + '-' + id + ".log";
            if (req.body.stop === false) {
                const logPath = `${runLogsPath}/upgrade_${id}/${name}.log`;

                sails.sockets.join(req, roomName, function (err) {
                    if (err) {
                        return res.serverError(err);
                    }
                });
                fs.readFile(logPath, (err, data) => {
                    if (err) throw err;
                    sails.sockets.broadcast(roomName, 'log', data.toString());
                });
                fs.watch(logPath, (eventType) => {
                    if (eventType === "change") {
                        fs.readFile(logPath, (err, data) => {
                            if (err) throw err;
                            sails.sockets.broadcast(roomName, 'log', data.toString());
                        });
                    }
                });
            }
            else {
                sails.sockets.leave(req, roomName, function (err) {
                    if (err) { return res.serverError(err); }
                    return res.send("Success!");
                });
            }
        }
    },
    getStatus: function (req, res) {
        if (req.isSocket) {
            const id = req.body.id;
            const name = req.body.name;
            const roomName = name + ".status";
            const statusPath = `${runLogsPath}/upgrade_${id}/${name}.status`;
            sails.sockets.join(req, roomName, function (err) {
                if (err) {
                    return res.serverError(err);
                }
            });
            fs.readFile(statusPath, (err, data) => {
                if (err) throw err;
                sails.sockets.broadcast(roomName, 'status', { data: data.toString(), id: id, name: name });
            });
            fs.watch(statusPath, (eventType) => {
                if (eventType === "change") {
                    fs.readFile(statusPath, (err, data) => {
                        if (err) throw err;
                        sails.sockets.broadcast(roomName, 'status', { data: data.toString(), id: id, name: name });
                    });
                }
            });
        }
    },
    getLastLogMessage: function (req, res) {
        if (req.isSocket) {
            const id = req.body.id;
            const name = req.body.name;
            const roomName = name + ".m";
            const logPath = `${runLogsPath}/upgrade_${id}/${name}.log`;
            sails.sockets.join(req, roomName, function (err) {
                if (err) {
                    return res.serverError(err);
                }
            });
            fs.readFile(logPath, (err, data) => {
                if (err) throw err;
                let messages = data.toString().split('\n').filter(elem => elem !== '');
                let lastLogMessage = messages.slice(-1)[0];
                sails.sockets.broadcast(roomName, 'lastLogMessage', { data: lastLogMessage, id: id, name: name });
            });
            fs.watch(logPath, (eventType) => {
                if (eventType === "change") {
                    fs.readFile(logPath, (err, data) => {
                        if (err) throw err;
                        messages = data.toString().split('\n').filter(elem => elem !== '');
                        lastLogMessage = messages.slice(-1)[0];
                        sails.sockets.broadcast(roomName, 'lastLogMessage', { data: lastLogMessage, id: id, name: name });
                    });
                }
            });
        }
    }
};

