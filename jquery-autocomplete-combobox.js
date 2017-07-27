//$Id jquery-autocomplete-combobox.js 1.0.1 20170727 nisha_robinson$
//$Date 20170727$
//$Revision 1.0.1$
//$Copyright Dentaur Pty Ltd$
//$License GNU GPL v3$
//$Author nisha_robinson$
//
// Revision History
// 1.0.0 20170622 First version
// 1.0.1 20170707 Set the value of the autocomplete to the first value
//                in the options data

(function($) {
	$.widget('custom.generic_combo_box', {
		options: {
			data: ''
		},
		_create: function() {
			this.wrapper = $('<span>')
				.addClass('custom-combobox')
				.insertAfter( this.element );
			this.element.hide();
			this._createAutocomplete();
			this._createShowAllButton();
		},
		_createAutocomplete: function() {
			this.input = $( "<input>" )
				.appendTo(this.wrapper)
				.addClass('custom-combobox-input '
					+'ui-widget ui-widget-content '
					+'ui-state-default ui-corner-left'
				).autocomplete({ 
					delay: 0,
					minLength: 0,
					source: this.options.data
				}).val(this.options.data[0])
				.width(116)
				.tooltip({
					tooltipClass: "ui-state-highlight"
				});
			this._on(this.input, {
				autocompletechange: '_removeIfInvalid',
				autocompleteselect: function( event, ui ) {
					if (ui.item.value) {
						$(this.element.context).attr('value', ui.item.value);
					}
				}
			});
		},
		_createShowAllButton: function() {
			var input = this.input,
			wasOpen = false;
			$('<a>')
				.attr('tabIndex', -1)
				.attr('title', 'Show items')
				.height(18)
				.tooltip()
				.appendTo( this.wrapper )
				.button({
					icons: {
						primary: 'ui-icon-triangle-1-s'
					},
					text: false
				})
				.removeClass('ui-corner-all')
				.addClass('custom-combobox-toggle ui-corner-right')
				.mousedown(function() {
					wasOpen = input.autocomplete('widget').is(':visible');
				})
				.click(function() {	
					input.focus();
					// Close if already visible
					if ( wasOpen ) {
						return;
					}
					/* Pass empty string as value to search for, 
					displaying all results */
					input.autocomplete('search', '');
				})
		},
		_removeIfInvalid: function( event, ui ) {
			// Search for a match (case-insensitive)
			var value = this.input.val(),
				valueLowerCase = value.toLowerCase(),
				valid = false;
			$.each(this.options.data, function(i, item) {
				if(value.toLowerCase() === item.toLowerCase()) {
					valid = true;
					return false;
				}
			});
			// Found a match, nothing to do
			if ( valid ) {
				return;
			}
			// Remove invalid value
			this.input
				.val('')
				.attr('title', value + ' didn\'t match any item' )
				.tooltip('open');
			this.element.val('');
			this._delay(function() {
				this.input.tooltip('close').attr('title','');
			}, 2500 );
			this.input.autocomplete('instance').term = '';
		},
		_destroy: function() {
			this.wrapper.remove();
			this.element.show();
		}
	});
})(jQuery);

