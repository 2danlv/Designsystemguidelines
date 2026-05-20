<?php
/**
 * Projects post type setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_register_project_post_type() {
    register_post_type(
        'tona_project',
        array(
            'labels'       => array(
                'name'          => 'Projects',
                'singular_name' => 'Project',
                'add_new_item'  => 'Add New Project',
                'edit_item'     => 'Edit Project',
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'menu_icon'    => 'dashicons-building',
            'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
            'rewrite'      => array( 'slug' => 'projects' ),
        )
    );

    register_taxonomy(
        'tona_project_category',
        'tona_project',
        array(
            'labels'       => array(
                'name'          => 'Project Categories',
                'singular_name' => 'Project Category',
                'add_new_item'  => 'Add New Project Category',
                'edit_item'     => 'Edit Project Category',
            ),
            'hierarchical' => true,
            'public'       => true,
            'show_ui'      => true,
            'show_in_rest' => true,
            'rewrite'      => array( 'slug' => 'project-category' ),
        )
    );

    $default_terms = array(
        'industrial'    => 'Industrial',
        'commercial'    => 'Commercial',
        'solar-rooftop' => 'Solar Rooftop',
        'hotels'        => 'Hotels',
        'apartments'    => 'Apartments',
    );

    foreach ( $default_terms as $slug => $name ) {
        if ( ! term_exists( $slug, 'tona_project_category' ) ) {
            wp_insert_term( $name, 'tona_project_category', array( 'slug' => $slug ) );
        }
    }
}
add_action( 'init', 'tona_cms_register_project_post_type' );

function tona_cms_project_admin_columns( $columns ) {
    $date_column = isset( $columns['date'] ) ? $columns['date'] : null;
    unset( $columns['date'] );
    $columns['tona_project_category'] = 'Categories';

    if ( null !== $date_column ) {
        $columns['date'] = $date_column;
    }

    return $columns;
}
add_filter( 'manage_tona_project_posts_columns', 'tona_cms_project_admin_columns' );

function tona_cms_project_admin_column_content( $column, $post_id ) {
    if ( 'tona_project_category' !== $column ) {
        return;
    }

    $terms = get_the_terms( $post_id, 'tona_project_category' );
    echo is_wp_error( $terms ) || empty( $terms ) ? '&mdash;' : esc_html( implode( ', ', wp_list_pluck( $terms, 'name' ) ) );
}
add_action( 'manage_tona_project_posts_custom_column', 'tona_cms_project_admin_column_content', 10, 2 );

function tona_cms_project_admin_category_filter() {
    $screen = get_current_screen();

    if ( ! $screen || 'edit-tona_project' !== $screen->id ) {
        return;
    }

    wp_dropdown_categories(
        array(
            'show_option_all' => 'All Project Categories',
            'taxonomy'        => 'tona_project_category',
            'name'            => 'tona_project_category',
            'orderby'         => 'name',
            'selected'        => isset( $_GET['tona_project_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_project_category'] ) ) : '',
            'hierarchical'    => true,
            'depth'           => 0,
            'show_count'      => false,
            'hide_empty'      => false,
            'value_field'     => 'slug',
        )
    );
}
add_action( 'restrict_manage_posts', 'tona_cms_project_admin_category_filter' );

function tona_cms_project_admin_category_query( $query ) {
    global $pagenow;

    if ( ! is_admin() || 'edit.php' !== $pagenow || ! $query->is_main_query() || 'tona_project' !== $query->get( 'post_type' ) ) {
        return;
    }

    $category = isset( $_GET['tona_project_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_project_category'] ) ) : '';

    if ( '' === $category || '0' === $category ) {
        return;
    }

    $query->set(
        'tax_query',
        array(
            array(
                'taxonomy' => 'tona_project_category',
                'field'    => 'slug',
                'terms'    => $category,
            ),
        )
    );
}
add_action( 'pre_get_posts', 'tona_cms_project_admin_category_query' );
