import { createGridStore } from "../gridStore";

const gridStore = createGridStore();

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
  gridStore.addDevices(testDevices);
  gridStore.addObservations(testObservations);

  expect(Object.keys(gridStore.observations).length).toEqual(
    testObservations.length
  );
  expect(gridStore.grid.size).toEqual(
    testDevices.length * testObservations.length
  );
  expect(gridStore.grid.keys()).toContain("CARDBAY2-519");
  expect(gridStore.grid.keys()).toContain("CARDSTRESSRM5-2");
  expect(gridStore.grid.values().every((val) => !val)).toBeTrue();
});

test("addDevices correctly appends to devices and grid", () => {
  gridStore.addObservations(testObservations);
  gridStore.addDevices(testDevices);

  expect(gridStore.deviceIds.length).toEqual(testDevices.length);
  expect(gridStore.grid.size).toEqual(
    testDevices.length * testObservations.length
  );
  expect(gridStore.grid.keys()).toContain("CARDBAY2-519");
  expect(gridStore.grid.keys()).toContain("CARDSTRESSRM5-2");
  expect(gridStore.grid.values().every((val) => !val)).toBeTrue();
});
