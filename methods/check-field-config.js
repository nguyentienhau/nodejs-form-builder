export function checkFieldConfig(field = {}) {
	if (field.label.trim() === "") return false;
	if (field.type === "section") return checkFieldConfigs(field.fields);
	switch (field.type) {
		case "textarea": {
			return field.rows > 0 && field.cols > 0;
		}
		case "select": {
			return checkFieldConfigs(field.options);
		}
	}
	return true;
}

export function checkFieldConfigs(fields = []) {
	return fields.every(checkFieldConfig);
}
