<?php
/**
 * Shared icon choices for CMS select fields.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_icon_choices() {
    return array(
        'Award'         => 'Award',
        'BookOpen'      => 'Book Open',
        'Briefcase'     => 'Briefcase',
        'Building2'     => 'Building',
        'CheckCircle2'  => 'Check Circle',
        'Clock'         => 'Clock',
        'GraduationCap' => 'Graduation Cap',
        'Handshake'     => 'Handshake',
        'Heart'         => 'Heart',
        'Leaf'          => 'Leaf',
        'Lightbulb'     => 'Lightbulb',
        'MapPin'        => 'Map Pin',
        'PenTool'       => 'Pen Tool',
        'Shield'        => 'Shield',
        'Star'          => 'Star',
        'Sun'           => 'Sun',
        'Target'        => 'Target',
        'TrendingUp'    => 'Trending Up',
        'Trophy'        => 'Trophy',
        'Users'         => 'Users',
        'Wrench'        => 'Wrench',
        'Zap'           => 'Zap',
    );
}

function tona_cms_apply_icon_choices( $field ) {
    if ( ! is_array( $field ) || 'select' !== ( $field['type'] ?? '' ) ) {
        return $field;
    }

    $field['choices']       = tona_cms_icon_choices();
    $field['ui']            = 1;
    $field['allow_null']    = 0;
    $field['return_format'] = 'value';
    $field['instructions']  = 'Select the icon shown on the frontend.';

    return $field;
}
add_filter( 'acf/load_field/name=icon', 'tona_cms_apply_icon_choices', 20 );
