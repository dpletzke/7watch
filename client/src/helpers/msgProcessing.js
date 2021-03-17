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
  console.log(msg);
  const obr = msg.segments.find((seg) => seg.name === "OBR");
  const { collectorIdentifier } = obr;
  const obxs = msg.segments.filter((seg) => seg.name === "OBX");
  return obxs.map((obx) => {
    return {
      deviceId: obr.collectorIdentifier,
      observationId: obx.observationIdentifier,
      value: obx.value,
    };
  });
}
