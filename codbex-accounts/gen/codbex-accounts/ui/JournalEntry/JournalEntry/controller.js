angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-accounts.JournalEntry.JournalEntry';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-accounts/gen/codbex-accounts/api/JournalEntry/JournalEntryService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-accounts-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "JournalEntry" && e.view === "JournalEntry" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "JournalEntry" && e.view === "JournalEntry" && e.type === "entity");
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};

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

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			$scope.dataPage = pageNumber;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("JournalEntry", `Unable to count JournalEntry: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					filter.$offset = offset;
					filter.$limit = limit;
					request = entityApi.search(filter);
				} else {
					request = entityApi.list(offset, limit);
				}
				request.then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("JournalEntry", `Unable to list/filter JournalEntry: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("JournalEntry-details", {
				action: "select",
				entity: entity,
				optionsAccount: $scope.optionsAccount,
				optionsJournalEntryDirections: $scope.optionsJournalEntryDirections,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("JournalEntry-filter", {
				entity: $scope.filterEntity,
				optionsAccount: $scope.optionsAccount,
				optionsJournalEntryDirections: $scope.optionsJournalEntryDirections,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("JournalEntry-details", {
				action: "create",
				entity: {},
				optionsAccount: $scope.optionsAccount,
				optionsJournalEntryDirections: $scope.optionsJournalEntryDirections,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("JournalEntry-details", {
				action: "update",
				entity: entity,
				optionsAccount: $scope.optionsAccount,
				optionsJournalEntryDirections: $scope.optionsJournalEntryDirections,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete JournalEntry?',
				`Are you sure you want to delete JournalEntry? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("JournalEntry", `Unable to delete JournalEntry: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsAccount = [];
		$scope.optionsJournalEntryDirections = [];


		$http.get("/services/ts/codbex-accounts/gen/codbex-accounts/api/Accounts/AccountService.ts").then(function (response) {
			$scope.optionsAccount = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-accounts/gen/codbex-accounts/api/Settings/JournalEntryDirectionService.ts").then(function (response) {
			$scope.optionsJournalEntryDirections = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsAccountValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsAccount.length; i++) {
				if ($scope.optionsAccount[i].value === optionKey) {
					return $scope.optionsAccount[i].text;
				}
			}
			return null;
		};
		$scope.optionsJournalEntryDirectionsValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsJournalEntryDirections.length; i++) {
				if ($scope.optionsJournalEntryDirections[i].value === optionKey) {
					return $scope.optionsJournalEntryDirections[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
