<?php
/**
 * Projects ACF field adjustments.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_project_summary_acf_field( $field ) {
    $field['type'] = 'repeater';
    $field['label'] = 'Project Summary Items';
    $field['name'] = 'project_summary';
    $field['_name'] = 'project_summary';
    $field['instructions'] = 'Each row is one project info item shown on the project card/detail specs.';
    $field['wrapper'] = array(
        'width' => '',
        'class' => 'tona-acf-section',
        'id'    => '',
    );
    $field['collapsed'] = 'field_tona_project_summary_item_value';
    $field['min'] = 0;
    $field['max'] = 6;
    $field['layout'] = 'table';
    $field['button_label'] = 'Add Summary Item';
    $field['rows_per_page'] = 20;
    $field['sub_fields'] = array(
        array(
            'ID'                => 0,
            'key'               => 'field_tona_project_summary_item_key',
            '_key'              => 'field_tona_project_summary_item_key',
            'label'             => 'Item',
            'name'              => 'field',
            '_name'             => 'field',
            'type'              => 'select',
            'instructions'      => '',
            'required'          => 0,
            'conditional_logic' => 0,
            'wrapper'           => array(
                'width' => '35',
                'class' => '',
                'id'    => '',
            ),
            'choices'           => array(
                'client'   => 'Client',
                'location' => 'Location',
                'area'     => 'Area',
                'duration' => 'Duration',
                'status'   => 'Status',
                'year'     => 'Year',
            ),
            'default_value'     => 'client',
            'return_format'     => 'value',
            'multiple'          => 0,
            'allow_null'        => 0,
            'ui'                => 1,
            'ajax'              => 0,
            'placeholder'       => '',
            'parent_repeater'   => 'field_tona_project_summary',
        ),
        array(
            'ID'                => 0,
            'key'               => 'field_tona_project_summary_item_value',
            '_key'              => 'field_tona_project_summary_item_value',
            'label'             => 'Value',
            'name'              => 'value',
            '_name'             => 'value',
            'type'              => 'text',
            'instructions'      => 'Enter the value for this summary item.',
            'required'          => 0,
            'conditional_logic' => 0,
            'wrapper'           => array(
                'width' => '65',
                'class' => '',
                'id'    => '',
            ),
            'default_value'     => '',
            'maxlength'         => '',
            'placeholder'       => '',
            'prepend'           => '',
            'append'            => '',
            'parent_repeater'   => 'field_tona_project_summary',
        ),
    );

    return $field;
}
add_filter( 'acf/load_field/key=field_tona_project_summary', 'tona_cms_project_summary_acf_field', 20 );

function tona_cms_project_line_repeater_acf_field( $field, $label, $name, $sub_field_key, $button_label ) {
    $field['type'] = 'repeater';
    $field['label'] = $label;
    $field['name'] = $name;
    $field['_name'] = $name;
    $field['instructions'] = 'Each row is one item.';
    $field['wrapper'] = array(
        'width' => '',
        'class' => 'tona-acf-section',
        'id'    => '',
    );
    $field['collapsed'] = $sub_field_key;
    $field['min'] = 0;
    $field['max'] = 0;
    $field['layout'] = 'table';
    $field['button_label'] = $button_label;
    $field['rows_per_page'] = 20;
    $field['sub_fields'] = array(
        array(
            'ID'                => 0,
            'key'               => $sub_field_key,
            '_key'              => $sub_field_key,
            'label'             => 'Item',
            'name'              => 'item',
            '_name'             => 'item',
            'type'              => 'text',
            'instructions'      => '',
            'required'          => 0,
            'conditional_logic' => 0,
            'wrapper'           => array(
                'width' => '',
                'class' => '',
                'id'    => '',
            ),
            'default_value'     => '',
            'maxlength'         => '',
            'placeholder'       => '',
            'prepend'           => '',
            'append'            => '',
            'parent_repeater'   => $field['key'],
        ),
    );

    return $field;
}

function tona_cms_project_renovation_items_acf_field( $field ) {
    return tona_cms_project_line_repeater_acf_field(
        $field,
        'Construction Items',
        'project_renovation_items',
        'field_tona_project_renovation_item_text',
        'Add Construction Item'
    );
}
add_filter( 'acf/load_field/key=field_tona_project_renovation_items', 'tona_cms_project_renovation_items_acf_field', 20 );

function tona_cms_project_highlights_acf_field( $field ) {
    return tona_cms_project_line_repeater_acf_field(
        $field,
        'Highlights',
        'project_highlights',
        'field_tona_project_highlight_text',
        'Add Highlight'
    );
}
add_filter( 'acf/load_field/key=field_tona_project_highlights', 'tona_cms_project_highlights_acf_field', 20 );

function tona_cms_migrate_project_lines_to_repeater( $post_id, $field_name, $field_key, $sub_field_name, $sub_field_key ) {
    $raw_value = get_post_meta( $post_id, $field_name, true );

    if ( ! is_string( $raw_value ) || '' === trim( $raw_value ) || preg_match( '/^\d+$/', trim( $raw_value ) ) ) {
        return;
    }

    $items = array_values(
        array_filter(
            array_map( 'trim', preg_split( '/\R+/', $raw_value ) )
        )
    );

    if ( empty( $items ) ) {
        return;
    }

    update_post_meta( $post_id, $field_name, count( $items ) );
    update_post_meta( $post_id, '_' . $field_name, $field_key );

    foreach ( $items as $index => $item ) {
        $row_key = $field_name . '_' . $index . '_' . $sub_field_name;
        update_post_meta( $post_id, $row_key, $item );
        update_post_meta( $post_id, '_' . $row_key, $sub_field_key );
    }
}

function tona_cms_migrate_project_repeaters_on_edit() {
    $post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

    if ( ! $post_id || 'tona_project' !== get_post_type( $post_id ) ) {
        return;
    }

    tona_cms_migrate_project_lines_to_repeater(
        $post_id,
        'project_renovation_items',
        'field_tona_project_renovation_items',
        'item',
        'field_tona_project_renovation_item_text'
    );
    tona_cms_migrate_project_lines_to_repeater(
        $post_id,
        'project_highlights',
        'field_tona_project_highlights',
        'item',
        'field_tona_project_highlight_text'
    );
}
add_action( 'load-post.php', 'tona_cms_migrate_project_repeaters_on_edit' );
