import { generateReturnsArray } from './src/investmentsGoals';

const form = document.getElementById('investment-form');
// const calculateButton = document.getElementById('calculate-results');

function renderProgression(evt) {
	evt.preventDefault();
	// const startingAmount = Number(form['startingAmount'].value);
	const startingAmount = Number(
		document.getElementById('starting-amount').value
	);
	const additionalContribuion = Number(
		document.getElementById('additional-contribution').value
	);
	const timeAmount = Number(document.getElementById('time-amount').value);
	const timeAmountPeriod =
		document.getElementById('time-amount-period').value;
	const returnRate = Number(document.getElementById('return-rate').value);
	const returnRatePeriod = document.getElementById('evaluation-period').value;
	const taxRate = Number(document.getElementById('tax-rate').value);

	const returnsArray = generateReturnsArray(
		startingAmount,
		additionalContribuion,
		timeAmountPeriod,
		timeAmount,
		returnRate,
		returnRatePeriod
	);

	console.log(returnsArray);
}

form.addEventListener('submit', renderProgression);
// calculateButton.addEventListener('click', renderProgression);
