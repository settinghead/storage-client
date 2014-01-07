'use strict';

/* Controllers */

function FileListCtrl($scope, $routeParams, $filter, MediaFiles) {

  $scope.orderByAttribute = 'key';
  $scope.reverseSort = false;
  $scope.thumbnailView = true;
    
  $scope.mediaFiles = MediaFiles.query({companyId: $routeParams.companyId}, function(mediaFiles) {
//	  $scope.phonesGroupBy4 = $filter('groupBy')(phones, 4);  
  });

	initViewToggle();

}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];

function FileDetailCtrl($scope, $routeParams, MediaFile) {

  $scope.orderByAttribute = 'key';
  $scope.reverseSort = false;
  $scope.thumbnailView = true;
    
  $scope.mediaFiles = MediaFile.query();

	initViewToggle();

}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];

function NavController($scope, $location) { 
  
	$scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
	};

}

function initViewToggle() {

	$('#view-toggle').bootstrapSwitch();

  $('#view-toggle').on('switch-change', function (e, data) {
		var $el = $(data.el); 
		var listView = data.value;

		if (!listView) {
			showThumbView();
		} else {
			showListView();
		}

		//console.log(e, $el, value);
	});

}

function showThumbView() {

	$('.media-thumb-image').show();

	$('.media-file-name').addClass('media-file-name-thumbnail');
	$('.media-file-type').addClass('media-file-type-thumbnail');
	$('.media-file-size').addClass('media-file-size-thumbnail');
	$('.media-date-modified').addClass('media-date-thumbnail');
	$('.media-check-box').addClass('media-check-thumbnail');

	$('.media-item').addClass('media-item-thumbnail');

	$('#column-headers').hide();

}

function showListView() {

	$('.media-thumb-image').hide();

	$('.media-file-name').removeClass('media-file-name-thumbnail');
	$('.media-file-type').removeClass('media-file-type-thumbnail');
	$('.media-file-size').removeClass('media-file-size-thumbnail');
	$('.media-date-modified').removeClass('media-date-thumbnail');
	$('.media-check-box').removeClass('media-check-thumbnail');

	$('.media-item').removeClass('media-item-thumbnail');

	$('#column-headers').show();

}


