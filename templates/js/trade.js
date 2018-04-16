$(document).ready(function() {
	// signup form submitted
	
	$('#signupform').submit(function(event) {

		event.preventDefault();
		
		var tokenSym = $('#orderForm input[name=tokenSymbol]').val();
		var username = $('#orderForm input[name=username]').val();
		var orderType = $('#orderForm input[name=orderType').val();
		var buyOrSell = $('#orderForm input[name=buyOrSell]').val();
		var price = $('#orderForm input[name=orderType]').val();


	});
});
