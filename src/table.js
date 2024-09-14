const isNotEmptyArray = (arrayElement) => {
	return Array.isArray(arrayElement) && arrayElement.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
	// if (
	// 	!isNotEmptyArray(columnsArray) ||
	// 	!isNotEmptyArray(dataArray) ||
	// 	!isNotEmptyArray(tableId)
	// ) {
	// 	throw new Error(
	// 		'Dados inválidos. Retorne colunas, informações e id da tabela carretamente'
	// 	);
	// }
	const tableElement = document.getElementById(tableId);
	if (!tableElement || tableElement.nodeName !== 'TABLE') {
		throw new Error('ID inválido, repasse a informação correta');
	}

	createTableHeader(tableElement, columnsArray);
	createTableBody(tableElement, dataArray, columnsArray);
};

function createTableHeader(tableReference, columnsArray) {
	function createTheadElement(tableReference) {
		const thead = document.createElement('thead');
		tableReference.appendChild(thead);
		return thead;
	}
	const tableHeaderReference =
		tableReference.querySelector('thead') ??
		createTheadElement(tableReference);
	const headerRow = document.createElement('tr');
	for (const tableColumnObject of columnsArray) {
		const headerElement = /*html */ `<th class='text-center' >${tableColumnObject.columnLabel}</th>`;
		headerRow.innerHTML += headerElement;
	}
	tableHeaderReference.appendChild(headerRow);
}

function createTableBody(tableReference, tableItems, columnsArray) {
	function createTbodyElement(tableReference) {
		const tbody = document.createElement('tbody');
		tableReference.appendChild(tbody);
		return tbody;
	}
	const tableBodyReference =
		tableReference.querySelector('tbody') ??
		createTbodyElement(tableReference);

	for (const [itemIndex, tableItem] of tableItems.entries()) {
		const tableRow = document.createElement('tr');

		for (const tableColumn of columnsArray) {
			const formatFn = tableColumn.format ?? ((info) => info);
			tableRow.innerHTML += /*html */ `<td class='text-center'> ${formatFn(
				tableItem[tableColumn.accessor]
			)}</td>`;
		}
		tableBodyReference.appendChild(tableRow);
	}
}
