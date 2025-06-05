function getErrorMessage(field = {}) {
	if (["heading", "divider"].includes(field.type) || !field.visible) return "";
	if (field.required && field.value === "") return " is empty";
	if (field.pattern && !new RegExp(field.pattern).test(field.value)) return " does not match";
	if (field.min && field.value < field.min) return " must be greater than or equals to " + field.min;
	if (field.max && field.value > field.max) return " must be less than or equal to" + field.max;
	if (field.minLength && field.value.length < field.minLength)
		return " length must be greater than or equals to " + field.minLength;
	if (field.maxLength && field.value.length > field.maxLength)
		return " length must be less than or equal to" + field.maxLength;
	return "";
}

export function validateFieldValue(field = {}) {
	field = JSON.parse(JSON.stringify(field));
	if (field.type === "section") {
		field.fields = validateFieldValues(field.fields);
	} else {
		const errorMessage = getErrorMessage(field);
		field.valueError = errorMessage ? field.label + errorMessage : "";
	}
	return field;
}

export function validateFieldValues(fields = []) {
	return fields.map(validateFieldValue);
}
