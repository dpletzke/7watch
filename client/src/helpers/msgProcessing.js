const normalizeFields = (fields) => {
  return fields.map((f) => {
      return f.value
        .map((vals) => {
          return vals.map((val) => val.value.join("^"));
        })
        .join("&");
  })
};

const normalizeLine = (line) => {
  const { name, fields } = line;

  const normFields = normalizeFields(fields);

  const translatedFields = {
    MSH: {
      sendingApplication: normFields[0],
      sentTimeStamp: normFields[4],
    },
    OBR: {
      observationTimeStamp: normFields[6],
      collectorIdentifier: normFields[9],
      relevantClinicalInformation: normFields[12],
    },
    OBX: {
      valueType: normFields[1],
      observationIdentifier: normFields[2],
      value: normFields[4],
      unitId: normFields[5],
      observationTimeStamp: normFields[13],
    },
  }[name];

  return {
    name,
    fields: translatedFields,
  };
};

const normalizeMsg = (msg) => {
  const { header, segments } = msg;

  return {
    header: normalizeLine(header),
    segments: segments.map((sgmnt) => normalizeLine(sgmnt)),
  };
};

// get stamp sent, stamp conducted, sending device, relevant clinical information

export { normalizeMsg };
