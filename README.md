# HideSection


A Mediawiki extension that adds links on each header to collapse the section.
This allows users to easily wade through long wiki pages and jump to the section
they want to read.

This extension hides sections hierarchically. That means if you hide a top level
header, any headers below it are automatically hidden.  Additionally, there is a
"show all"/"hide all" button.

## Installation

Requires Mediawiki 1.25 or higher, as we use extension registration. Just do the
standard phrase in your LocalSettings.php:

```php
wfLoadExtension( "HideSection" );
```

## Configuration

* $wgHideSectionImages - Use these images as hide/show links.  Default is null.
  If this array is set, images will be added according the the place marked in
  location. Location "begin" is before the first text of the header, while "end"
  places it at the very end of the header.

```php
$wgHideSectionImages = [
	"show" => "https://upload.wikimedia.org/wikipedia/commons/f/f7/Arrow-down-navmenu.png",
	"hide" => "https://upload.wikimedia.org/wikipedia/commons/0/01/Arrow-up-navmenu.png",
	"location" => "begin" # or "end"
];
```

* $wgHideSectionHideText - If set to a true value, text show/hide links are
  disabled. Useful when *only* images are wanted.
* $wgHideSectionTitleLink - If set to a true value, adds a show all/hide all
  to the right of the page title.
