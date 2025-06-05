import { html } from "lit";
import { Countries } from "../constants";

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
	"datetime",
	"select",
	"textarea"
];
const _CustomFieldTypes = [
	"heading",
	"divider",
	"section",
	"choiceSection",
	"phoneSection",
	"countrySection",
	"addressSection"
];

function renderField(field = {}, onChange = () => {}) {
	const fieldLabel = field.label && !field.labelHidden ? html`<label for=${field.id}>${field.label}</label>` : "";
	const changeFieldValue = (value) => onChange({ ...field, value });
	const changeSectionFields = (fields) => onChange({ ...field, fields });
	let fieldContent = "";

	switch (field.type) {
		case "checkbox":
		case "radio": {
			fieldContent = html`
				<input
					id=${field.id}
					type=${field.type}
					name=${field.name || field.id}
					?required=${field.required || false}
					?readonly=${field.readonly || false}
					?checked=${field.value || false}
					@change=${(event) => changeFieldValue(event.target.checked)}
				/>
				${fieldLabel}
			`;
			break;
		}
		case "number": {
			fieldContent = html`
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
			break;
		}
		case "textarea": {
			fieldContent = html`
				${fieldLabel}
				<textarea
					id=${field.id}
					name=${field.name || field.id}
					?required=${field.required || false}
					?readonly=${field.readonly || false}
					placeholder=${field.placeholder || ""}
					pattern=${field.pattern || ""}
					minlength=${field.minlength || 0}
					maxlength=${field.maxlength || ""}
					rows=${field.rows || ""}
					cols=${field.cols || ""}
					value=${field.value || ""}
					@input=${(event) => changeFieldValue(event.target.value)}
				></textarea>
			`;
			break;
		}
		case "heading": {
			fieldContent = fieldLabel;
			break;
		}
		case "divider": {
			fieldContent = fieldLabel;
			break;
		}
		case "select": {
			fieldContent =
				field.options.length > 0
					? html`
							${fieldLabel}
							<select
								id=${field.id}
								name=${field.name || field.id}
								?required=${field.required || false}
								?readonly=${field.readonly || false}
								@change=${(event) => changeFieldValue(event.target.value)}
							>
								${field.options.map(function (option) {
									const selected = field.value === option.id;
									return html`<option value=${option.id} ?selected=${selected}>
										${option.label}
									</option>`;
								})}
							</select>
						`
					: "";
			break;
		}
		case "section": {
			fieldContent = html`
				<div class="section-content" id=${field.id} ?required=${field.required}>
					${field.fields.map(function (item, index, list) {
						return renderField(item, (value) => changeSectionFields(list.toSpliced(index, 1, value)));
					})}
				</div>
			`;
			break;
		}
		case "choiceSection": {
			fieldContent = html`
				${fieldLabel}
				<div class="section-content" id=${field.id} ?required=${field.required}>
					${field.fields.map(function (item, index, list) {
						const fieldItem = {
							...item,
							type: field.multiple ? "checkbox" : "radio",
							name: field.multiple ? item.id : field.id
						};
						return renderField(fieldItem, (value) => changeSectionFields(list.toSpliced(index, 1, value)));
					})}
				</div>
			`;
			break;
		}
		case "phoneSection": {
			const [countryField, phoneField] = field.fields;
			const selectedCountry = Countries.find((item) => item.code === countryField.value) || {};

			if (selectedCountry.code) {
				countryField.options = Countries.map((item) => ({ label: item.name, id: item.code }));

				fieldContent = html`
					${fieldLabel}
					<div class="section-content" id=${field.id} ?required=${field.required}>
						${renderField(countryField, ({ options, ...value }) =>
							changeSectionFields([value, phoneField])
						)}
						${renderField(phoneField, (value) => changeSectionFields([countryField, value]))}
					</div>
				`;
			} else {
				countryField.value = Countries[0].code;
				changeSectionFields([countryField, phoneField]);
			}
			break;
		}
		case "countrySection": {
			const [countryField, provinceField] = field.fields;
			const selectedCountry = Countries.find((item) => item.code === countryField.value) || {};

			if (selectedCountry.code) {
				const selectedProvince =
					selectedCountry.provinces.find((item) => item.code === provinceField.value) || {};

				if (selectedCountry.provinces.length === 0 || selectedProvince.code) {
					countryField.options = Countries.map((item) => ({ label: item.name, id: item.code }));
					provinceField.options = selectedCountry.provinces.map((item) => ({
						label: item.name,
						id: item.code
					}));
					fieldContent = html`
						${fieldLabel}
						<div class="section-content" id=${field.id} ?required=${field.required}>
							${renderField(countryField, ({ options, ...value }) =>
								changeSectionFields([value, provinceField])
							)}
							${renderField(provinceField, ({ options, ...value }) =>
								changeSectionFields([countryField, value])
							)}
						</div>
					`;
				} else {
					provinceField.value = selectedCountry.provinces[0].code;
					changeSectionFields([countryField, provinceField]);
				}
			} else {
				countryField.value = Countries[0].code;
				changeSectionFields([countryField, provinceField]);
			}
			break;
		}
		default: {
			fieldContent = field.readonly
				? `${field.label}: ${field.value}`
				: html`
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
			break;
		}
	}

	return html`
		<div class="field field-${field.type}">
			<div class="field-content">${fieldContent}</div>
			${field.error
				? html`
						<div class="field-error">
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
							<span>${field.error}</span>
						</div>
					`
				: html`<div class="field-helptext">${field.helptext}</div>`}
		</div>
	`;
}

export function renderFields(fields = [], onChange = () => {}) {
	return fields.map(function (field, index, fields) {
		return field.visible ? renderField(field, (value) => onChange(fields.toSpliced(index, 1, value))) : "";
	});
}
