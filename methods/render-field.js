import { html } from "lit";
import { Countries } from "../constants";

function getFieldContent(field = {}, onChange = () => {}) {
	field = JSON.parse(JSON.stringify(field));
	if (field.type === "divider") return "";
	if (field.type === "heading") return field.label;
	if (field.readOnly) return field.label + ": " + field.value;

	const fieldLabel = field.label && !field.labelHidden ? html`<label for=${field.id}>${field.label}</label>` : "";
	const changeFieldValue = (value) =>
		onChange({ ...field, value, options: ["countryCode", "provinceCode"].includes(field.id) ? [] : field.options });
	const changeSectionFields = (fields) => onChange({ ...field, fields });
	const getCountryOption = (item) => ({ label: item.label, id: item.code });

	switch (field.type) {
		case "checkbox":
		case "radio": {
			return html`
				<input
					id=${field.id}
					type=${field.type}
					name=${field.name || field.id}
					?required=${field.required || false}
					?checked=${field.value || false}
					@change=${(event) => changeFieldValue(event.target.checked)}
				/>
				${fieldLabel}
			`;
		}
		case "number": {
			return html`
				${fieldLabel}
				<input
					id=${field.id}
					name=${field.name || field.id}
					type=${field.type}
					?required=${field.required || false}
					placeholder=${field.placeholder || ""}
					min=${field.min || ""}
					max=${field.max || ""}
					value=${field.value.toString() || ""}
					@input=${(event) => changeFieldValue(Number(event.target.value))}
				/>
			`;
		}
		case "textarea": {
			return html`
				${fieldLabel}
				<textarea
					id=${field.id}
					name=${field.name || field.id}
					?required=${field.required || false}
					placeholder=${field.placeholder || ""}
					pattern=${field.pattern || ""}
					minlength=${field.minLength || 0}
					maxlength=${field.maxLength || ""}
					rows=${field.rows || ""}
					cols=${field.cols || ""}
					value=${field.value || ""}
					@input=${(event) => changeFieldValue(event.target.value)}
				></textarea>
			`;
		}
		case "select": {
			if (field.options.length === 0) return "";
			const index = field.options.findIndex((option) => option.id === field.value);
			if (index < 0) changeFieldValue(field.options[0].id);
			return html`
				${fieldLabel}
				<select
					id=${field.id}
					name=${field.name || field.id}
					?required=${field.required || false}
					value=${field.value}
					@change=${(event) => changeFieldValue(event.target.value)}
				>
					${field.options.map(function (option) {
						return html`<option value=${option.id}>${option.label}</option>`;
					})}
				</select>
			`;
		}
		case "section": {
			switch (field.sectionType) {
				case "choice": {
					field.fields = field.fields.map(function (item) {
						const fieldType = field.multiple ? "checkbox" : "radio";
						const fieldName = field.multiple ? item.id : field.id;
						return { ...item, type: fieldType, name: fieldName };
					});
					break;
				}
				case "phone": {
					field.fields[0].options = Countries.map(getCountryOption);
					break;
				}
				case "country": {
					const selectedCountry = Countries.find((item) => item.code === field.fields[0].value) || {};
					field.fields[0].options = Countries.map(getCountryOption);
					field.fields[1].options = selectedCountry.provinces?.map(getCountryOption) || [];
					break;
				}
			}

			return html`
				${fieldLabel}
				<div class="section-content" id=${field.id} ?required=${field.required}>
					${renderFields(field.fields, changeSectionFields)}
				</div>
			`;
		}
		default: {
			return html`
				${fieldLabel}
				<input
					id=${field.id}
					name=${field.name || field.id}
					type=${field.type || "text"}
					?required=${field.required || false}
					placeholder=${field.placeholder || ""}
					pattern=${field.pattern || ""}
					value=${field.value || ""}
					@input=${(event) => changeFieldValue(event.target.value)}
				/>
			`;
		}
	}
}

export function renderField(field = {}, onChange = () => {}) {
	return html`
		<div id="field-${field.id}" class="field field-${field.type} field-${field.sectionType}">
			<div class="field-content">${getFieldContent(field, onChange)}</div>
			${field.valueError
				? html`
						<div class="field-valueError">
							<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
								<path
									d="M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"
								></path>
								<path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
								<path
									fill-rule="evenodd"
									d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
								></path>
							</svg>
							<span>${field.valueError}</span>
						</div>
					`
				: html`<div class="field-helpText">${field.helpText}</div>`}
		</div>
	`;
}

export function renderFields(fields = [], onChange = () => {}) {
	return fields.map(function (field, index, fields) {
		return field.visible ? renderField(field, (value) => onChange(fields.toSpliced(index, 1, value))) : "";
	});
}
