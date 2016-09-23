<?php
if ( function_exists( 'wfLoadExtension' ) ) {
    wfLoadExtension( 'HideSection' );
    return;
}
else {
    die( 'This extension requires MediaWiki 1.25+' );
}

