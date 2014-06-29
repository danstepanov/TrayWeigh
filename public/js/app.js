(function($) {

	'use strict';

	var template='<div class="result search-result"><div data-id="foodid" class="description"><div class="title-box"><h3>foodtitle</h3><label>foodlabel</label></div><div class="plus">+</div></div></div>';

	var searching='<div class="search-result searching">searching...</div>'

	var ingredient_template ='<div class="ingredient"><div class="ingredient-row title">foodtitle</div><div class="ingredient-row ingredient-amount"><input class="ingredient-input" type="textbox" placeholder="amount"><div class="minus"></div></div></div>';

	var searchFood = function() {
		var search = $("#search-textbox").val();
		console.log(search);
		$('.search-results').prepend(searching);
		// $('.add-new').removeClass('hide');
		$.get("/api/get/searchfoods/" + search, function(data) {
			if(data.foods) {
				data.foods.forEach(function(food,index) {
					var html = template.replace('foodtitle', food.name);
					html = html.replace('foodlabel', 'fatsecret');
					html = html.replace('foodid', food.id);
					console.log(food);
					var $elem = $('.search-results').append(html);
					console.log($elem);
					$('.search-result:last-child').find('.plus').one('click', doPlusAction);
				});
				$('.searching').remove();
			}
		});
	};

	var doPlusAction = function() {
		var $parent = $(this).parent();
		var $elem = $('.ingredients').append(ingredient_template.replace('foodtitle', $parent.find('h3').text()));
		var id = $parent.data('id');
		$('.ingredient:last-child').find('.minus').click(function() {
			$(this).parent().parent().remove();
		});
		$.get('/api/get/food/' + id, function(data) {
			for(var key in data) {
				console.log(key +" " + data[key]);
				$elem.attr("data-" + key,data[key]);
			}
		});
	};

	$(document).ready(function() {
		$(".main").css({
			height: ($(window).height() - 70)
		});

		$('.tray-name input').val('name your tray');
		$('.tray-num input').val('which tray?');

		// $('.add-input').each(function() {
		// 	var val = $(this).attr('placeholder');
		// 	$(this).val(val);
		// })

		$('.add-new .plus').click(function(){
			$(this).css({visibility:'hidden'});
			$('.add-input-row').removeClass('hide');
		});

		$('.add-submit').click(function() {
			$('.add-new .plus').css({visibility:'visible'});
			$('.add-input-row').addClass('hide');

			var $parent = $('.add-new');

			var food = {};
			food.sugars = $parent.find('.sugar').val() || 0;
			food.carbs = $parent.find('.carbs').val() || 0;
			food.fats = $parent.find('.fat').val() || 0;
			food.protein = $parent.find('.protein').val() || 0;
			food.serving = $parent.find('.serving').val() || 0;
			food.sodium = $parent.find('.sodium').val() || 0;
			food.calories = $parent.find('.calories').val() || 0;

			$('.ingredients').append(ingredient_template.replace('foodtitle', $parent.find('.name').val() || "food"));
			var $elem = $('.ingredient').last();
			$elem.find('.minus').click(function() {
				$(this).parent().parent().remove();
			});
			

			for(var key in food) {
				console.log(key +" " + food[key]);
				$elem.attr('data-' + key,food[key]);
			}

			$('.result').remove();

			$('.add-input-row input').val('');
			$('.search-results').animate({
				scrollTop: 0
			});
		});

		$('.result .plus').click(doPlusAction);

		$('.minus').click(function() {
			$(this).parent().parent('.ingredient').remove();
		});

		$('.text-input').focus(function() {
			$(this).val("");
		})

		$("#search-textbox").on("keyup", function(event) {
			if(event.which === 13) {
				searchFood();
			}
		});

		$("#search-button").on('click', function() {
				searchFood();
		});

		$('.search-input').focus(function() {
			$('.search-icon').addClass('focus');
			$('.result').remove();
		});
		$('.search-input').blur(function() {
			$('.search-icon').removeClass('focus');
		});

		$('.add-tray').click(function() {
			var tray = {
				'sugars': 0,
				'fats' : 0,
				'protein' : 0,
				'sodium': 0,
				'calories' :0,
				'carbs' : 0,
				'weight' : 0,
			};

			tray.name = $('.tray-name input').val();
			tray.id = $('.tray-num input').val();

			$('.ingredient').each(function(index,element) {
				console.log(element);
				
				for(var i in tray) {

					if(i !== 'name' && i !== 'id' && i !== 'weight') {
						console.log(i + " " + $(element).attr('data-' + i));
						tray[i] += parseFloat($(element).attr('data-' + i));
					}
				}
				if(!isNaN(parseFloat($(element).find('.ingredient-input').val()))) {
					console.log($(element).find('.ingredient-input').val());
					tray.weight += parseFloat($(element).find('.ingredient-input').val());
				}
			});
			console.log('post');
			console.log(tray);
			$.ajax({
			  type: "POST",
			  url: '/api/post/beacon/' + tray.id +'/' + JSON.stringify(tray),
			  success: function(data,status){
					console.log(data);
				},
			  dataType: 'JSON'
			});

			$('.ingredient').remove();
			$('.tray-name input').val('name your tray');
			$('.tray-num input').val('which tray?');

		});
	});

})(jQuery);
