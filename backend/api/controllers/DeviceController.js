/**
 * DeviceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  name: { type: "string" },
  ip: { type: "string" },
  username: { type: "string" },
  password: { type: "string" },
  port: { type: "number" },
  uuid: { type: "string" },
  current_version: { type: "string" },
};
