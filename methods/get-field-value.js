export function getFieldValue(field = {}) {
	if (field.type === "section") {
		return getFieldValues(field.fields);
	} else {
		return field.value;
	}
}

export function getFieldValues(fields = []) {
	return fields.reduce(function (result, field) {
		if (field.type === "section" && !field.separate) {
			const data = getFieldValues(field.fields);
			return { ...result, ...data };
		} else {
			return { ...result, [field.id]: getFieldValue(field) };
		}
	}, {});
}
