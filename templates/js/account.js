$(document).ready(function() {
	// propagate values
	$('#username').text(sessionStorage.getItem('username'));
	$.post('/getemail','username=' + sessionStorage.getItem('username'), function(data, status) {
		$('#email').text(data);
	});
	
	// edit username form submitted
	$('#update-username-form').submit(function(event) {
		event.preventDefault();
		
		var username = $('#update-username-form input[name=username]').val();
		
		$.post('/duplicateusername','username=' + username, function(data, status) {
			if (data) {
				alert('that username is already taken; please pick again');
			} else {
				$.post(
					'/updateusername',
					'newusername=' + username + '&oldusername=' + sessionStorage.getItem('username')
				);
				sessionStorage.setItem('username', username);
				$('#username').text(username);
			}
			// clear form
			$('#update-username-form input[name=username]').val('');
		});
	});
	
	// edit email form submitted
	$('#update-email-form').submit(function(event) {
		event.preventDefault();
		
		var email = $('#update-email-form input[name=email]').val();
		
		$.post('/duplicateemail','email=' + email, function(data, status) {
			if (data) {
				alert('that email is already taken; please pick again');
			} else {
				$.post(
					'/updateemail',
					'username=' + sessionStorage.getItem('username') + '&email=' + email
				);
				sessionStorage.setItem('email', email);
				$('#email').text(email);
			}
			// clear form
			$('#update-email-form input[name=email]').val('');
		});
	});
	
	// update password form submitted
	$('#update-password-form').submit(function(event) {
		event.preventDefault();
		
		$.post(
			'/verifypassword',
			'username=' + sessionStorage.getItem('username')
				+ '&password=' + $('#update-password-form input[name=oldpassword]').val(),
			function(data, status) {
				if (data) {
					// if username and password match
					$.post(
						'/updatepassword',
						'username=' + sessionStorage.getItem('username')
							+ '&password=' + $('#update-password-form input[name=newpassword]').val()
					);
				} else {
					alert('incorrect old password; please retry');
				}
				$("#update-password-form")[0].reset();
			}
		);
	});
});
