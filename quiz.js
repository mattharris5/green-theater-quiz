(function($) {
	
	//
	// Tracks all of the DOM elements that we want to reference on the page
	//
	var elements = {
		'intro': $('#intro'),
		'instructions': $('.instructions'),
		'quiz': $('#quiz').hide(),
		'options': $('#options'),
		'summary': $('.summary').hide(),
		'overall': $('.overall'),
		'returnToQuizLink': $('.btn-back').hide(),
		'submitButton': $('.btn-submit'),
		'resetButton': $('.btn-reset'),
		'assessment': $('.assessment'),
		'bestChoicesLink': $('a.best-choices'),
		'prosConsLink': $('a.pros-cons-toggle')
	};
	
	//
	// Initialize the page.
	//
	var init = function() {
		options.fetchFromServer();
		
		elements.intro.find('button.start').click(function(e) {
			e.preventDefault();
			elements.intro.hide()
			elements.quiz.show()
		});
		
		elements.submitButton.click(function(e) {
			e.preventDefault()
			results.submit(e)
		});

		elements.returnToQuizLink.click(function(e) {
			e.preventDefault()
			results.returnToQuiz(e)
		});
		
		elements.resetButton.click(function(e) {
			results.resetQuiz(e);
		});
		
		elements.bestChoicesLink.click(function(e) {
			e.preventDefault()
			results.showBestChoices(e)
		});
		
		elements.prosConsLink.click(function(e) {
			e.preventDefault()
			results.toggleProsCons(e)
		});
		
	}
	

	//
	// Functions and methods involving the options that a user can select.
	//
	var options = {
		
		// Fetches the list of choices from the servier, which returns a JSON file.
		fetchFromServer: function() {
			$.getJSON("choices.json", function(json) {
				var i, section;
				for(i=0; i < json.length; i++) {
					section = json[i]
			    options.displaySection(i+1, section, elements.options)
				}
			});
		},
		
		// For a section of options (like "Woodworking"), display those options on the
		// page for the user to select.
		displaySection: function(id, data, $target) {
			var $element = $target.find(".template")
				.clone()
				.removeClass("hidden template")
				.attr('role', 'presentation')
				.attr('data-section-id', id);
			
			$element.find(".section-id").text("Section " + id + ":");
			$element.find(".section-title").text(data.title)
			if(data.icon) $element.find(".section-icon").addClass('glyphicon glyphicon-' + data.icon)
			
			for (i = 0; i < data.choices.length; i++) {
				$element.find(".options").append(display.optionElement(data.choices[i]));
			}
			$target.find('.template').before($element);
		}
				
	};

	//
	// Functions for dealing with displaying the results of the quiz.
	//
	var results = {
		
		// Submit the user's selections and calculate the results.
		submit: function(event) {
			elements.options.find("section.choices:not(.template)").each(function() {
				display.tally($(this).find('.tally'), $(this))
			})
			
			$('body').scrollTop(0);
			display.toggleControls(true)
			display.summary()
			display.grades()
		},
		
		// Keep the results but show the quiz form again.
		returnToQuiz: function(event) {
			display.toggleControls(false);
		},
		
		// Reset the quiz to the starting point.
		resetQuiz: function(event) {
			elements.quiz
				.find('label').removeClass()
				.find('span.grade').hide()
			
			elements.quiz.find('.tally').text('')
			results.returnToQuiz()
			elements.summary.hide()
		},
		
		// Tally up the result for the specified element on the page.
		tally: function($element) {
			var checked = $element.find(':checked'),
				tally = 0.0,
				i;
			if (checked.length === 0) return 0;

			for (i = 0; i < checked.length; i++) {
				tally += parseFloat(checked.eq(i).val());
			}
			return +(tally / checked.length).toFixed(2);
		},
		
		// Change the display to show all the "4" rated options.
		showBestChoices: function(event) {
			display.toggleControls(true)
			elements.options.find('input[value=4]').parent().parent().show()
		},
		
		// Toggle showing the pros & cons for each choice.
		toggleProsCons: function(show) {
			elements.options.find('.pros-cons').toggle()
		}
		
	};
	
	//
	// Format various DOM elements and helpers to populate the page.
	//
	var display = {
		
		// For a specific option (like "Latex Paint"), construct the HTML to display on the form.
		optionElement: function(option) {
			return $("<div>").addClass("checkbox").append(
				$("<label>").html(option.text).prepend(
					$("<input>")
						.attr('type', 'checkbox')
						.val(option.value)
						.attr('data-key', i)
				).append(
					display.gradeElement(option)
				)
			).append(
				display.prosConsElement(option)
			)
		},
		
		gradeElement: function(option) {
			return $("<span>")
				.addClass('grade text-' + display.css(option.value))
				.text("Score: " + option.value)
				.hide()
				.prepend('<span class="glyphicon glyphicon-leaf"></span> ')
		},
		
		prosConsElement: function(option) {
			var $element = $("<ul>").addClass('text-default list-unstyled')
			if (option.pros) {
				$.each(option.pros, function(index, value) {
					$element.append(
						$("<li><span class='glyphicon glyphicon-thumbs-up'></span> " + value + "</li>")
					)
				})
			}
			if (option.cons) {
				$.each(option.cons, function(index, value) {
					$element.append(
						$("<li><span class='glyphicon glyphicon-thumbs-down'></span> " + value + "</li>")
					)
				})
			}
			if (option.alternatives) {
				$.each(option.alternatives, function(index, value) {
					$element.append(
						$("<li><span class='glyphicon glyphicon-flash'></span> " + value + "</li>")
					)
				})
			}
			return $("<div>").addClass('pros-cons').hide().append($element)
		},
		
		css: function(value) {
			if(value >= 3)
				return 'success';
			else if (value >= 2)
				return 'warning';
			else if (value < 2)
				return 'danger';
		},
		
		tally: function(element, resultsSection) {
			var tallyVal = results.tally(resultsSection)
			return element
				.text(tallyVal)
				.removeClass('label-danger label-warning label-success')
				.addClass('label-' + display.css(tallyVal))
		},
		
		toggleControls: function(show) {
			elements.submitButton.toggle(!show);
			elements.returnToQuizLink.toggle(show);
			elements.instructions.toggle(!show);
			
			var checkboxes = elements.options.find('input:not(:checked)').parent().parent()
			if (show)
				checkboxes.hide('fast');
			else
				checkboxes.show('fast');
		},
		
		summary: function() {
			elements.summary.show()
			var overallTallyVal = results.tally(elements.quiz)
			elements.overall
				.removeClass('block-danger block-warning block-success')
				.addClass('block-' + display.css(overallTallyVal))
				.find('.tally').text(overallTallyVal)
		},
		
		grades: function() {
			elements.quiz.find('[value]').each(function() {
				var tallyVal = $(this).val()
				$(this).parent()
					.addClass('text-' + display.css(tallyVal))
					.find('span.grade').show()
			})
		}
	};

	init();
	
})(jQuery);
