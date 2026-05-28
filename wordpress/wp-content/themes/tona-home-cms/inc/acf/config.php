<?php
/**
 * ACF configuration and admin helpers.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_acf_json_save_path( $path ) {
    return get_stylesheet_directory() . '/acf-json';
}
add_filter( 'acf/settings/save_json', 'tona_cms_acf_json_save_path' );

function tona_cms_acf_json_load_paths( $paths ) {
    $paths[] = get_stylesheet_directory() . '/acf-json';
    return $paths;
}
add_filter( 'acf/settings/load_json', 'tona_cms_acf_json_load_paths' );

function tona_cms_register_options_pages() {
    if ( ! function_exists( 'acf_add_options_page' ) ) {
        return;
    }

    acf_add_options_page(
        array(
            'page_title' => 'Logo & Footer',
            'menu_title' => 'Logo & Footer',
            'menu_slug'  => 'tona-site-settings',
            'capability' => 'edit_posts',
            'redirect'   => true,
            'position'   => 58,
            'icon_url'   => 'dashicons-admin-generic',
        )
    );

    if ( function_exists( 'acf_add_options_sub_page' ) ) {
        acf_add_options_sub_page(
            array(
                'page_title'  => 'Logo & Footer Settings',
                'menu_title'  => 'Settings',
                'menu_slug'   => 'tona-site-settings-content',
                'parent_slug' => 'tona-site-settings',
                'capability'  => 'edit_posts',
                'post_id'     => 'option',
            )
        );
    }
}
add_action( 'acf/init', 'tona_cms_register_options_pages' );

function tona_cms_register_site_settings_field_group() {
    if ( ! function_exists( 'acf_add_local_field_group' ) ) {
        return;
    }

    $json_path = get_stylesheet_directory() . '/acf-json/group_tona_site_settings.json';

    if ( ! file_exists( $json_path ) || ! is_readable( $json_path ) ) {
        return;
    }

    $field_group = json_decode( file_get_contents( $json_path ), true );

    if ( ! is_array( $field_group ) || empty( $field_group['key'] ) || empty( $field_group['fields'] ) ) {
        return;
    }

    $field_group['active'] = true;
    $field_group['location'] = array(
        array(
            array(
                'param'    => 'options_page',
                'operator' => '==',
                'value'    => 'tona-site-settings-content',
            ),
        ),
        array(
            array(
                'param'    => 'options_page',
                'operator' => '==',
                'value'    => 'tona-site-settings',
            ),
        ),
    );

    acf_add_local_field_group( $field_group );
}
add_action( 'acf/init', 'tona_cms_register_site_settings_field_group', 20 );

function tona_cms_normalize_acf_field_group_location( $field_group ) {
    if ( ! is_array( $field_group ) || empty( $field_group['key'] ) ) {
        return $field_group;
    }

    $template_locations = array(
        'group_tona_home_page'     => 'templates/tona-home.php',
        'group_tona_members_page'  => 'templates/tona-members.php',
        'group_tona_about_page'    => 'templates/tona-about.php',
        'group_tona_culture_page'  => 'templates/tona-culture.php',
        'group_tona_csr_page'      => 'templates/tona-csr.php',
        'group_tona_services_page' => 'templates/tona-services.php',
        'group_tona_jobs_page'     => 'templates/tona-jobs.php',
        'group_tona_projects_page' => 'templates/tona-projects.php',
        'group_tona_news_page'     => 'templates/tona-news.php',
    );

    if ( isset( $template_locations[ $field_group['key'] ] ) ) {
        $field_group['location'] = array(
            array(
                array(
                    'param'    => 'page_template',
                    'operator' => '==',
                    'value'    => $template_locations[ $field_group['key'] ],
                ),
            ),
        );

        if ( 'group_tona_home_page' === $field_group['key'] ) {
            $field_group['location'][] = array(
                array(
                    'param'    => 'page_type',
                    'operator' => '==',
                    'value'    => 'front_page',
                ),
            );
        }

        $field_group['label_placement'] = 'top';
        $field_group['instruction_placement'] = 'field';
    }

    return $field_group;
}
add_filter( 'acf/load_field_group', 'tona_cms_normalize_acf_field_group_location', 1 );

function tona_cms_normalize_acf_field_groups_location( $field_groups ) {
    if ( ! is_array( $field_groups ) ) {
        return $field_groups;
    }

    return array_map( 'tona_cms_normalize_acf_field_group_location', $field_groups );
}
add_filter( 'acf/load_field_groups', 'tona_cms_normalize_acf_field_groups_location', 1 );

function tona_cms_acf_color_field( $key, $label, $name, $default_value, $instructions = '', $wrapper_class = '' ) {
    return array(
        'ID'              => 0,
        'key'             => $key,
        'label'           => $label,
        'name'            => $name,
        'type'            => 'color_picker',
        'value'           => null,
        'instructions'    => $instructions,
        'required'        => 0,
        'conditional_logic' => 0,
        'wrapper'         => array(
            'width' => '',
            'class' => $wrapper_class,
            'id'    => '',
        ),
        'default_value'   => $default_value,
        'enable_opacity'  => 0,
        'return_format'   => 'string',
    );
}

function tona_cms_acf_image_field( $key, $label, $name, $instructions = '' ) {
    return array(
        'ID'              => 0,
        'key'             => $key,
        'label'           => $label,
        'name'            => $name,
        'type'            => 'image',
        'value'           => null,
        'instructions'    => $instructions,
        'required'        => 0,
        'conditional_logic' => 0,
        'wrapper'         => array(
            'width' => '',
            'class' => '',
            'id'    => '',
        ),
        'return_format'   => 'array',
        'preview_size'    => 'medium',
        'library'         => 'all',
        'min_width'       => 0,
        'min_height'      => 0,
        'min_size'        => 0,
        'max_width'       => 0,
        'max_height'      => 0,
        'max_size'        => 0,
        'mime_types'      => '',
    );
}

function tona_cms_insert_acf_field_after( $fields, $after_key, $field_to_insert ) {
    foreach ( $fields as $existing_field ) {
        if ( isset( $existing_field['key'] ) && $existing_field['key'] === $field_to_insert['key'] ) {
            return $fields;
        }
    }

    foreach ( $fields as $index => $existing_field ) {
        if ( isset( $existing_field['key'] ) && $after_key === $existing_field['key'] ) {
            array_splice( $fields, $index + 1, 0, array( $field_to_insert ) );
            return $fields;
        }
    }

    $fields[] = $field_to_insert;
    return $fields;
}

function tona_cms_acf_parent_key( $parent ) {
    if ( is_array( $parent ) && isset( $parent['key'] ) ) {
        return $parent['key'];
    }

    if ( $parent instanceof WP_Post ) {
        return $parent->post_name;
    }

    if ( is_numeric( $parent ) ) {
        $parent_post = get_post( (int) $parent );
        return $parent_post ? $parent_post->post_name : '';
    }

    if ( is_string( $parent ) ) {
        return $parent;
    }

    return '';
}

function tona_cms_admin_assets( $hook_suffix ) {
    if ( ! in_array( $hook_suffix, array( 'post.php', 'post-new.php' ), true ) ) {
        return;
    }

    $screen = get_current_screen();

    if ( ! $screen || 'page' !== $screen->post_type ) {
        return;
    }

    wp_enqueue_style(
        'tona-cms-acf-admin',
        get_stylesheet_directory_uri() . '/assets/css/acf-admin.css',
        array(),
        '1.0.2'
    );

    wp_enqueue_script(
        'tona-cms-acf-admin',
        get_stylesheet_directory_uri() . '/assets/js/acf-admin.js',
        array( 'jquery' ),
        '1.0.1',
        true
    );

}
add_action( 'admin_enqueue_scripts', 'tona_cms_admin_assets' );

function tona_cms_is_page_editor_screen() {
    if ( ! is_admin() || ! function_exists( 'get_current_screen' ) ) {
        return false;
    }

    $screen = get_current_screen();

    return $screen && 'page' === $screen->post_type && in_array( $screen->base, array( 'post', 'post-new' ), true );
}


require_once get_stylesheet_directory() . '/inc/acf-fields/shared.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/icons.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/home.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/about.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/members.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/culture.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/csr.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/services.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/jobs.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/projects.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/news.php';
