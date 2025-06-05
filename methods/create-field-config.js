const _BasicFieldTypes = [
	"text",
	"email",
	"password",
	"tel",
	"checkbox",
	"radio",
	"file",
	"color",
	"hidden",
	"submit",
	"image",
	"range",
	"search",
	"button",
	"date",
	"datetime-local",
	"select",
	"textarea"
];
const _SpecialFieldTypes = [
	"heading",
	"divider",
	"section",
	"choiceSection",
	"phoneSection",
	"countrySection",
	"addressSection"
];

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
		readonly: false,
		visible: true,
		custom: true,
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
			result.fields = [];
			break;
		}
		case "choiceSection": {
			result.multiple = false;
			result.fields = [];
			break;
		}
		case "phoneSection": {
			result.fields = [
				{ id: "countryCode", type: "select", label: "Country/Region", labelHidden: true },
				{ id: "phone", type: "tel", label: "Phone", labelHidden: true }
			].map(createFieldConfig);
			break;
		}
		case "countrySection": {
			result.fields = [
				{ id: "countryCode", type: "select", label: "Country/Region" },
				{ id: "provinceCode", type: "select", label: "Province/State" }
			].map(createFieldConfig);
			break;
		}
	}

	return { ...result, ...data };
}
