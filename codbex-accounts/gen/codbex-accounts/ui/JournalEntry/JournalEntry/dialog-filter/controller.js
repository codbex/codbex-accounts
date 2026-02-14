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
				conditions: [],
				sorts: [],
				limit: 20,
				offset: 0
			}
		};
		if (entity.Id !== undefined) {
			const condition = { propertyName: 'Id', operator: 'EQ', value: entity.Id };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DateFrom) {
			const condition = { propertyName: 'Date', operator: 'GE', value: entity.DateFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DateTo) {
			const condition = { propertyName: 'Date', operator: 'LE', value: entity.DateTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Account !== undefined) {
			const condition = { propertyName: 'Account', operator: 'EQ', value: entity.Account };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Directions !== undefined) {
			const condition = { propertyName: 'Directions', operator: 'EQ', value: entity.Directions };
			filter.$filter.conditions.push(condition);
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