<?php
/**
 * Home page ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_home_title_image_field() {
    $field = tona_cms_acf_image_field(
        'field_tona_home_hero_title_image',
        'Hero Title PNG',
        'home_hero_title_image',
        'Upload the transparent PNG displayed in place of the Build It heading. Leave empty to use the text fallback.'
    );

    $field['wrapper']['width'] = '50';
    $field['mime_types'] = 'png';

    return $field;
}

function tona_cms_home_load_fields( $fields, $parent ) {
    if ( 'group_tona_home_page' !== tona_cms_acf_parent_key( $parent ) ) {
        return $fields;
    }

    return tona_cms_insert_acf_field_after(
        $fields,
        'field_tona_home_hero_title',
        tona_cms_home_title_image_field()
    );
}
add_filter( 'acf/load_fields', 'tona_cms_home_load_fields', 20, 2 );

function tona_cms_home_title_fallback_field( $field ) {
    $field['label'] = 'Hero Title Text (Fallback)';
    $field['instructions'] = 'Used only when no transparent Hero Title PNG has been uploaded.';
    return $field;
}
add_filter( 'acf/load_field/key=field_tona_home_hero_title', 'tona_cms_home_title_fallback_field', 20 );
