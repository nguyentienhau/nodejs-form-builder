export function getFieldValue(field = {}) {
	switch (field.type) {
		case "section": {
			return getFieldValues(field.fields);
		}
		default: {
			return field.value;
		}
	}
}

export function getFieldValues(fields = []) {
	return (
		fields.reduce(function (result, field) {
			result[field.id] = getFieldValue(field);
			return result;
		}, {}) || {}
	);
}
