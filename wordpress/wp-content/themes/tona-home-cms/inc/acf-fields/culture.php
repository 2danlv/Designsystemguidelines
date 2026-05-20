<?php
/**
 * Culture page ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_culture_yearly_themes_acf_field( $field ) {
    if ( empty( $field['sub_fields'] ) || ! is_array( $field['sub_fields'] ) ) {
        return $field;
    }

    $field['sub_fields'] = array_values(
        array_filter(
            $field['sub_fields'],
            function ( $sub_field ) {
                return 'field_tona_culture_theme_active' !== ( $sub_field['key'] ?? '' );
            }
        )
    );

    return $field;
}
add_filter( 'acf/load_field/key=field_tona_culture_yearly_themes', 'tona_cms_culture_yearly_themes_acf_field', 20 );
