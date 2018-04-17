$(document).ready(function() {
	if (sessionStorage.getItem('username')) {
		console.log('here')
		// if logged in
		// $('#not-logged-in').hide();
		$('#logged-in').show();
		
		// propagate values
		$('#username').text(sessionStorage.getItem('username'));
		$.post('/getemail','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#email').text(data);
		});
		$.post('/getfirstname','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#firstname').text(data);
		});
		$.post('/getlastname','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#lastname').text(data);
		});
		$.post('/getaddress','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#address').text(data);
		});
		$.post('/getaddress2','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#address2').text(data);
		});
		$.post('/getcity','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#city').text(data);
		});
		$.post('/getzipcode','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#zipcode').text(data);
		});
		$.post('/gettelephone','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#telephone').text(data);
		});
	} else {
		console.log('here2')
		// $('#account-info').hide();
		$('#not-logged-in').show();
	}
	
	// edit username form submitted
	$('#update-username-form').submit(function(event) {
		event.preventDefault();
		
		var username = $('#update-username-form input[name=username]').val();
		
		$.post('/duplicateusername','username=' + username, function(data, status) {
			if (data) {
				alert('that username is already taken; please pick again');
			} else {
				$.post(
					'/setusername',
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
					'/setemail',
					'username=' + sessionStorage.getItem('username') + '&email=' + email
				);
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
				if (data == 'that username does not exist') {
					alert(data);
				} else if (data == true) {
					// if username and password match
					$.post(
						'/setpassword',
						'username=' + sessionStorage.getItem('username')
							+ '&password=' + $('#update-password-form input[name=newpassword]').val()
					);
				} else {
					alert('incorrect old password; please retry');
				}
				$('#update-password-form')[0].reset();
			}
		);
	});
	
	// edit name form submitted
	$('#update-name-form').submit(function(event) {
		event.preventDefault();
		
		var firstname = $('#update-name-form input[name=firstname]').val();
		var lastname = $('#update-name-form input[name=lastname]').val();
		
		$.post(
			'/setfirstname',
			'username=' + sessionStorage.getItem('username') + '&firstname=' + firstname
		);
		$('#firstname').text(firstname);
		
		$.post(
			'/setlastname',
			'username=' + sessionStorage.getItem('username') + '&lastname=' + lastname
		);
		$('#lastname').text(lastname);
		
		// clear form
		$('#update-name-form')[0].reset();
	});
	
	// edit address form submitted
	$('#update-address-form').submit(function(event) {
		event.preventDefault();
		
		var address = $('#update-address-form input[name=address]').val();
		var address2 = $('#update-address-form input[name=address2]').val();
		var city = $('#update-address-form input[name=city]').val();
		var zipcode = $('#update-address-form input[name=zipcode]').val();
		
		$.post(
			'/setaddress',
			'username=' + sessionStorage.getItem('username') + '&address=' + address
		);
		$('#address').html(address);
		
		$.post(
			'/setaddress2',
			'username=' + sessionStorage.getItem('username') + '&address2=' + address2
		);
		$('#address2').html(address2);
		
		$.post(
			'/setcity',
			'username=' + sessionStorage.getItem('username') + '&city=' + city
		);
		$('#city').html(city);
		
		$.post(
			'/setzipcode',
			'username=' + sessionStorage.getItem('username') + '&zipcode=' + zipcode
		);
		$('#zipcode').html(zipcode);
		
		// clear form
		$('#update-address-form')[0].reset();
	});
	
	// edit telephone form submitted
	$('#update-telephone-form').submit(function(event) {
		event.preventDefault();
		
		var telephone = $('#update-telephone-form input[name=telephone]').val();
		
		$.post(
			'/settelephone',
			'username=' + sessionStorage.getItem('username') + '&telephone=' + telephone
		);
		$('#telephone').text(telephone);
		
		// clear form
		$('#update-telephone-form input[name=telephone]').val('');
	});
});
