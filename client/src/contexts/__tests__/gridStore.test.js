import { createGridStore } from "../gridStore";

const testObservations = [
  {
    id: 2,
    common: "NIBP (systolic)",
    full: "NON INV BLOOD PRESS SYS (NIBP)",
  },
  {
    id: 3,
    common: "NIBP (diastolic)",
    full: "NON INV BLOOD PRESS DIAS (NIBP)",
  },
  {
    id: 4,
    common: "NIBP Blood Pressure Mean",
    full: "NON INV BLOOD PRESSURE MEAN (NIBP)",
  },
  { id: 1, common: "HEART RATE", full: "HEART RATE (PULSE RATE)" },
  { id: 14, common: "PULSE OXIMETRY (SPO2)", full: "PULSE OXIMETRY (SPO2)" },
  { id: 22, common: "RESPIRATORY RATE", full: "RESPIRATION RATE" },
  {
    id: 519,
    common: "CVP",
    full: "INV BLOOD PRESS MEAN CENTRAL VENOUS (CVP)",
  },
];

const testDevices = [
  "CARDBAY1",
  "CARDBAY2",
  "CARDECHO",
  "CARDSTRESSRM2",
  "CARDSTRESSRM3",
  "CARDSTRESSRM5",
];

test("addObservations correctly appends to observations and grid", () => {
  const gridStore = createGridStore();

  gridStore.addDevices(testDevices);
  gridStore.addObservations(testObservations);
  const gridKeys = Array.from(gridStore.grid.keys());
  const gridValues = Array.from(gridStore.grid.values());

  expect(gridStore.observations.size).toEqual(testObservations.length);
  expect(gridStore.grid.size).toEqual(
    testDevices.length * testObservations.length
  );
  expect(gridKeys).toContain("CARDBAY2-519");
  expect(gridKeys).toContain("CARDSTRESSRM5-2");
  expect(gridValues.every((val) => val === null)).toBe(true);
});

test("addDevices correctly appends to devices and grid", () => {
  const gridStore = createGridStore();

  gridStore.addObservations(testObservations);
  gridStore.addDevices(testDevices);
  const gridKeys = Array.from(gridStore.grid.keys());
  const gridValues = Array.from(gridStore.grid.values());

  expect(gridStore.deviceIds.length).toEqual(testDevices.length);
  expect(gridStore.grid.size).toEqual(
    testDevices.length * testObservations.length
  );
  expect(gridKeys).toContain("CARDBAY2-519");
  expect(gridKeys).toContain("CARDSTRESSRM5-2");
  expect(gridValues.every((val) => val === null)).toBe(true);
});

test("Can get ids", () => {
  const gridStore = createGridStore();

  gridStore.addObservations(testObservations);
  gridStore.addDevices(testDevices);

  const [deviceId, observationId] = gridStore.getIds(2, 2);

  expect(deviceId).toEqual("CARDECHO");
  expect(observationId).toEqual(4);
});

test("Can get observation values as null before setting", () => {
  const gridStore = createGridStore();

  gridStore.addObservations(testObservations);
  gridStore.addDevices(testDevices);

  const [deviceId, observationId] = gridStore.getIds(2, 2);
  const value = gridStore.getValue(deviceId, observationId);

  expect(value).toEqual(null);
});

test("Can get observation values as value after setting", () => {
  const gridStore = createGridStore();

  gridStore.addObservations(testObservations);
  gridStore.addDevices(testDevices);

  const [dIdA, obIdA] = gridStore.getIds(2, 2);
  const [dIdB, obIdB] = gridStore.getIds(2, 3);
  const [dIdC, obIdC] = gridStore.getIds(2, 6);

  gridStore.updateValues([
    { deviceId: dIdA, observationId: obIdA, value: 5 },
    { deviceId: dIdB, observationId: obIdB, value: "test" },
    { deviceId: dIdC, observationId: obIdC, value: 56.57 },
  ]);
  const valueA = gridStore.getValue(dIdA, obIdA);
  const valueB = gridStore.getValue(dIdB, obIdB);
  const valueC = gridStore.getValue(dIdC, obIdC);

  expect(valueA).toEqual(5);
  expect(valueB).toEqual("test");
  expect(valueC).toEqual(56.57);
});
