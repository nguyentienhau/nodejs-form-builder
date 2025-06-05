export function validateFieldConfig(field = {}) {
	field = JSON.parse(JSON.stringify(field));
	if (field.label.trim() === "") field.labelError = "Label is empty";
	if (field.type === "section") field.fields = validateFieldConfigs(field.fields);
	switch (field.type) {
		case "textarea": {
			if (field.rows <= 0) field.rowsError = "Rows must be greater than 0";
			if (field.cols <= 0) field.colsError = "Columns must be greater than 0";
			break;
		}
		case "select": {
			field.options = validateFieldConfigs(field.options);
			break;
		}
	}
	return field;
}

export function validateFieldConfigs(fields = []) {
	return fields.map(validateFieldConfig);
}
