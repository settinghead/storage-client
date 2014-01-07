


$(function() {
	


	$(".select-file-checkbox").change(function() {

		var checked = false;
		var checkCount = 0;

		$(".select-file-checkbox").each(function(i){
			if (this.checked == true) {
				checkCount++;
			}
		});


		$(".select-file-checkbox").each(function(i){
			if (this.checked == true) {
				checked = true;
				return;
			}
		});

		
		setButtonsEnabled(checked, checkCount);


	});





	function setButtonsEnabled(checked, checkCount) {

		console.log(checked + ' ' + checkCount);

		if (checked) {
			$('#button-select').prop('disabled', false);
			$('#button-delete').prop('disabled', false);
		} else {
			$('#button-select').prop('disabled', true);
			$('#button-delete').prop('disabled', true);
		}


		if (checkCount == 1 ) {
			$('#button-link').prop('disabled', false);
		} else {
			$('#button-link').prop('disabled', true);
		}


	}


	$(window).on('resize orientationchange', function() {
	
		if (window.innerWidth <= 768) {
			//showListView();			
		} else {

		}

	});




	


});
