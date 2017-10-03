export const comparing = (...fields) => (aRecord, bRecord) => {
  let comparison = 0;
  fields.some(field => {
    const a = aRecord[field];
    const b = bRecord[field];
    if (a === b) {
      comparison = 0;
    }
    if (a < b) {
      comparison = -1;
    }
    if (a > b) {
      comparison = 1;
    }
    return comparison !== 0;
  });
  return comparison;
};

export const groupByNearest = (key, threshold) => (
  accumulator,
  currentValue,
  currentIndex,
  array,
) => {
  if (accumulator.lastIndex >= currentIndex) return accumulator;
  const currentX = currentValue[key];
  const values = [currentValue];
  for (let nextIndex = currentIndex + 1; nextIndex < array.length; nextIndex += 1) {
    const nextValue = array[nextIndex];
    const nextX = nextValue[key];
    if (nextX > threshold + currentX) break;
    values.push(nextValue);

    // oh, ye traveler, forgive us our sins which we commit in ignorance!
    // eslint-disable-next-line no-param-reassign
    accumulator.lastIndex = nextIndex;
  }
  accumulator.push({
    [key]: values.map(it => it[key]).reduce((a, b) => a + b) / values.length,
    values,
  });
  return accumulator;
};
