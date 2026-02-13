angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-accounts/gen/codbex-accounts/api/JournalEntry/JournalEntryService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete JournalEntry? This action cannot be undone.',
			deleteTitle: 'Delete JournalEntry?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.yes');
			translated.no = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.deleteTitle', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)' });
			translated.deleteConfirm = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.deleteConfirm', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)' });
		});
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-accounts-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'JournalEntry' && e.view === 'JournalEntry' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
						message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLF', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
					message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToCount', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsAccount: $scope.optionsAccount,
				optionsDirections: $scope.optionsDirections,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.createEntity', data: {
				entity: {},
				optionsAccount: $scope.optionsAccount,
				optionsDirections: $scope.optionsDirections,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsAccount: $scope.optionsAccount,
				optionsDirections: $scope.optionsDirections,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-accounts.JournalEntry.JournalEntry.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
							message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToDelete', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'JournalEntry-filter',
				params: {
					entity: $scope.filterEntity,
					optionsAccount: $scope.optionsAccount,
					optionsDirections: $scope.optionsDirections,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsAccount = [];
		$scope.optionsDirections = [];


		$http.get('/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/AccountService.ts').then((response) => {
			$scope.optionsAccount = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Account',
				message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionService.ts').then((response) => {
			$scope.optionsDirections = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Directions',
				message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsAccountValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsAccount.length; i++) {
				if ($scope.optionsAccount[i].value === optionKey) {
					return $scope.optionsAccount[i].text;
				}
			}
			return null;
		};
		$scope.optionsDirectionsValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsDirections.length; i++) {
				if ($scope.optionsDirections[i].value === optionKey) {
					return $scope.optionsDirections[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
