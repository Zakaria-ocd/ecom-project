export function groupProductChoicesByAttribute(choices = []) {
  const types = new Map();

  choices.forEach((choice) => {
    choice.typeValuePairs?.forEach((pair) => {
      const typeName = pair.typeName || `Type ${pair.typeId}`;
      const typeKey = pair.typeId ?? typeName.toLowerCase();

      if (!types.has(typeKey)) {
        types.set(typeKey, {
          id: typeKey,
          name: typeName,
          values: new Map(),
        });
      }

      const type = types.get(typeKey);
      const value = String(pair.value ?? `Option ${pair.valueId}`);
      const valueKey = value.trim().toLocaleLowerCase();
      const existingValue = type.values.get(valueKey);

      if (existingValue) {
        if (pair.valueId != null && !existingValue.valueIds.includes(pair.valueId)) {
          existingValue.valueIds.push(pair.valueId);
        }
        return;
      }

      type.values.set(valueKey, {
        id: pair.valueId,
        value,
        valueIds: pair.valueId == null ? [] : [pair.valueId],
        colorCode: pair.colorCode,
      });
    });
  });

  return Array.from(types.values(), (type) => ({
    id: type.id,
    name: type.name,
    values: Array.from(type.values.values()),
  }));
}
