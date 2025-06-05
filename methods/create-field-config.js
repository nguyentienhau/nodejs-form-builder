export function createFieldConfig(data = {}) {
	const uniqueId = (data.type || "text") + "-" + new Date().getTime();
	const result = {
		id: uniqueId,
		name: uniqueId,
		type: data.type || "text",
		label: "Default " + data.type,
		helpText: "",
		value: "",
		title: "",
		labelHidden: false,
		required: false,
		readOnly: false,
		visible: true,
		editable: true,
		hidable: true,
		removable: true,
		separate: true
	};

	switch (result.type) {
		case "select": {
			result.options = [];
			break;
		}
		case "tel": {
			result.pattern = "";
			break;
		}
		case "email": {
			result.pattern = "";
			break;
		}
		case "number": {
			result.pattern = "";
			result.min = "";
			result.max = "";
			result.step = 1;
			result.value = 0;
			break;
		}
		case "heading": {
			result.fontSize = 14;
			break;
		}
		case "divider": {
			result.editable = false;
			break;
		}
		case "textarea": {
			result.rows = 1;
			result.cols = 1;
			result.minLength = 0;
			result.maxLength = 100000000;
			break;
		}
		case "checkbox":
		case "radio": {
			result.value = false;
			break;
		}
		case "section": {
			result.labelHidden = true;
			result.fields = [];
			break;
		}
		case "choice": {
			data.sectionType = data.type;
			data.type = "section";
			result.multiple = false;
			result.fields = [];
			break;
		}
		case "phone": {
			data.sectionType = data.type;
			data.type = "section";
			result.fields = [
				{ id: "countryCode", type: "select", label: "Country/Region", labelHidden: true },
				{ id: "phone", type: "tel", label: "Phone", labelHidden: true }
			].map(createFieldConfig);
			break;
		}
		case "country": {
			data.sectionType = data.type;
			data.type = "section";
			result.fields = [
				{ id: "countryCode", type: "select", label: "Country/Region" },
				{ id: "provinceCode", type: "select", label: "Province/State" }
			].map(createFieldConfig);
			break;
		}
	}

	return { ...result, ...data };
}
