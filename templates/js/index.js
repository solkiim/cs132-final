$(document).ready(function() {
	// signup form submitted
	$('#loginform').submit(function(event) {
		event.preventDefault();
		
		var username = $('#signupform input[name=username]').val();
		
		$.post(
			'/loginsubmit',
			$('#loginform').serialize(),
			function(data, status) {
				console.log(data);
			}
		);
	});
});
