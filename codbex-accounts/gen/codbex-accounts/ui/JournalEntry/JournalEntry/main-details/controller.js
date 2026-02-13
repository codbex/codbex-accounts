angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-accounts/gen/codbex-accounts/api/JournalEntry/JournalEntryService.ts';
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
				$scope.optionsDirections = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				$scope.entity = data.entity;
				$scope.optionsAccount = data.optionsAccount;
				$scope.optionsDirections = data.optionsDirections;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsAccount = data.optionsAccount;
				$scope.optionsDirections = data.optionsDirections;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-accounts.JournalEntry.JournalEntry.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				$scope.entity = data.entity;
				$scope.optionsAccount = data.optionsAccount;
				$scope.optionsDirections = data.optionsDirections;
				$scope.action = 'update';
			});
		}});

		$scope.serviceAccount = '/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/AccountService.ts';
		$scope.serviceDirections = '/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionService.ts';

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
		$scope.createDirections = () => {
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

		$scope.refreshAccount = () => {
			$scope.optionsAccount = [];
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
		};
		$scope.refreshDirections = () => {
			$scope.optionsDirections = [];
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
		};

		//----------------Dropdowns-----------------//	
	});