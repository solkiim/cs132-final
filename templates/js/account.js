$(document).ready(function() {
	if (sessionStorage.getItem('username')) {
		// if logged in
		$('#logged-in').show();
		
		// propagate values
		$('#username-container #username').text(sessionStorage.getItem('username'));
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
		$.post('/getlogintier','username=' + sessionStorage.getItem('username'), function(data, status) {
			$('#login-tier').text(data);
		});
		$.post('/getportfolio','username=' + sessionStorage.getItem('username'), function(data, status) {
			// put as li items into '#portfolio'
		});
		$.post('/getfavoritestocks','username=' + sessionStorage.getItem('username'), function(data, status) {
			// put as li items into '#favorite_stocks'
		});
	} else {
		$('#not-logged-in').show();
	}
	
	// toggle form visibility
	$('.edit-button').click(function(event) {
		$(this).parent().parent().find('form').slideToggle();
	});
	
	// update username form submitted
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
				$('#account-info #username, #username-container #username').text(username);
				
				// toggle form
				$('#update-username-form').slideToggle();
			}
			// clear form
			$('#update-username-form input[name=username]').val('');
		});
	});
	
	// update email form submitted
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
				
				// toggle form
				$('#update-email-form').slideToggle();
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
					
					// toggle form
					$('#update-password-form').slideToggle();
				} else {
					alert('incorrect old password; please retry');
				}
				$('#update-password-form')[0].reset();
			}
		);
	});
	
	// update name form submitted
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
		
		// toggle form
		$('#update-name-form').slideToggle();
		
		// clear form
		$('#update-name-form')[0].reset();
	});
	
	// update address form submitted
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
		
		// toggle form
		$('#update-address-form').slideToggle();
		
		// clear form
		$('#update-address-form')[0].reset();
	});
	
	// update telephone form submitted
	$('#update-telephone-form').submit(function(event) {
		event.preventDefault();
		
		var telephone = $('#update-telephone-form input[name=telephone]').val();
		
		$.post(
			'/settelephone',
			'username=' + sessionStorage.getItem('username') + '&telephone=' + telephone
		);
		$('#telephone').text(telephone);
		
		// toggle form
		$('#update-telephone-form').slideToggle();
		
		// clear form
		$('#update-telephone-form input[name=telephone]').val('');
	});
	
	// update login tier form submitted
	$('#update-login-tier-form').submit(function(event) {
		event.preventDefault();
		
		var fd = new FormData();
		fd.append('username', sessionStorage.getItem('username'));
		fd.append('uploadedfile', $('#update-login-tier-form input[name="uploadedfile"]')[0].files[0]);
		
		$.ajax({
			url: '/logintierfileupload',
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(data){
				alert('file successfully uploaded');
			}
		});
		
		// toggle form
		$('#update-login-tier-form').slideToggle();
		
		// clear form
		$('#update-login-tier-form')[0].reset();
	});
});
