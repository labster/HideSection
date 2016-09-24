( function ( $, mw ) {
	'use strict';

	function hidesection (e) {
		e.preventDefault();

		var $link = $( this );

		var $this_block = $link.parents('.hs-block');
		var $textlink = $link.attr('class') == "hidesection-link"  ? $link : $this_block.find('.hidesection-link');
		var $imglink  = $link.attr('class') == "hidesection-image" ? $link : $this_block.find('.hidesection-image');

		// Did we click text or an image?
		var $show = this.tagName == 'IMG'
				? $imglink.attr('src') == $link.data('show')
				: $textlink.html() == $link.data('show');
		var $toggle   = $show ? 'show' : 'hide';
		var $nexttext = $show ? 'hide' : 'show';

		// toggle text and/or image
                $textlink.text( $textlink.data($nexttext) );
		$imglink.attr( 'src', $imglink.data($nexttext) );

		// Toggle this div visibility
		$this_block.children('.hs-section')[$toggle]();

		// Toggle divs under this hierarchy
		var $level = $this_block.data('level');
		var $next_blocks = $this_block.nextAll('.hs-block');

		$next_blocks.each( function( index, element ) {
			var $block = $( element );
			if ($block.data('level') <= $level) {
				// Break loop if we're out of subsections
				return false;
			}

			// Keep track of whether or not this div is hidden
			// on multiple levels
			var $hiddenby = element['mwSHHiddenBy'] || {};
			if ($toggle == "show") {
				delete $hiddenby[$level];
			} else {
				$hiddenby[$level] = true;
			}
			element['mwSHHiddenBy'] = $hiddenby;

			// Toggle (or keep the same)
			if ( Object.keys($hiddenby).length ) {
				$block.hide();
			}
			else {
				$block.show()
			}
		});
	}

	function hideall (e) {
		e.preventDefault();

		var $link = $( '.hidesection-all' );
		// Toggle text
		var $show = 0;
		if ( $link.html() == $link.data('hide') ) {
			$link.text( $link.data('show') );
		} else {
			$link.text( $link.data('hide') );
			$show = 1;
		}

		var $sections = $('.hs-block, .hs-section').not("[data-level='2']");
		var $textlink = $(".hidesection-link");
		var $imglink  = $(".hidesection-image");
		if ($show) {
			$sections.show();
			$textlink.text( $textlink.data('hide') );
			$imglink.attr( 'src', $imglink.data('hide') );
		} else {
			$sections.hide();
			$textlink.text( $textlink.data('show') );
			$imglink.attr( 'src', $imglink.data('show') );
		}
	}

	mw.hook( 'wikipage.content' ).add( function () {
		$('.hidesection-link, .hidesection-image').click( hidesection );
		$('.hidesection-all').click( hideall );
	} );
}( jQuery, mediaWiki ) );
