<?php
/**
 * Jobs page ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_jobs_page_load_fields( $fields, $parent ) {
    $parent_key = tona_cms_acf_parent_key( $parent );

    if ( 'group_tona_jobs_page' !== $parent_key || ! is_array( $fields ) ) {
        return $fields;
    }

    return array_values(
        array_filter(
            $fields,
            function ( $field ) {
                return ! in_array(
                    $field['key'] ?? '',
                    array(
                        'field_tona_jobs_interns_slots_label',
                        'field_tona_jobs_interns_majors_label',
                    ),
                    true
                );
            }
        )
    );
}
add_filter( 'acf/load_fields', 'tona_cms_jobs_page_load_fields', 20, 2 );

function tona_cms_jobs_interns_slots_value_acf_field( $field ) {
    $field['label'] = 'Internship Slots';
    $field['instructions'] = '';
    $field['wrapper']['width'] = '40';
    return $field;
}
add_filter( 'acf/load_field/key=field_tona_jobs_interns_slots_value', 'tona_cms_jobs_interns_slots_value_acf_field', 20 );

function tona_cms_jobs_interns_majors_value_acf_field( $field ) {
    $field['label'] = 'Majors Count';
    $field['instructions'] = '';
    $field['wrapper']['width'] = '40';
    return $field;
}
add_filter( 'acf/load_field/key=field_tona_jobs_interns_majors_value', 'tona_cms_jobs_interns_majors_value_acf_field', 20 );

function tona_cms_jobs_interns_intro_left_acf_field( $field ) {
    $field['label'] = 'Internship Intro Left';
    $field['name'] = 'jobs_interns_intro_left';
    return $field;
}
add_filter( 'acf/load_field/key=field_6a0c927692087', 'tona_cms_jobs_interns_intro_left_acf_field', 20 );

function tona_cms_jobs_interns_intro_right_acf_field( $field ) {
    $field['label'] = 'Internship Summary Right';
    $field['name'] = 'jobs_interns_intro_right';
    return $field;
}
add_filter( 'acf/load_field/key=field_6a0c92aa92088', 'tona_cms_jobs_interns_intro_right_acf_field', 20 );
