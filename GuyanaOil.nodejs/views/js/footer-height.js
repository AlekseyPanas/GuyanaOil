function adjust() {
	var windowHeight = $(window).outerHeight();
	var headerHeight = $('#header').outerHeight();
	var footerHeight = $('#footer').outerHeight();
	var minHeight = windowHeight - headerHeight - footerHeight - 20;
	console.log(windowHeight);
	console.log(headerHeight);
	console.log(footerHeight);
	console.log(minHeight);
	$('#main-content').css('min-height', minHeight.toString().concat("px"));
}

$(window).ready(adjust);
$(window).resize(adjust);