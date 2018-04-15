$(document).ready(function() {
	// signup form submitted
	$('#signupform').submit(function(event) {
		event.preventDefault();
		
		var email = $('#signupform input[name=email]').val();
		var username = $('#signupform input[name=username]').val();
		
		$.when(
			$.post('/duplicateemail','email=' + email),	// duplicate email
			$.post('/duplicateusername','username=' + username)	// duplicate username
		).then(function(res1, res2) {
			if (res1[0]) {
				alert('there already exists an account with that email');
				$('#signupform input[name=email]').val('');
			}
			if (res2[0]) {
				alert('that username is already taken; please pick again');
				$('#signupform input[name=username]').val('');
			}
			if (!res1[0] && !res2[0]) {
				// neither email nor username are duplicates
				$.post('/signupsubmit', $('#signupform').serialize(), function(data, status) {
					if (status === "nocontent") {
						sessionStorage.setItem('username', username);
						window.location.href = '/account';
					} else {
						alert('error: error signing up');
					}
				});
			}
		});
	});
});
