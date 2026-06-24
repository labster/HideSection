( function ( $, mw ) {
	'use strict';

	const non_nesting = {
		'H1': '.mw-heading1',
		'H2': '.mw-heading1,.mw-heading2',
		'H3': '.mw-heading1,.mw-heading2,.mw-heading3',
		'H4': '.mw-heading1,.mw-heading2,.mw-heading3,.mw-heading4',
		'H5': '.mw-heading1,.mw-heading2,.mw-heading3,.mw-heading4,.mw-heading5',
		'H6': '.mw-heading1,.mw-heading2,.mw-heading3,.mw-heading4,.mw-heading5,.mw-heading6',
	};
	const hide_classes = [ 'hs-hide-H1','hs-hide-H2','hs-hide-H3','hs-hide-H4','hs-hide-H5','hs-hide-H6' ];

	function hidesection (e, $link) {
		if (e) e.preventDefault();
		$link ||= $( this );

		var $editlinks = $link.parents('.mw-editsection').first();
		var $textlink = $link.attr('class') == "hidesection-link"  ? $link : $editlinks.find('.hidesection-link');
		var $imglink  = $link.attr('class') == "hidesection-image" ? $link : $editlinks.find('.hidesection-image');

		// Did we click text or an image?
		var $show = $link.prop('tagName') == 'IMG'
				? $imglink.attr('src') == $link.data('show')
				: $textlink.html() == $link.data('show');
		var $toggle   = $show ? 'show' : 'hide';
		var $nexttext = $show ? 'hide' : 'show';
		var $toggleClass = $show ? 'removeClass' : 'addClass';

		// toggle text and/or image
		$textlink.text( $textlink.data($nexttext) );
		$imglink.attr( 'src', $imglink.data($nexttext) );

		// Toggle visibility
		var $header  = $link.closest('.mw-heading');
		var level = $header.attr('class').match( /mw-heading([1-6])/ )[ 1 ];
		var headtype = 'H' + level;

		// include <tag> in class name, so section can be hidden by more than one link
		$header.nextUntil( non_nesting[headtype] )[$toggleClass]('hs-hide-' + headtype);
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

		var $textlink = $(".hidesection-link");
		var $imglink  = $(".hidesection-image");
		if ($show) {
			// just brute-force through this
			$('.hs-hide-H1,.hs-hide-H2,.hs-hide-H3,.hs-hide-H4,.hs-hide-H5,.hs-hide-H6').removeClass( hide_classes );
			$textlink.text( $textlink.data('hide') );
			$imglink.attr( 'src', $imglink.data('hide') );
		} else {
			$('.hidesection-link, .hidesection-image').each( function (i,el) { hidesection( undefined, $(el)) });
		}
	}

	mw.hook( 'wikipage.content' ).add( function () {
		$('.hidesection-head').each(function() {
			var showall = mw.message( 'hidesection-showall' ).text();
			var hideallmsg = mw.message( 'hidesection-hideall' ).text();
			var titleall = mw.message( 'hidesection-hidealltitle' ).text();
			var linkelem = $("<a>")
					.addClass( "hidesection-all" )
					.addClass( "internal ")
					.attr( "data-show", showall)
					.attr( "data-hide", hideallmsg)
					.attr( "title", titleall)
					.text( hideallmsg );
			$(this).append( linkelem );
		});
		$('.hidesection-link, .hidesection-image').click( hidesection );
		$('.hidesection-all').click( hideall );
	} );
}( jQuery, mediaWiki ) );
