export function checkFieldConfig(field = {}) {
	if (field.label.trim() === "") return false;

	switch (field.type) {
		case "textarea": {
			if (field.rows <= 0 || field.cols <= 0) {
				return false;
			}
			return true;
		}
		case "select": {
			return checkFieldConfigs(field.options);
		}
		case "section":
		case "choice": {
			return checkFieldConfigs(field.fields);
		}
	}

	return true;
}

export function checkFieldConfigs(fields = []) {
	return fields.every(checkFieldConfig);
}
