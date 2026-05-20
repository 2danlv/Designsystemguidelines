<?php
/**
 * Shared ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_remove_breadcrumb_label_fields( $fields, $parent ) {
    if ( ! is_array( $fields ) ) {
        return $fields;
    }

    return array_values(
        array_filter(
            $fields,
            function ( $field ) {
                return ! preg_match( '/_breadcrumb_label$/', $field['name'] ?? '' );
            }
        )
    );
}
add_filter( 'acf/load_fields', 'tona_cms_remove_breadcrumb_label_fields', 25, 2 );
