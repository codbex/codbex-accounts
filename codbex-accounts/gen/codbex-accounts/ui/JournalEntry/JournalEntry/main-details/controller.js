angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-accounts.JournalEntry.JournalEntry';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-accounts/gen/codbex-accounts/api/JournalEntry/JournalEntryService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "JournalEntry Details",
			create: "Create JournalEntry",
			update: "Update JournalEntry"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-accounts-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "JournalEntry" && e.view === "JournalEntry" && e.type === "entity");
		});

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsAccount = [];
				$scope.optionsJournalEntryDirections = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsAccount = msg.data.optionsAccount;
				$scope.optionsJournalEntryDirections = msg.data.optionsJournalEntryDirections;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsAccount = msg.data.optionsAccount;
				$scope.optionsJournalEntryDirections = msg.data.optionsJournalEntryDirections;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsAccount = msg.data.optionsAccount;
				$scope.optionsJournalEntryDirections = msg.data.optionsJournalEntryDirections;
				$scope.action = 'update';
			});
		});

		$scope.serviceAccount = "/services/ts/codbex-accounts/gen/codbex-accounts/api/Accounts/AccountService.ts";
		$scope.serviceJournalEntryDirections = "/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("JournalEntry", `Unable to create JournalEntry: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("JournalEntry", "JournalEntry successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("JournalEntry", `Unable to update JournalEntry: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("JournalEntry", "JournalEntry successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createAccount = function () {
			messageHub.showDialogWindow("Account-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createJournalEntryDirections = function () {
			messageHub.showDialogWindow("JournalEntryDirection-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshAccount = function () {
			$scope.optionsAccount = [];
			$http.get("/services/ts/codbex-accounts/gen/codbex-accounts/api/Accounts/AccountService.ts").then(function (response) {
				$scope.optionsAccount = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshJournalEntryDirections = function () {
			$scope.optionsJournalEntryDirections = [];
			$http.get("/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionService.ts").then(function (response) {
				$scope.optionsJournalEntryDirections = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);