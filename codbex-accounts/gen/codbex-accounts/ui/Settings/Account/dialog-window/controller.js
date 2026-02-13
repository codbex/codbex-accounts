angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/AccountService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Account successfully created';
		let propertySuccessfullyUpdated = 'Account successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Account Details',
			create: 'Create Account',
			update: 'Update Account'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.formHeadSelect', { name: '$t(codbex-accounts:codbex-accounts-model.t.ACCOUNT)' });
			$scope.formHeaders.create = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.formHeadCreate', { name: '$t(codbex-accounts:codbex-accounts-model.t.ACCOUNT)' });
			$scope.formHeaders.update = LocaleService.t('codbex-accounts:codbex-accounts-model.defaults.formHeadUpdate', { name: '$t(codbex-accounts:codbex-accounts-model.t.ACCOUNT)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-accounts:codbex-accounts-model.t.ACCOUNT)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-accounts:codbex-accounts-model.t.ACCOUNT)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-accounts.Settings.Account.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.ACCOUNT'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToCreate', { name: '$t(codbex-accounts:codbex-accounts-model.t.ACCOUNT)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-accounts.Settings.Account.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-accounts:codbex-accounts-model.t.ACCOUNT'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-accounts:codbex-accounts-model.messages.error.unableToUpdate', { name: '$t(codbex-accounts:codbex-accounts-model.t.ACCOUNT)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'Account-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});