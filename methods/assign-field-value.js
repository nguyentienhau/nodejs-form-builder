function convertValue(key = "", type = "", value = {}) {
	return value;
}

export function assignFieldValue(field = {}, value = "") {
	if (!field.id || !value) return field;

	field = JSON.parse(JSON.stringify(field));

	if (value.constructor === Object) {
		if (field.type === "section") {
			field.fields = assignFieldValues(field.fields, value);
		} else {
			field.value = convertValue(field.id, field.type, value);
		}
	} else {
		field.value = value;
	}

	return field;
}

export function assignFieldValues(fields = [], value = {}) {
	if (!fields || !value) return fields;
	return fields.map((field) => assignFieldValue(field, value[field.id]));
}
