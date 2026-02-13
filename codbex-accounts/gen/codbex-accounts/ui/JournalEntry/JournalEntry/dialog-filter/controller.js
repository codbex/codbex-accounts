angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.DateFrom) {
			params.entity.DateFrom = new Date(params.entity.DateFrom);
		}
		if (params?.entity?.DateTo) {
			params.entity.DateTo = new Date(params.entity.DateTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsAccount = params.optionsAccount;
		$scope.optionsDirections = params.optionsDirections;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.DateFrom) {
			filter.$filter.greaterThanOrEqual.Date = entity.DateFrom;
		}
		if (entity.DateTo) {
			filter.$filter.lessThanOrEqual.Date = entity.DateTo;
		}
		if (entity.Account !== undefined) {
			filter.$filter.equals.Account = entity.Account;
		}
		if (entity.Directions !== undefined) {
			filter.$filter.equals.Directions = entity.Directions;
		}
		Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-accounts.JournalEntry.JournalEntry.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'JournalEntry-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});