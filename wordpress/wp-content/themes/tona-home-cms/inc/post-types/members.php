<?php
/**
 * Members post type setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_register_member_post_type() {
    register_post_type(
        'tona_member',
        array(
            'labels'       => array(
                'name'          => 'Members',
                'singular_name' => 'Member',
                'add_new_item'  => 'Add New Member',
                'edit_item'     => 'Edit Member',
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'menu_icon'    => 'dashicons-groups',
            'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
            'rewrite'      => array( 'slug' => 'members' ),
        )
    );
}
add_action( 'init', 'tona_cms_register_member_post_type' );

function tona_cms_member_admin_columns( $columns ) {
    $date_column = isset( $columns['date'] ) ? $columns['date'] : null;
    unset( $columns['date'] );

    $columns['tona_member_role'] = 'Role';
    $columns['tona_member_order'] = 'Order';

    if ( null !== $date_column ) {
        $columns['date'] = $date_column;
    }

    return $columns;
}
add_filter( 'manage_tona_member_posts_columns', 'tona_cms_member_admin_columns' );

function tona_cms_member_admin_column_content( $column, $post_id ) {
    if ( 'tona_member_role' === $column ) {
        echo esc_html( function_exists( 'get_field' ) ? ( get_field( 'member_role', $post_id ) ?: '' ) : '' );
        return;
    }

    if ( 'tona_member_order' === $column ) {
        echo esc_html( get_post_field( 'menu_order', $post_id ) );
    }
}
add_action( 'manage_tona_member_posts_custom_column', 'tona_cms_member_admin_column_content', 10, 2 );
