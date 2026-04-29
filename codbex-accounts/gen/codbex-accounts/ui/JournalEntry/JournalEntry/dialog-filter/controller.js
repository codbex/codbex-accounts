angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
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
		if (params?.entity?.CreatedAtFrom) {
			params.entity.CreatedAtFrom = new Date(params.entity.CreatedAtFrom);
		}
		if (params?.entity?.CreatedAtTo) {
			params.entity.CreatedAtTo = new Date(params.entity.CreatedAtTo);
		}
		if (params?.entity?.UpdatedAtFrom) {
			params.entity.UpdatedAtFrom = new Date(params.entity.UpdatedAtFrom);
		}
		if (params?.entity?.UpdatedAtTo) {
			params.entity.UpdatedAtTo = new Date(params.entity.UpdatedAtTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		const optionsAccountMap = new Map();
		params.optionsAccount.forEach(e => optionsAccountMap.set(e.value, e));
		$scope.optionsAccount = Array.from(optionsAccountMap.values());
		const optionsDirectionMap = new Map();
		params.optionsDirection.forEach(e => optionsDirectionMap.set(e.value, e));
		$scope.optionsDirection = Array.from(optionsDirectionMap.values());
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
		if (entity.Direction !== undefined) {
			const condition = { propertyName: 'Direction', operator: 'EQ', value: entity.Direction };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtFrom) {
			const condition = { propertyName: 'CreatedAt', operator: 'GE', value: entity.CreatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtTo) {
			const condition = { propertyName: 'CreatedAt', operator: 'LE', value: entity.CreatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedBy) {
			const condition = { propertyName: 'CreatedBy', operator: 'LIKE', value: `%${entity.CreatedBy}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtFrom) {
			const condition = { propertyName: 'UpdatedAt', operator: 'GE', value: entity.UpdatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtTo) {
			const condition = { propertyName: 'UpdatedAt', operator: 'LE', value: entity.UpdatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedBy) {
			const condition = { propertyName: 'UpdatedBy', operator: 'LIKE', value: `%${entity.UpdatedBy}%` };
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
		lastSearchValuesAccount.clear();
		allValuesAccount.length = 0;
		lastSearchValuesDirection.clear();
		allValuesDirection.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'JournalEntry-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

	const lastSearchValuesAccount = new Set();
	const allValuesAccount = [];
	let loadMoreOptionsAccountCounter = 0;
	$scope.optionsAccountLoading = false;
	$scope.optionsAccountHasMore = true;

	$scope.loadMoreOptionsAccount = () => {
		const limit = 20;
		$scope.optionsAccountLoading = true;
		$http.get(`/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/AccountController.ts?$limit=${limit}&$offset=${++loadMoreOptionsAccountCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesAccount.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesAccount.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsAccount.find(o => o.value === e.value)) {
					$scope.optionsAccount.push(e);
				}
			})
			$scope.optionsAccountHasMore = resultValues.length > 0;
			$scope.optionsAccountLoading = false;
		}, (error) => {
			$scope.optionsAccountLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Account',
				message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsAccountChange = (event) => {
		if (allValuesAccount.length === 0) {
			allValuesAccount.push(...$scope.optionsAccount);
		}
		if (event.originalEvent.target.value === '') {
			allValuesAccount.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsAccount = allValuesAccount;
			$scope.optionsAccountHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsAccountHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesAccount).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/AccountController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesAccount.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesAccount.push(e);
						}
					});
					$scope.optionsAccount = allValuesAccount.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Account',
						message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesAccount.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesDirection = new Set();
	const allValuesDirection = [];
	let loadMoreOptionsDirectionCounter = 0;
	$scope.optionsDirectionLoading = false;
	$scope.optionsDirectionHasMore = true;

	$scope.loadMoreOptionsDirection = () => {
		const limit = 20;
		$scope.optionsDirectionLoading = true;
		$http.get(`/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionController.ts?$limit=${limit}&$offset=${++loadMoreOptionsDirectionCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesDirection.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesDirection.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsDirection.find(o => o.value === e.value)) {
					$scope.optionsDirection.push(e);
				}
			})
			$scope.optionsDirectionHasMore = resultValues.length > 0;
			$scope.optionsDirectionLoading = false;
		}, (error) => {
			$scope.optionsDirectionLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Direction',
				message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsDirectionChange = (event) => {
		if (allValuesDirection.length === 0) {
			allValuesDirection.push(...$scope.optionsDirection);
		}
		if (event.originalEvent.target.value === '') {
			allValuesDirection.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsDirection = allValuesDirection;
			$scope.optionsDirectionHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsDirectionHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesDirection).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesDirection.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesDirection.push(e);
						}
					});
					$scope.optionsDirection = allValuesDirection.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Direction',
						message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesDirection.add(event.originalEvent.target.value);
			}
		}
	};

	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}

});