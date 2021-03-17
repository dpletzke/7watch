/**
 * update of a device-observation instance values
 * @typedef {Object} Update
 * @property {string} Update.deviceId
 * @property {number} Update.observationId
 * @property {number|string} Update.value
 */

/**
 * pare custom message into updateable objects
 * @param {Message} msg - Custom message object
 * @returns {Update[]} updates - array of upates to make on the grid
 */
export function msgToUpdates(msg) {
  const obr = msg.segments.find((seg) => seg.name === "OBR");
  const obxs = msg.segments.filter((seg) => seg.name === "OBX");

  // TODO test for no OBX's, ie no updates
  console.log({ obr, obxs });
  return obxs.map((obx) => {
    return {
      deviceId: obr.fields.collectorIdentifier,
      observationId: obx.fields.observationIdentifier,
      value: obx.fields.value,
    };
  });
}
