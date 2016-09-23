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

    public static function onParserSectionCreate( $parser, $section, &$sectionContent, $showEditLinks ) {
        global $wgHideSectionImages;
        
        if ($section <= 0 || !$showEditLinks) {
                return true;
        }

        // Could theoretically break if another extension loads before us
        $headerLevel = (int) substr( $sectionContent, 2, 1 );

        // Add the image form
        if ($wgHideSectionImages) {
            $img = Xml::Element( 'img', [
                'class'     => "hidesection-image",
                'src'       => $wgHideSectionImages['hide'],
                'data-hide' => $wgHideSectionImages['hide'],
                'data-show' => $wgHideSectionImages['show']
            ]);

            if (isset($wgHideSectionImages['location']) && $wgHideSectionImages['location'] == "end") {
                $sectionContent = preg_replace('/(?=<\/h[2-6]\>)/', $img, $sectionContent, 1);
            }
            else {
                // Right after the very first <h*> tag
                $sectionContent = preg_replace('/>\K/', $img, $sectionContent, 1);
            }

        }
        
        // Insert the inner div around the section's contents so we can hide that
        // And an outer div around the entire section for hierarchical hiding
        $sectionContent = preg_replace( '/<\/h[2-6]>\K/', '<div class="hs-section">', $sectionContent, 1 );
        $sectionContent = Html::Rawelement("div",
                [ 'class' => "hs-block", 'data-level' => $headerLevel ],
                $sectionContent . "</div>"
        );

        return true;
    }


    public static function onSkinEditSectionLinks( $skin, $title, $section, $tooltip, &$links, $lang ) {
        global $wgHideSectionHideText;

        if ($wgHideSectionHideText) return true;

        $hidetext = wfMessage( 'hidesection-hide' )->text();
        $showtext = wfMessage( 'hidesection-show' )->text();

        // Add hide/show link next to edit links
        if ($section !== 0) {
            $links[] = [
                'targetTitle' => $title,
                'text' => $hidetext,
                'attribs' => [
                    "class" => "hidesection-link",
                    "data-show" => $showtext,
                    "data-hide" => $hidetext,
                    "data-section" => $section,
                    "title" => "Hide this section",
                    ],
                'query' => array(),
                'options' => array(),
            ];
        }

        // Add hide all/show all link on first section
        if ($section == 1) {
            $showall = wfMessage( 'hidesection-showall' )->text();
            $hideall = wfMessage( 'hidesection-hideall' )->text();

            $links[] = [
                'targetTitle' => $title,
                'text' => $hideall,
                'attribs' => [
                    "class" => "hidesection-all",
                    "data-show" => $showall,
                    "data-hide" => $hideall,
                    "title" => "Hide all sections",
                    ],
                'query' => array(),
                'options' => array(),
            ];
        }

    }

    public static function onSkinTemplateOutputPageBeforeExec ( &$skin, &$template ) {
        global $wgHideSectionTitleLink;

        if ($wgHideSectionTitleLink) {
            $showall = wfMessage( 'hidesection-showall' )->text();
            $hideall = wfMessage( 'hidesection-hideall' )->text();

            $linkelem = Html::element('a', [
                    "class" => "hidesection-all",
                    "data-show" => $showall,
                    "data-hide" => $hideall,
                    "title" => "Hide all sections",
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

