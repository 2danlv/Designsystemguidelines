<?php
/**
 * Jobs post type setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_register_job_post_type() {
    register_post_type(
        'tona_job',
        array(
            'labels'       => array(
                'name'          => 'Jobs',
                'singular_name' => 'Job',
                'add_new_item'  => 'Add New Job',
                'edit_item'     => 'Edit Job',
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'menu_icon'    => 'dashicons-businessperson',
            'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
            'rewrite'      => array( 'slug' => 'jobs' ),
        )
    );

    register_taxonomy(
        'tona_job_category',
        'tona_job',
        array(
            'labels'       => array(
                'name'          => 'Job Categories',
                'singular_name' => 'Job Category',
                'add_new_item'  => 'Add New Job Category',
                'edit_item'     => 'Edit Job Category',
            ),
            'hierarchical' => true,
            'public'       => true,
            'show_ui'      => true,
            'show_in_rest' => true,
            'meta_box_cb'  => 'tona_cms_job_category_radio_meta_box',
            'rewrite'      => array( 'slug' => 'job-category' ),
        )
    );
}
add_action( 'init', 'tona_cms_register_job_post_type' );

function tona_cms_job_category_radio_meta_box( $post, $box ) {
    $taxonomy = $box['args']['taxonomy'];
    $terms = get_terms(
        array(
            'taxonomy'   => $taxonomy,
            'hide_empty' => false,
        )
    );

    if ( is_wp_error( $terms ) || empty( $terms ) ) {
        return;
    }

    $selected_terms = wp_get_object_terms( $post->ID, $taxonomy, array( 'fields' => 'ids' ) );
    $selected_term_id = ! is_wp_error( $selected_terms ) && ! empty( $selected_terms ) ? (int) $selected_terms[0] : 0;

    echo '<div id="taxonomy-' . esc_attr( $taxonomy ) . '" class="categorydiv">';
    echo '<ul class="categorychecklist form-no-clear">';

    foreach ( $terms as $term ) {
        printf(
            '<li><label class="selectit"><input type="radio" name="tax_input[%1$s][]" value="%2$d" %3$s> %4$s</label></li>',
            esc_attr( $taxonomy ),
            (int) $term->term_id,
            checked( $selected_term_id, (int) $term->term_id, false ),
            esc_html( $term->name )
        );
    }

    echo '</ul>';
    echo '<p class="description">Choose exactly one category. Use categories to control where jobs appear on the frontend.</p>';
    echo '</div>';
}

function tona_cms_job_category_single_term( $post_id ) {
    if ( wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
        return;
    }

    $terms = wp_get_object_terms( $post_id, 'tona_job_category', array( 'fields' => 'ids' ) );

    if ( is_wp_error( $terms ) ) {
        return;
    }

    if ( ! empty( $terms ) ) {
        wp_set_object_terms( $post_id, array( (int) $terms[0] ), 'tona_job_category', false );
    }
}
add_action( 'save_post_tona_job', 'tona_cms_job_category_single_term', 20 );

function tona_cms_job_admin_columns( $columns ) {
    $date_column = isset( $columns['date'] ) ? $columns['date'] : null;
    unset( $columns['date'] );
    $columns['tona_job_category'] = 'Category';

    if ( null !== $date_column ) {
        $columns['date'] = $date_column;
    }

    return $columns;
}
add_filter( 'manage_tona_job_posts_columns', 'tona_cms_job_admin_columns' );

function tona_cms_job_admin_column_content( $column, $post_id ) {
    if ( 'tona_job_category' !== $column ) {
        return;
    }

    $terms = get_the_terms( $post_id, 'tona_job_category' );
    echo is_wp_error( $terms ) || empty( $terms ) ? '&mdash;' : esc_html( implode( ', ', wp_list_pluck( $terms, 'name' ) ) );
}
add_action( 'manage_tona_job_posts_custom_column', 'tona_cms_job_admin_column_content', 10, 2 );

function tona_cms_job_admin_category_filter() {
    $screen = get_current_screen();

    if ( ! $screen || 'edit-tona_job' !== $screen->id ) {
        return;
    }

    wp_dropdown_categories(
        array(
            'show_option_all' => 'All Job Categories',
            'taxonomy'        => 'tona_job_category',
            'name'            => 'tona_job_category',
            'orderby'         => 'name',
            'selected'        => isset( $_GET['tona_job_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_job_category'] ) ) : '',
            'hierarchical'    => true,
            'depth'           => 0,
            'show_count'      => false,
            'hide_empty'      => false,
            'value_field'     => 'slug',
        )
    );
}
add_action( 'restrict_manage_posts', 'tona_cms_job_admin_category_filter' );

function tona_cms_job_admin_category_query( $query ) {
    global $pagenow;

    if ( ! is_admin() || 'edit.php' !== $pagenow || ! $query->is_main_query() || 'tona_job' !== $query->get( 'post_type' ) ) {
        return;
    }

    $category = isset( $_GET['tona_job_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_job_category'] ) ) : '';

    if ( '' === $category || '0' === $category ) {
        return;
    }

    $query->set(
        'tax_query',
        array(
            array(
                'taxonomy' => 'tona_job_category',
                'field'    => 'slug',
                'terms'    => $category,
            ),
        )
    );
}
add_action( 'pre_get_posts', 'tona_cms_job_admin_category_query' );
