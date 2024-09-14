function convertToMonthlyReturnRate(yearlyReturnRate) {
	return yearlyReturnRate ** (1 / 2);
}

export function generateReturnsArray(
	startingAmount = 0,
	monthlyContribution = 0,
	timePeriod = 'monthly',
	timeHorizon = 0,
	returnRate = 0,
	returnTimeFrame = 'monthly'
) {
	if (!timeHorizon || !startingAmount) {
		throw new Error('Valor inválido, informe um número maior que zero');
	}

	const finalReturnRate =
		returnTimeFrame === 'monthly'
			? 1 + returnRate / 100
			: convertToMonthlyReturnRate(1 + returnRate / 100);

	const finalTimeHorizon =
		timePeriod === 'monthly' ? timeHorizon : timeHorizon * 12;

	const referenceInvestmentObject = {
		investedAmount: startingAmount,
		interestReturns: 0,
		totalInterestReturns: 0,
		mounth: 0,
		totalAmount: startingAmount,
	};

	const returnsArray = [referenceInvestmentObject];

	for (
		let timeReference = 1;
		timeReference <= finalTimeHorizon;
		timeReference++
	) {
		const totalAmount =
			returnsArray[timeReference - 1].totalAmount * finalReturnRate +
			monthlyContribution;
		const interestReturns =
			returnsArray[timeReference - 1].totalAmount * (finalReturnRate - 1);
		const investedAmount =
			startingAmount + monthlyContribution * timeReference;
		const totalInterestReturns = totalAmount - investedAmount;
		returnsArray.push({
			investedAmount,
			interestReturns,
			totalInterestReturns,
			mounth: timeReference,
			totalAmount,
		});
	}

	return returnsArray;
}
