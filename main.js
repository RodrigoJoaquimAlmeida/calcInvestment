import { generateReturnsArray } from './src/investmentsGoals';
import { Chart } from 'chart.js/auto';
import { createTable } from './src/table';

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
const form = document.getElementById('investment-form');
const clearButton = document.getElementById('clear-form');
let doughtnutChartReference = {};
let progressionChartReference = {};
// const calculateButton = document.getElementById('calculate-results');

const columnsArray = [
	{ columnLabel: 'Mês', accessor: 'mounth' },
	{
		columnLabel: 'Total investido',
		accessor: 'investedAmount',
		format: (numberInfo) => formatCorrencyTable(numberInfo),
	},
	{
		columnLabel: 'Rendimento mensal',
		accessor: 'interestReturns',
		format: (numberInfo) => formatCorrencyTable(numberInfo),
	},
	{
		columnLabel: 'Rendimento total',
		accessor: 'totalInterestReturns',
		format: (numberInfo) => formatCorrencyTable(numberInfo),
	},
	{
		columnLabel: 'Quantia total',
		accessor: 'totalAmount',
		format: (numberInfo) => formatCorrencyTable(numberInfo),
	},
];

function formatCorrencyTable(value) {
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	});
}
function formatCorrencyGraphic(value) {
	return value.toFixed(2);
}

function renderProgression(evt) {
	evt.preventDefault();
	if (document.querySelector('.error')) {
		return;
	}
	resetCharts();
	// const startingAmount = Number(form['startingAmount'].value);
	const startingAmount = Number(
		document.getElementById('starting-amount').value.replace(',', '.')
	);
	const additionalContribuion = Number(
		document
			.getElementById('additional-contribution')
			.value.replace(',', '.')
	);
	const timeAmount = Number(document.getElementById('time-amount').value);
	const timeAmountPeriod =
		document.getElementById('time-amount-period').value;
	const returnRate = Number(
		document.getElementById('return-rate').value.replace(',', '.')
	);
	const returnRatePeriod = document.getElementById('evaluation-period').value;
	const taxRate = Number(
		document.getElementById('tax-rate').value.replace(',', '.')
	);

	const returnsArray = generateReturnsArray(
		startingAmount,
		additionalContribuion,
		timeAmountPeriod,
		timeAmount,
		returnRate,
		returnRatePeriod
	);

	const finalInvestmentObject = returnsArray[returnsArray.length - 1];

	doughtnutChartReference = new Chart(finalMoneyChart, {
		type: 'doughnut',
		data: {
			labels: ['Total Investido', 'Rendimento', 'Imposto'],
			datasets: [
				{
					data: [
						formatCorrencyGraphic(
							finalInvestmentObject.investedAmount
						),
						formatCorrencyGraphic(
							finalInvestmentObject.totalInterestReturns *
								(1 - taxRate / 100)
						),
						formatCorrencyGraphic(
							finalInvestmentObject.totalInterestReturns *
								(taxRate / 100)
						),
					],
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(54, 162, 235)',
						'rgb(255, 205, 86)',
					],
					hoverOffset: 4,
				},
			],
		},
	});

	progressionChartReference = new Chart(progressionChart, {
		type: 'bar',
		data: {
			labels: returnsArray.map(
				(investmentObject) => investmentObject.mounth
			),
			datasets: [
				{
					label: 'Total Investido',
					data: returnsArray.map((investmentObject) =>
						formatCorrencyGraphic(investmentObject.investedAmount)
					),
					backgroundColor: 'rgb(255, 99, 132)',
				},
				{
					label: 'Retorno do Invesitmento',
					data: returnsArray.map((investmentObject) =>
						formatCorrencyGraphic(investmentObject.interestReturns)
					),
					backgroundColor: 'rgb(54, 162, 235)',
				},
			],
		},
		options: {
			responsive: true,
			scales: {
				x: {
					stacked: true,
				},
				y: {
					stacked: true,
				},
			},
		},
	});

	createTable(columnsArray, returnsArray, 'results-table');
}

function isObjectEmpty(obj) {
	return Object.keys(obj).length === 0;
}

function resetCharts() {
	if (
		!isObjectEmpty(doughtnutChartReference) &&
		!isObjectEmpty(progressionChartReference)
	) {
		doughtnutChartReference.destroy();
		progressionChartReference.destroy();

		const tBody = document.getElementsByTagName('tbody')[0];
		const tHead = document.getElementsByTagName('thead')[0];
		while (tBody.rows.length > 0) {
			tBody.deleteRow(0);
		}
		if (tHead) {
			tHead.remove(tHead);
		}
	}
}

function limparFormulario() {
	form['starting-amount'].value = '';
	form['additional-contribution'].value = '';
	form['time-amount'].value = '';
	form['return-rate'].value = '';
	form['tax-rate'].value = '';

	resetCharts();

	const errorInputContainers = document.querySelectorAll('.error');

	for (const errorInputContainer of errorInputContainers) {
		errorInputContainer.classList.remove('error');
		errorInputContainer.parentElement.querySelector('p').remove();
	}
}

function validateInput(evt) {
	if (evt.target.value === '') return;

	const { parentElement } = evt.target;
	const grandParentElement = evt.target.parentElement.parentElement;
	const inputValue = evt.target.value.replace(',', '.');

	if (
		!parentElement.classList.contains('error') &&
		(isNaN(inputValue) || Number(inputValue) <= 0)
	) {
		const errorTextElement = document.createElement('p');
		errorTextElement.classList.add('text-red-500');
		errorTextElement.innerHTML =
			'Apenas valores numéricos maiores que zero';

		parentElement.classList.add('error');
		grandParentElement.appendChild(errorTextElement);
	} else if (
		parentElement.classList.contains('error') &&
		!isNaN(inputValue) &&
		Number(inputValue) > 0
	) {
		parentElement.classList.remove('error');
		grandParentElement.querySelector('p').remove();
	}
}

for (const formElement of form) {
	if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
		formElement.addEventListener('blur', validateInput);
	}
}

const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const nextButton = document.getElementById('slide-arrow-next');
const previousButton = document.getElementById('slide-arrow-previous');

nextButton.addEventListener('click', () => {
	carouselEl.scrollLeft += mainEl.clientWidth;
});
previousButton.addEventListener('click', () => {
	carouselEl.scrollLeft -= mainEl.clientWidth;
});

form.addEventListener('submit', renderProgression);
clearButton.addEventListener('click', limparFormulario);
