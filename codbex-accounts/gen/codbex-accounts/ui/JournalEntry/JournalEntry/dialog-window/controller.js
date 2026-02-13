angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-accounts/gen/codbex-accounts/api/JournalEntry/JournalEntryService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
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

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsAccount = params.optionsAccount;
			$scope.optionsDirections = params.optionsDirections;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToCreate', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-accounts.JournalEntry.JournalEntry.entityUpdated', data: response.data });
				$scope.cancel();
				Notifications.show({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.JOURNALENTRY'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToUpdate', { name: '$t(codbex-accounts:codbex-accounts-model.t.JOURNALENTRY)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceAccount = '/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/AccountService.ts';
		
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
		$scope.serviceDirections = '/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionService.ts';
		
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

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'JournalEntry-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});