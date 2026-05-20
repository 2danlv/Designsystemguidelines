<?php
/**
 * Services page ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_services_items_acf_field( $field ) {
    if ( empty( $field['sub_fields'] ) || ! is_array( $field['sub_fields'] ) ) {
        return $field;
    }

    $field['sub_fields'] = array_values(
        array_filter(
            $field['sub_fields'],
            function ( $sub_field ) {
                return 'field_tona_services_item_tag' !== ( $sub_field['key'] ?? '' );
            }
        )
    );

    return $field;
}
add_filter( 'acf/load_field/key=field_tona_services_items', 'tona_cms_services_items_acf_field', 20 );

function tona_cms_services_unique_featured_card( $value, $post_id, $field ) {
    if ( ! is_array( $value ) ) {
        return $value;
    }

    $featured_found = false;

    foreach ( $value as $row_index => $row ) {
        if ( ! is_array( $row ) ) {
            continue;
        }

        $featured_key = array_key_exists( 'featured', $row ) ? 'featured' : 'field_tona_services_item_featured';

        if ( ! empty( $row[ $featured_key ] ) && ! $featured_found ) {
            $value[ $row_index ][ $featured_key ] = 1;
            $featured_found = true;
            continue;
        }

        $value[ $row_index ][ $featured_key ] = 0;
    }

    return $value;
}
add_filter( 'acf/update_value/name=services_items', 'tona_cms_services_unique_featured_card', 20, 3 );
