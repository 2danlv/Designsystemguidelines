<?php
/**
 * News ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_news_post_load_fields( $fields, $parent ) {
    $parent_key = tona_cms_acf_parent_key( $parent );

    if ( 'group_tona_news_post' !== $parent_key || ! is_array( $fields ) ) {
        return $fields;
    }

    return array_values(
        array_filter(
            $fields,
            function ( $field ) {
                return 'field_tona_news_featured' !== ( $field['key'] ?? '' );
            }
        )
    );
}
add_filter( 'acf/load_fields', 'tona_cms_news_post_load_fields', 20, 2 );
