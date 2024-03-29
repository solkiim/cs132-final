$(document).ready(function() {
	if (sessionStorage.getItem('username')) {
		// if user already logged in session
		$('#account-info').show();
		$('#username').text(sessionStorage.getItem('username'));
	} else {
		$('#login-signup').show();
	}
	
	// sign out clicked
	$('#sign-out').click(function(event) {
		sessionStorage.removeItem('username');
		$('#account-info').hide();
		$('#login-signup').show();
		
		if (document.title == 'account') {
			window.location.href = '/';
		}
	});
	
	// login form submitted
	$('#loginform').submit(function(event) {
		event.preventDefault();
		
		$.post(
			'/verifypassword',
			$('#loginform').serialize(),
			function(data, status) {
				if (data == 'that username does not exist') {
					alert(data);
				} else if (data == true) {
					// if username and password match
					sessionStorage.setItem('username', $('#loginform input[name=username]').val());
					window.location.href = '/account';
				} else {
					alert('incorrect username/password combo');
					$("#loginform")[0].reset();
				}
			}
		);
	});
});
