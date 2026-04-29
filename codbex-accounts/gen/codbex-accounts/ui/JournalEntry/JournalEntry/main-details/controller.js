angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-accounts/gen/codbex-accounts/api/JournalEntry/JournalEntryController.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'JournalEntry successfully created';
		let propertySuccessfullyUpdated = 'JournalEntry successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'JournalEntry Details',
			create: 'Create JournalEntry',
			update: 'Update JournalEntry'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.formHeadSelect', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)' });
			$scope.formHeaders.create = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.formHeadCreate', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)' });
			$scope.formHeaders.update = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.formHeadUpdate', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-accounts-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'JournalEntry' && e.view === 'JournalEntry' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsAccount = [];
				$scope.optionsDirection = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				if (data.entity.UpdatedAt) {
					data.entity.UpdatedAt = new Date(data.entity.UpdatedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsAccount = data.optionsAccount;
				$scope.optionsDirection = data.optionsDirection;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsAccount = data.optionsAccount;
				$scope.optionsDirection = data.optionsDirection;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				if (data.entity.UpdatedAt) {
					data.entity.UpdatedAt = new Date(data.entity.UpdatedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsAccount = data.optionsAccount;
				$scope.optionsDirection = data.optionsDirection;
				$scope.action = 'update';
			});
		}});

		$scope.serviceAccount = '/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/AccountController.ts';
		$scope.serviceDirection = '/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionController.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
					message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToCreate', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
					message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToCreate', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-accounts.JournalEntry.JournalEntry.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createAccount = () => {
			Dialogs.showWindow({
				id: 'Account-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createDirection = () => {
			Dialogs.showWindow({
				id: 'JournalEntryDirection-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

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

		$scope.refreshAccount = () => {
			$scope.optionsAccount = [];
			$http.get('/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/AccountController.ts').then((response) => {
				$scope.optionsAccount = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesAccount.length === 0;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Account',
					message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
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

		$scope.refreshDirection = () => {
			$scope.optionsDirection = [];
			$http.get('/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionController.ts').then((response) => {
				$scope.optionsDirection = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesDirection.length === 0;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Direction',
					message: LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		function isText(keycode) {
			if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
			return false;
		}

		//----------------Dropdowns-----------------//	
	});