(function($) {

	'use strict';

	$(document).ready(function() {
		$("#ingredient-search").on("keyup", function(event) {
			console.log($("#ingredient-search").val());
			$.get("/api/get/recipe/chicken");
		});
	});

})(jQuery);
