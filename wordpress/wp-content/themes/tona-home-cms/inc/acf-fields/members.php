<?php
/**
 * Members page ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_prepare_members_field_clean_labels( $field ) {
    if ( ! tona_cms_is_page_editor_screen() ) {
        return $field;
    }

    $field_map = array(
        'field_tona_members_tab_hero' => array( 'label' => '01. Hero' ),
        'field_tona_members_hero_title' => array(
            'label'        => 'Hero Title',
            'instructions' => 'Large heading at the top of the page. Line breaks are allowed.',
        ),
        'field_tona_members_hero_description' => array(
            'label'        => 'Hero Description',
            'instructions' => 'Short paragraph below the hero title.',
        ),
        'field_tona_members_tab_leadership' => array( 'label' => '02. Leadership Cards' ),
        'field_tona_members_leadership' => array(
            'label'        => 'Leadership Members',
            'instructions' => 'Each row is one portrait card. Drag rows to change the display order.',
        ),
        'field_tona_members_member_id' => array(
            'label'        => 'ID',
            'instructions' => 'Optional internal ID.',
        ),
        'field_tona_members_member_name' => array( 'label' => 'Name' ),
        'field_tona_members_member_role' => array( 'label' => 'Role' ),
        'field_tona_members_member_role_en' => array( 'label' => 'Role EN' ),
        'field_tona_members_member_image' => array( 'label' => 'Portrait Image' ),
        'field_tona_members_member_bio' => array( 'label' => 'Short Bio' ),
        'field_tona_members_member_linkedin' => array( 'label' => 'LinkedIn' ),
        'field_tona_members_tab_values' => array( 'label' => '03. Core Values' ),
        'field_tona_members_values_title' => array(
            'label'        => 'Values Section Title',
            'instructions' => 'Heading for the values section.',
        ),
        'field_tona_members_values' => array(
            'label'        => 'Values',
            'instructions' => 'Each row is one card in the values grid.',
        ),
        'field_tona_members_value_icon' => array( 'label' => 'Icon' ),
        'field_tona_members_value_title' => array( 'label' => 'Card Title' ),
        'field_tona_members_value_description' => array( 'label' => 'Card Description' ),
        'field_tona_members_tab_teaser' => array( 'label' => '04. Footer CTA' ),
        'field_tona_members_teaser_title' => array(
            'label'        => 'CTA Title',
            'instructions' => 'Title for the white CTA block at the bottom of the page.',
            'wrapper'      => array(
                'width' => '50',
                'class' => 'tona-cta-title',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_description' => array(
            'label'   => 'CTA Description',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-description',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_link_label' => array(
            'label'   => 'Button Label',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-button-label',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_link_url' => array(
            'label'   => 'Button Target Page',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-button-url',
                'id'    => '',
            ),
        ),
    );

    if ( isset( $field_map[ $field['key'] ] ) ) {
        $field = array_merge( $field, $field_map[ $field['key'] ] );
    }

    return $field;
}
add_filter( 'acf/prepare_field', 'tona_cms_prepare_members_field_clean_labels', 20 );
