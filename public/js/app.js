(function($) {

	'use strict';

	$(document).ready(function() {
		$(".main").css({
			height: ($(window).height() - 70)
		});
		$("#ingredient-search").on("keyup", function(event) {
			console.log($("#ingredient-search").val());
			$.get("/api/get/recipe/chicken");
		});

		$('.search-input').focus(function() {
			$('.search-icon').addClass('focus');
		});
		$('.search-input').blur(function() {
			$('.search-icon').removeClass('focus');
		});
	});

})(jQuery);
