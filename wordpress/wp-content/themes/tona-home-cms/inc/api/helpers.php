<?php
/**
 * Shared REST payload helpers.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_image_url( $image ) {
    if ( is_array( $image ) && ! empty( $image['url'] ) ) {
        return esc_url_raw( $image['url'] );
    }

    if ( is_numeric( $image ) ) {
        $url = wp_get_attachment_image_url( (int) $image, 'large' );
        return $url ? esc_url_raw( $url ) : '';
    }

    return is_string( $image ) ? esc_url_raw( $image ) : '';
}

function tona_cms_decode_text( $value ) {
    if ( ! is_string( $value ) ) {
        return '';
    }

    return html_entity_decode( wp_specialchars_decode( $value, ENT_QUOTES ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
}

function tona_cms_text_field( $post_id, $field_name ) {
    $value = function_exists( 'get_field' ) ? get_field( $field_name, $post_id ) : '';
    return tona_cms_decode_text( $value );
}

function tona_cms_localized_text_field( $post_id, $field_name, $language ) {
    if ( 'en' === $language ) {
        $localized_value = tona_cms_text_field( $post_id, $field_name . '_en' );

        if ( '' !== trim( $localized_value ) ) {
            return $localized_value;
        }
    }

    return tona_cms_text_field( $post_id, $field_name );
}

function tona_cms_localized_link_items_payload( $option_id, $field_name, $language ) {
    if ( 'en' === $language && function_exists( 'get_field' ) ) {
        $localized_items = get_field( $field_name . '_en', $option_id );
        $localized_payload = tona_cms_link_items_payload( is_array( $localized_items ) ? $localized_items : array() );

        if ( ! empty( $localized_payload ) ) {
            return $localized_payload;
        }
    }

    return tona_cms_link_items_payload( function_exists( 'get_field' ) ? get_field( $field_name, $option_id ) : array() );
}

function tona_cms_group_text_field( $post_id, $group_names, $field_name, $fallback_field_name = '' ) {
    if ( ! function_exists( 'get_field' ) ) {
        return '';
    }

    foreach ( (array) $group_names as $group_name ) {
        $group = get_field( $group_name, $post_id );

        if ( is_array( $group ) && isset( $group[ $field_name ] ) && is_string( $group[ $field_name ] ) ) {
            return $group[ $field_name ];
        }
    }

    return $fallback_field_name ? tona_cms_text_field( $post_id, $fallback_field_name ) : '';
}

function tona_cms_lines_field( $post_id, $field_name ) {
    $value = tona_cms_text_field( $post_id, $field_name );

    if ( '' === trim( $value ) ) {
        return array();
    }

    $lines = preg_split( '/\r\n|\r|\n/', $value );

    return array_values(
        array_filter(
            array_map( 'trim', is_array( $lines ) ? $lines : array() )
        )
    );
}

function tona_cms_repeater_lines_field( $post_id, $field_name, $sub_field_name, $fallback_field_name = '' ) {
    $rows = function_exists( 'get_field' ) ? get_field( $field_name, $post_id ) : array();

    if ( is_array( $rows ) ) {
        $items = array_values(
            array_filter(
                array_map(
                    function ( $row ) use ( $sub_field_name ) {
                        return is_array( $row ) ? trim( $row[ $sub_field_name ] ?? '' ) : '';
                    },
                    $rows
                )
            )
        );

        if ( ! empty( $items ) ) {
            return $items;
        }
    }

    if ( $fallback_field_name ) {
        $fallback_items = tona_cms_lines_field( $post_id, $fallback_field_name );

        if ( ! empty( $fallback_items ) ) {
            return $fallback_items;
        }

        $raw_value = get_post_meta( $post_id, $fallback_field_name, true );

        if ( is_string( $raw_value ) && '' !== trim( $raw_value ) ) {
            $lines = preg_split( '/\r\n|\r|\n/', $raw_value );

            return array_values(
                array_filter(
                    array_map( 'trim', is_array( $lines ) ? $lines : array() )
                )
            );
        }
    }

    return array();
}

