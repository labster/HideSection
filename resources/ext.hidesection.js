( function ( $, mw ) {
	'use strict';

	function hidesection (e) {
		e.preventDefault();

		var $link = $( this );
		var $this_block = $link.parents('.hs-block');
		var $textlink = $link.attr('class') == "hidesection-link"  ? $link : $this_block.find('.hidesection-link');
		var $imglink  = $link.attr('class') == "hidesection-image" ? $link : $this_block.children('.hidesection-image');
		// Toggle text
		if ( $textlink.html() == $link.data('hide') ) {
			$textlink.html( $textlink.data('show') );
		} else {
			$textlink.html( $textlink.data('hide') );
		}
		// Toggle image
		if ( $imglink.attr('src') == $link.data('hide') ) {
			$imglink.attr( 'src', $imglink.data('show') );
		} else {
			$imglink.attr( 'src', $imglink.data('hide') );
		}

		// Toggle this div visibility
		$this_block.children('.hs-section').toggle();

		// Toggle divs under this hierarchy
		var $level = $this_block.data('level');
		var $next_blocks = $this_block.nextAll('.hs-block');

		$next_blocks.each( function( index, element ) {
			var $block = $( element );
			if ($block.data('level') <= $level) {
				return false;
			}
			$block.toggle();
		});
	}

	function hideall (e) {
		e.preventDefault();

		var $link = $( '.hidesection-all' );
		// Toggle text
		var $show = 0;
		if ( $link.html() == $link.data('hide') ) {
			$link.html( $link.data('show') );
		} else {
			$link.html( $link.data('hide') );
			$show = 1;
		}

		var $sections = $('.hs-block, .hs-section').not("[data-level='2']");
		var $textlink = $(".hidesection-link");
		var $imglink  = $(".hidesection-image");
		if ($show) {
			$sections.show();
			$textlink.html( $textlink.data('hide') );
			$imglink.attr( 'src', $imglink.data('hide') );
		} else {
			$sections.hide();
			$textlink.html( $textlink.data('show') );
			$imglink.attr( 'src', $imglink.data('show') );
		}
	}

	mw.hook( 'wikipage.content' ).add( function () {
		$('.hidesection-link, .hidesection-image').click( hidesection );
		$('.hidesection-all').click( hideall );
	} );
}( jQuery, mediaWiki ) );
