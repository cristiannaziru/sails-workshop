/**
 * UpgradeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { spawn } = require('child_process');

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
                console.log(`child process exited with code ${code}`);
            });

        }
    }
};

