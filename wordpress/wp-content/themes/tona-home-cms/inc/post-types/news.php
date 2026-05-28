<?php
/**
 * News post type setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_register_news_post_type() {
    register_post_type(
        'tona_news',
        array(
            'labels'       => array(
                'name'          => 'News',
                'singular_name' => 'News Article',
                'add_new_item'  => 'Add New Article',
                'edit_item'     => 'Edit Article',
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'menu_icon'    => 'dashicons-megaphone',
            'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'author', 'page-attributes' ),
            'rewrite'      => array( 'slug' => 'news' ),
        )
    );

    register_taxonomy(
        'tona_news_category',
        'tona_news',
        array(
            'labels'       => array(
                'name'          => 'News Categories',
                'singular_name' => 'News Category',
                'add_new_item'  => 'Add New News Category',
                'edit_item'     => 'Edit News Category',
            ),
            'hierarchical' => true,
            'public'       => true,
            'show_ui'      => true,
            'show_in_rest' => true,
            'rewrite'      => array( 'slug' => 'news-category' ),
        )
    );

    register_taxonomy(
        'tona_news_tag',
        'tona_news',
        array(
            'labels'       => array(
                'name'          => 'News Tags',
                'singular_name' => 'News Tag',
                'add_new_item'  => 'Add New News Tag',
                'edit_item'     => 'Edit News Tag',
            ),
            'hierarchical' => false,
            'public'       => true,
            'show_ui'      => true,
            'show_in_rest' => true,
            'rewrite'      => array( 'slug' => 'news-tag' ),
        )
    );
}
add_action( 'init', 'tona_cms_register_news_post_type' );

function tona_cms_news_admin_columns( $columns ) {
    $date_column = isset( $columns['date'] ) ? $columns['date'] : null;
    unset( $columns['date'] );
    $columns['tona_news_category'] = 'Categories';

    if ( null !== $date_column ) {
        $columns['date'] = $date_column;
    }

    return $columns;
}
add_filter( 'manage_tona_news_posts_columns', 'tona_cms_news_admin_columns' );

function tona_cms_news_admin_column_content( $column, $post_id ) {
    if ( 'tona_news_category' === $column ) {
        $terms = get_the_terms( $post_id, 'tona_news_category' );
        echo is_wp_error( $terms ) || empty( $terms ) ? '&mdash;' : esc_html( implode( ', ', wp_list_pluck( $terms, 'name' ) ) );
        return;
    }
}
add_action( 'manage_tona_news_posts_custom_column', 'tona_cms_news_admin_column_content', 10, 2 );

function tona_cms_news_admin_category_filter() {
    $screen = get_current_screen();

    if ( ! $screen || 'edit-tona_news' !== $screen->id ) {
        return;
    }

    wp_dropdown_categories(
        array(
            'show_option_all' => 'All News Categories',
            'taxonomy'        => 'tona_news_category',
            'name'            => 'tona_news_category',
            'orderby'         => 'name',
            'selected'        => isset( $_GET['tona_news_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_news_category'] ) ) : '',
            'hierarchical'    => true,
            'depth'           => 0,
            'show_count'      => false,
            'hide_empty'      => false,
            'value_field'     => 'slug',
        )
    );
}
add_action( 'restrict_manage_posts', 'tona_cms_news_admin_category_filter' );

function tona_cms_news_admin_category_query( $query ) {
    global $pagenow;

    if ( ! is_admin() || 'edit.php' !== $pagenow || ! $query->is_main_query() || 'tona_news' !== $query->get( 'post_type' ) ) {
        return;
    }

    $category = isset( $_GET['tona_news_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_news_category'] ) ) : '';

    if ( '' === $category || '0' === $category ) {
        return;
    }

    $query->set(
        'tax_query',
        array(
            array(
                'taxonomy' => 'tona_news_category',
                'field'    => 'slug',
                'terms'    => $category,
            ),
        )
    );
}
add_action( 'pre_get_posts', 'tona_cms_news_admin_category_query' );
