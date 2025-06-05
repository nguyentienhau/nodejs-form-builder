export function checkFieldValue(field = {}) {
	if (["heading", "divider"].includes(field.type) || !field.visible) return true;
	if (field.type === "section") return checkFieldValues(field.fields);
	if (field.required && field.value === "") return false;
	if (field.pattern && !new RegExp(field.pattern).test(field.value)) return false;
	if (field.min && field.value < field.min) return false;
	if (field.max && field.value > field.max) return false;
	if (field.minLength && field.value.length < field.minLength) return false;
	if (field.maxLength && field.value.length > field.maxLength) return false;
	return true;
}

export function checkFieldValues(fields = []) {
	return fields.every(checkFieldValue);
}
