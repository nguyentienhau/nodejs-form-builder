function convertValue(key = "", type = "", value = {}) {
	if (key === "shippingAddress" && type === "text") {
		return [
			[value.firstName, value.lastName],
			[value.address2, value.address1],
			[value.city, value.zip],
			[value.provinceCode, value.countryCode]
		]
			.map((line) => line.filter((item) => item).join(" "))
			.filter((item) => item)
			.join(", ");
	}
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
	return fields.map(function (field) {
		if (field.type === "section" && !field.separate) {
			return { ...field, fields: assignFieldValues(field.fields, value) };
		}
		return assignFieldValue(field, value[field.id]);
	});
}
