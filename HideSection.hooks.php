<?php
/**
 * Hooks for extension HideSection.
 * @ingroup Extensions
 */

class HideSectionHooks {

    public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
        $out->addModules( 'ext.hideSection' );
        return true;
     }

    public static function onSkinEditSectionLinks( $skin, $title, $section, $tooltip, &$links, $lang ) {
        global $wgHideSectionHideText;

        if ($wgHideSectionHideText) return true;

        $hidetext  = wfMessage( 'hidesection-hide' )->text();
        $showtext  = wfMessage( 'hidesection-show' )->text();
        $titletext = wfMessage( 'hidesection-hidetitle' )->text();

        // Add hide/show link next to edit links
        if ($section !== 0) {
            $links['hidesection'] = [
                'targetTitle' => $title,
                'text' => $hidetext,
                'attribs' => [
                    "class" => "hidesection-link internal",
                    "data-show" => $showtext,
                    "data-hide" => $hidetext,
                    "data-section" => $section,
                    "title" => $titletext,
                    ],
                'query' => array(),
                'options' => array(),
            ];
        }

        // Add hide all/show all link on first section
        if ($section == 1) {
            $showall  = wfMessage( 'hidesection-showall' )->text();
            $hideall  = wfMessage( 'hidesection-hideall' )->text();
            $titleall = wfMessage( 'hidesection-hidealltitle' )->text();

            $links['hidesectionall'] = [
                'targetTitle' => $title,
                'text' => $hideall,
                'attribs' => [
                    "class" => "hidesection-all internal",
                    "data-show" => $showall,
                    "data-hide" => $hideall,
                    "title" => $titleall,
                    ],
                'query' => array(),
                'options' => array(),
            ];
        }

    }

    public static function onSkinTemplateOutputPageBeforeExec ( &$skin, &$template ) {
        global $wgHideSectionTitleLink;

        if ($wgHideSectionTitleLink) {
            $showall  = wfMessage( 'hidesection-showall' )->text();
            $hideall  = wfMessage( 'hidesection-hideall' )->text();
            $titleall = wfMessage( 'hidesection-hidealltitle' )->text();

            $linkelem = Html::element('a', [
                    "class" => "hidesection-all internal",
                    "data-show" => $showall,
                    "data-hide" => $hideall,
                    "title" => $titleall,
                    "href" => "#`"
                ],
                $hideall
            );
            $hideelem = Html::Rawelement('span',
                 array( 'class' => 'hidesection-head' ),
                '[' . $linkelem . ']'
            );

            // Append to page title
            $template->data['title'] .= $hideelem;
        }
        return true;
    }
}

