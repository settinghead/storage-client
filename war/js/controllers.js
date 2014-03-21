'use strict';

/* Controllers */

// Initialize the app
mediaLibraryApp.controller("MainController", ["$scope", "$rootScope", "$routeParams", "$http", 
    function ($scope, $rootScope, $routeParams, $http) {

	$rootScope.actionsDisabled = true;


	$rootScope.closeButtonClick = function() {

		gadgets.rpc.call('', 'rscmd_closeSettings', null);

	}
	
	$rootScope.setTermsCheckbox = function (value) {
		if (value) {
			checkTermsCheckbox();
		}
		else {
			initTermsCheckbox();
		}
	};
	
	function checkTermsCheckbox() {

		$('#termsCheckbox').attr('checked', true);
		$('#termsCheckbox').attr('disabled', true);

	}

	function initTermsCheckbox() {

		$('#termsCheckbox').attr('disabled', false);
		$('#termsCheckbox').click(function() {

			if (this.checked) {
				
				$http({
					url: 'enableMediaLibrary',
					method: "POST",
					data: "companyId=" + $routeParams.companyId,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function (data, status, headers, config) {
			
					if (data.status == 200) {

						$('#termsCheckbox').unbind('click');
						checkTermsCheckbox();
						$rootScope.actionsDisabled = false;

					}
					else {

						$('#termsCheckbox').attr('checked', false);

					}

				}).error(function (data, status, headers, config) {
			
					$('#termsCheckbox').attr('checked', false);

				});

			}

		});

	}
	
}

]);

//FileListCtrl.$inject = ['$scope', 'Phone'];

//function FileDetailCtrl($scope, $rootScope, $routeParams, MediaFile) {
//
//  $scope.mediaFiles = MediaFile.query();
//
//	initScope($scope, $rootScope);
//
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];

function ButtonsController($scope, $rootScope) {

//	$scope.selectDisabled = true;	
	$scope.downloadDisabled = true;
	$scope.deleteDisabled = true;	
	
	$rootScope.$on('CheckedCountChange', function(event, count)	 {

//		$scope.selectDisabled = count != 1;
		$scope.downloadDisabled = !count;
		$scope.deleteDisabled = !count;

	});

	$scope.uploadButtonClick = function() {
	
//		$('#uploaddialog').modal('show');
		$('#file').click();

	}

}

function ProgressController($scope, $rootScope) {
	$rootScope.uploadProgress = 0;
}

function NavController($scope, $location) { 
  
	$scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
	};

}

function ViewController($scope) {
	//$scope.thumbnailView = false;	

	$('#view-toggle').bootstrapSwitch();

	$('#view-toggle').on('switch-change', function (e, data) {
		$scope.thumbnailView = data.value;
		
		if (data.value) {
			showListView();
		}
		else {
			showThumbView();
		}
	});
	
	function showThumbView() {
		$(".has-switch label").html("<i class='fa fa-th-list'></i>");
		$('#thumbnails').show();
		$('#list').hide();
	}

	function showListView() {
		$(".has-switch label").html("<i class='fa fa-th-large'></i>");
		$('#thumbnails').hide();
		$('#list').show();

	}
	
}


