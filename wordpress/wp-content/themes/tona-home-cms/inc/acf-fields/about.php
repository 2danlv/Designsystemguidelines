<?php
/**
 * About page ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_about_background_field_map() {
    return array(
        'field_tona_about_hero_description' => tona_cms_acf_color_field(
            'field_tona_about_hero_background',
            'Hero Background Color',
            'about_hero_background',
            '#002d17',
            'Leave empty to use the default dark green background.'
        ),
        'field_tona_about_tab_mission' => tona_cms_acf_image_field(
            'field_tona_about_mission_background_image',
            'Background Image',
            'about_mission_background_image',
            'Image behind the Mission / Vision cards. Leave empty to keep the default artwork.'
        ),
        'field_tona_about_values_title' => tona_cms_acf_color_field(
            'field_tona_about_values_background',
            'Section Background Color',
            'about_values_background',
            '#ffffff',
            'Leave empty to use the default white background.'
        ),
        'field_tona_about_timeline_title' => tona_cms_acf_color_field(
            'field_tona_about_timeline_background',
            'Section Background Color',
            'about_timeline_background',
            '#f9f9f7',
            'Leave empty to use the default light background.'
        ),
        'field_tona_about_certifications_title' => tona_cms_acf_color_field(
            'field_tona_about_certifications_background',
            'Section Background Color',
            'about_certifications_background',
            '#002d17',
            'Leave empty to use the default dark green background.'
        ),
        'field_tona_about_tab_cta' => tona_cms_acf_color_field(
            'field_tona_about_cta_background',
            'CTA Background Color',
            'about_cta_background',
            '#ffffff',
            'Leave empty to use the default white background.',
            'tona-about-cta-background'
        ),
    );
}

function tona_cms_about_load_fields( $fields, $parent ) {
    $parent_key = tona_cms_acf_parent_key( $parent );

    if ( 'group_tona_about_page' !== $parent_key ) {
        return $fields;
    }

    foreach ( tona_cms_about_background_field_map() as $after_key => $field ) {
        $fields = tona_cms_insert_acf_field_after( $fields, $after_key, $field );
    }

    return $fields;
}
add_filter( 'acf/load_fields', 'tona_cms_about_load_fields', 20, 2 );

function tona_cms_about_hero_left_acf_field( $field ) {
    $field['label'] = 'Hero Intro Left';
    $field['name'] = 'about_hero_intro_left';
    return $field;
}
add_filter( 'acf/load_field/key=field_6a0c957f227a9', 'tona_cms_about_hero_left_acf_field', 20 );

function tona_cms_about_hero_right_acf_field( $field ) {
    $field['label'] = 'Hero Stats Right';
    $field['name'] = 'about_hero_stats_right';
    return $field;
}
add_filter( 'acf/load_field/key=field_6a0c95b1227aa', 'tona_cms_about_hero_right_acf_field', 20 );

function tona_cms_register_about_timeline_image_field() {
    if ( ! function_exists( 'acf_add_local_field' ) ) {
        return;
    }

    $field = tona_cms_acf_image_field(
        'field_tona_about_timeline_image',
        'Timeline Image',
        'about_timeline_image',
        'Select an existing image or upload a new one. When set, this image replaces the Timeline Items content on the About page.'
    );
    $field['parent'] = 'group_tona_about_page';
    $field['menu_order'] = 26;

    acf_add_local_field( $field );
}
add_action( 'acf/init', 'tona_cms_register_about_timeline_image_field', 30 );
