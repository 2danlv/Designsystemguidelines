<?php
/**
 * Tona headless CMS setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'tona_cms_theme_setup' );

require_once get_stylesheet_directory() . '/inc/post-types/jobs.php';
require_once get_stylesheet_directory() . '/inc/post-types/members.php';
require_once get_stylesheet_directory() . '/inc/post-types/projects.php';
require_once get_stylesheet_directory() . '/inc/post-types/news.php';

function tona_cms_acf_json_save_path( $path ) {
    return get_stylesheet_directory() . '/acf-json';
}
add_filter( 'acf/settings/save_json', 'tona_cms_acf_json_save_path' );

function tona_cms_acf_json_load_paths( $paths ) {
    $paths[] = get_stylesheet_directory() . '/acf-json';
    return $paths;
}
add_filter( 'acf/settings/load_json', 'tona_cms_acf_json_load_paths' );

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
require_once get_stylesheet_directory() . '/inc/acf-fields/home.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/about.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/members.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/culture.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/csr.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/services.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/jobs.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/projects.php';
require_once get_stylesheet_directory() . '/inc/acf-fields/news.php';

function tona_cms_image_url( $image ) {
    if ( is_array( $image ) && ! empty( $image['url'] ) ) {
        return esc_url_raw( $image['url'] );
    }

    if ( is_numeric( $image ) ) {
        $url = wp_get_attachment_image_url( (int) $image, 'large' );
        return $url ? esc_url_raw( $url ) : '';
    }

    return is_string( $image ) ? esc_url_raw( $image ) : '';
}

function tona_cms_decode_text( $value ) {
    if ( ! is_string( $value ) ) {
        return '';
    }

    return html_entity_decode( wp_specialchars_decode( $value, ENT_QUOTES ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
}

function tona_cms_text_field( $post_id, $field_name ) {
    $value = function_exists( 'get_field' ) ? get_field( $field_name, $post_id ) : '';
    return tona_cms_decode_text( $value );
}

function tona_cms_group_text_field( $post_id, $group_names, $field_name, $fallback_field_name = '' ) {
    if ( ! function_exists( 'get_field' ) ) {
        return '';
    }

    foreach ( (array) $group_names as $group_name ) {
        $group = get_field( $group_name, $post_id );

        if ( is_array( $group ) && isset( $group[ $field_name ] ) && is_string( $group[ $field_name ] ) ) {
            return $group[ $field_name ];
        }
    }

    return $fallback_field_name ? tona_cms_text_field( $post_id, $fallback_field_name ) : '';
}

function tona_cms_lines_field( $post_id, $field_name ) {
    $value = tona_cms_text_field( $post_id, $field_name );

    if ( '' === trim( $value ) ) {
        return array();
    }

    $lines = preg_split( '/\r\n|\r|\n/', $value );

    return array_values(
        array_filter(
            array_map( 'trim', is_array( $lines ) ? $lines : array() )
        )
    );
}

function tona_cms_repeater_lines_field( $post_id, $field_name, $sub_field_name, $fallback_field_name = '' ) {
    $rows = function_exists( 'get_field' ) ? get_field( $field_name, $post_id ) : array();

    if ( is_array( $rows ) ) {
        $items = array_values(
            array_filter(
                array_map(
                    function ( $row ) use ( $sub_field_name ) {
                        return is_array( $row ) ? trim( $row[ $sub_field_name ] ?? '' ) : '';
                    },
                    $rows
                )
            )
        );

        if ( ! empty( $items ) ) {
            return $items;
        }
    }

    if ( $fallback_field_name ) {
        $fallback_items = tona_cms_lines_field( $post_id, $fallback_field_name );

        if ( ! empty( $fallback_items ) ) {
            return $fallback_items;
        }

        $raw_value = get_post_meta( $post_id, $fallback_field_name, true );

        if ( is_string( $raw_value ) && '' !== trim( $raw_value ) ) {
            $lines = preg_split( '/\r\n|\r|\n/', $raw_value );

            return array_values(
                array_filter(
                    array_map( 'trim', is_array( $lines ) ? $lines : array() )
                )
            );
        }
    }

    return array();
}

function tona_cms_get_page_by_slug( $slug ) {
    $path = implode(
        '/',
        array_filter(
            array_map(
                'sanitize_title',
                explode( '/', trim( (string) $slug, '/' ) )
            )
        )
    );

    $page = get_page_by_path( $path, OBJECT, 'page' );

    if ( ! $page || 'publish' !== $page->post_status ) {
        return null;
    }

    return $page;
}

function tona_cms_get_page_by_post_name( $post_name ) {
    $pages = get_posts(
        array(
            'post_type'      => 'page',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'name'           => sanitize_title( $post_name ),
        )
    );

    return ! empty( $pages[0] ) ? $pages[0] : null;
}

function tona_cms_get_page_by_template( $template_alias ) {
    $template_map = array(
        'tona-home'     => 'templates/tona-home.php',
        'tona-members'  => 'templates/tona-members.php',
        'tona-about'    => 'templates/tona-about.php',
        'tona-culture'  => 'templates/tona-culture.php',
        'tona-csr'      => 'templates/tona-csr.php',
        'tona-services' => 'templates/tona-services.php',
        'tona-jobs'     => 'templates/tona-jobs.php',
        'tona-projects' => 'templates/tona-projects.php',
        'tona-news'     => 'templates/tona-news.php',
    );

    $template_alias = sanitize_key( $template_alias );

    if ( empty( $template_map[ $template_alias ] ) ) {
        return null;
    }

    if ( 'tona-home' === $template_alias ) {
        $front_page_id = (int) get_option( 'page_on_front' );

        if ( $front_page_id ) {
            $front_page = get_post( $front_page_id );

            if ( $front_page && 'page' === $front_page->post_type && 'publish' === $front_page->post_status ) {
                return $front_page;
            }
        }
    }

    $pages = get_posts(
        array(
            'post_type'      => 'page',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'orderby'        => 'menu_order title',
            'order'          => 'ASC',
            'meta_key'       => '_wp_page_template',
            'meta_value'     => $template_map[ $template_alias ],
        )
    );

    if ( ! empty( $pages[0] ) ) {
        return $pages[0];
    }

    $fallback_post_names = array(
        'tona-home'     => 'trang-chu',
        'tona-members'  => 'doi-ngu',
        'tona-about'    => 'gioi-thieu-tona',
        'tona-culture'  => 'cuoc-song-tona',
        'tona-csr'      => 'trach-nhiem-cong-dong',
        'tona-services' => 'dich-vu',
        'tona-jobs'     => 'nghe-nghiep',
        'tona-projects' => 'du-an-tona',
        'tona-news'     => 'tin-tuc',
    );

    return isset( $fallback_post_names[ $template_alias ] )
        ? tona_cms_get_page_by_post_name( $fallback_post_names[ $template_alias ] )
        : null;
}

function tona_cms_page_payload( $page ) {
    $template = get_page_template_slug( $page );
    $front_page_id = (int) get_option( 'page_on_front' );

    if ( 'templates/tona-home.php' === $template || 'trang-chu' === $page->post_name || ( $front_page_id && (int) $page->ID === $front_page_id ) ) {
        return tona_cms_home_payload( $page );
    }

    if ( 'templates/tona-members.php' === $template || 'doi-ngu' === $page->post_name ) {
        return tona_cms_members_payload( $page );
    }

    if ( 'templates/tona-about.php' === $template || 'gioi-thieu-tona' === $page->post_name ) {
        return tona_cms_about_payload( $page );
    }

    if ( 'templates/tona-culture.php' === $template || 'cuoc-song-tona' === $page->post_name ) {
        return tona_cms_culture_payload( $page );
    }

    if ( 'templates/tona-csr.php' === $template || 'trach-nhiem-cong-dong' === $page->post_name ) {
        return tona_cms_csr_payload( $page );
    }

    if ( 'templates/tona-services.php' === $template || 'dich-vu' === $page->post_name ) {
        return tona_cms_services_payload( $page );
    }

    if ( 'templates/tona-jobs.php' === $template || 'nghe-nghiep' === $page->post_name ) {
        return tona_cms_jobs_page_payload( $page );
    }

    if ( 'templates/tona-projects.php' === $template || 'du-an-tona' === $page->post_name ) {
        return tona_cms_projects_page_payload( $page );
    }

    if ( 'templates/tona-news.php' === $template || 'tin-tuc' === $page->post_name ) {
        return tona_cms_news_page_payload( $page );
    }

    return array(
        'id'      => $page->ID,
        'slug'    => $page->post_name,
        'title'   => get_the_title( $page ),
        'content' => apply_filters( 'the_content', $page->post_content ),
    );
}

function tona_cms_home_payload( $page ) {
    $post_id = $page->ID;
    $marquee_items = function_exists( 'get_field' ) ? get_field( 'home_marquee_items', $post_id ) : array();
    $stats = function_exists( 'get_field' ) ? get_field( 'home_slogan_stats', $post_id ) : array();
    $partners = function_exists( 'get_field' ) ? get_field( 'home_partner_logos', $post_id ) : array();

    return array(
        'id'      => $post_id,
        'slug'    => $page->post_name,
        'title'   => get_the_title( $page ),
        'hero'    => array(
            'primaryLabel'   => tona_cms_text_field( $post_id, 'home_hero_primary_label' ),
            'primaryUrl'     => tona_cms_text_field( $post_id, 'home_hero_primary_url' ),
            'secondaryLabel' => tona_cms_text_field( $post_id, 'home_hero_secondary_label' ),
            'secondaryUrl'   => tona_cms_text_field( $post_id, 'home_hero_secondary_url' ),
        ),
        'marquee' => array(
            'items' => array_values(
                array_filter(
                    array_map(
                        function ( $item ) {
                            return is_array( $item ) ? trim( $item['text'] ?? '' ) : '';
                        },
                        is_array( $marquee_items ) ? $marquee_items : array()
                    )
                )
            ),
        ),
        'slogan'  => array(
            'eyebrow'     => tona_cms_text_field( $post_id, 'home_slogan_eyebrow' ),
            'title'       => tona_cms_text_field( $post_id, 'home_slogan_title' ),
            'accentTitle' => tona_cms_text_field( $post_id, 'home_slogan_accent_title' ),
            'description' => tona_cms_text_field( $post_id, 'home_slogan_description' ),
            'stats'       => array_values(
                array_map(
                    function ( $stat ) {
                        return array(
                            'value' => $stat['value'] ?? '',
                            'label' => $stat['label'] ?? '',
                        );
                    },
                    is_array( $stats ) ? $stats : array()
                )
            ),
        ),
        'sections' => array(
            'servicesTitle' => tona_cms_text_field( $post_id, 'home_services_title' ),
            'projectsLabel' => tona_cms_text_field( $post_id, 'home_projects_label' ),
            'projectsTitle' => tona_cms_text_field( $post_id, 'home_projects_title' ),
            'newsTitle'     => tona_cms_text_field( $post_id, 'home_news_title' ),
        ),
        'partners' => array(
            'title'       => tona_cms_text_field( $post_id, 'home_partners_title' ),
            'description' => tona_cms_text_field( $post_id, 'home_partners_description' ),
            'logos'       => array_values(
                array_filter(
                    array_map(
                        function ( $partner ) {
                            return tona_cms_image_url( $partner['logo'] ?? '' );
                        },
                        is_array( $partners ) ? $partners : array()
                    )
                )
            ),
        ),
    );
}

function tona_cms_members_payload( $page ) {
    $post_id = $page->ID;
    $values = function_exists( 'get_field' ) ? get_field( 'members_values', $post_id ) : array();

    return array(
        'id'        => $post_id,
        'slug'      => $page->post_name,
        'title'     => get_the_title( $page ),
        'hero'      => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'members_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'members_hero_description' ),
        ),
        'valuesTitle' => tona_cms_text_field( $post_id, 'members_values_title' ),
        'values'      => array_values(
            array_map(
                function ( $value ) {
                    return array(
                        'icon'      => $value['icon'] ?? 'Shield',
                        'iconImage' => tona_cms_image_url( $value['icon_image'] ?? '' ),
                        'title'     => $value['title'] ?? '',
                        'desc'      => $value['description'] ?? '',
                    );
                },
                is_array( $values ) ? $values : array()
            )
        ),
        'teaser'     => array(
            'title'       => tona_cms_text_field( $post_id, 'members_teaser_title' ),
            'description' => tona_cms_text_field( $post_id, 'members_teaser_description' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'members_teaser_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'members_teaser_link_url' ),
        ),
    );
}

function tona_cms_member_repeater_items( $post_id, $field_name ) {
    $rows = function_exists( 'get_field' ) ? get_field( $field_name, $post_id ) : array();

    if ( ! is_array( $rows ) ) {
        return array();
    }

    return array_values(
        array_filter(
            array_map(
                function ( $row ) {
                    return is_array( $row ) ? trim( $row['item'] ?? '' ) : '';
                },
                $rows
            )
        )
    );
}

function tona_cms_member_payload( $post ) {
    $post_id = $post->ID;

    return array(
        'id'           => $post_id,
        'slug'         => $post->post_name,
        'name'         => get_the_title( $post ),
        'role'         => tona_cms_text_field( $post_id, 'member_role' ),
        'roleEn'       => tona_cms_text_field( $post_id, 'member_role_en' ),
        'image'        => get_the_post_thumbnail_url( $post_id, 'large' ) ?: '',
        'bio'          => tona_cms_decode_text( wp_strip_all_tags( get_the_content( null, false, $post ) ) ),
        'linkedin'     => tona_cms_text_field( $post_id, 'member_linkedin' ) ?: '#',
        'education'    => tona_cms_text_field( $post_id, 'member_education' ),
        'since'        => tona_cms_text_field( $post_id, 'member_since' ),
        'expertise'    => tona_cms_member_repeater_items( $post_id, 'member_expertise' ),
        'achievements' => tona_cms_member_repeater_items( $post_id, 'member_achievements' ),
        'quote'        => tona_cms_text_field( $post_id, 'member_quote' ),
    );
}

function tona_cms_members_list_payload() {
    $posts = get_posts(
        array(
            'post_type'      => 'tona_member',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => array(
                'menu_order' => 'ASC',
                'date'       => 'DESC',
            ),
        )
    );

    return array_values(
        array_map( 'tona_cms_member_payload', is_array( $posts ) ? $posts : array() )
    );
}

function tona_cms_about_payload( $page ) {
    $post_id = $page->ID;
    $hero_stats_group = function_exists( 'get_field' ) ? get_field( 'about_hero_stats_right', $post_id ) : array();
    $legacy_hero_stats_group = function_exists( 'get_field' ) ? get_field( 'kv_right', $post_id ) : array();
    $stats = is_array( $hero_stats_group ) && isset( $hero_stats_group['about_stats'] ) ? $hero_stats_group['about_stats'] : array();

    if ( empty( $stats ) && is_array( $legacy_hero_stats_group ) && isset( $legacy_hero_stats_group['about_stats'] ) ) {
        $stats = $legacy_hero_stats_group['about_stats'];
    }

    if ( empty( $stats ) && function_exists( 'get_field' ) ) {
        $stats = get_field( 'about_stats', $post_id );
    }

    $values = function_exists( 'get_field' ) ? get_field( 'about_values', $post_id ) : array();
    $timeline = function_exists( 'get_field' ) ? get_field( 'about_timeline', $post_id ) : array();
    $certifications = function_exists( 'get_field' ) ? get_field( 'about_certifications', $post_id ) : array();

    return array(
        'id'        => $post_id,
        'slug'      => $page->post_name,
        'title'     => get_the_title( $page ),
        'colors'    => array(
            'heroBackground'           => tona_cms_text_field( $post_id, 'about_hero_background' ),
            'valuesBackground'         => tona_cms_text_field( $post_id, 'about_values_background' ),
            'timelineBackground'       => tona_cms_text_field( $post_id, 'about_timeline_background' ),
            'certificationsBackground' => tona_cms_text_field( $post_id, 'about_certifications_background' ),
            'ctaBackground'            => tona_cms_text_field( $post_id, 'about_cta_background' ),
        ),
        'hero'      => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_group_text_field( $post_id, array( 'about_hero_intro_left', 'kv_left' ), 'about_hero_title', 'about_hero_title' ),
            'description'     => tona_cms_group_text_field( $post_id, array( 'about_hero_intro_left', 'kv_left' ), 'about_hero_description', 'about_hero_description' ),
        ),
        'stats'     => array_values(
            array_map(
                function ( $stat ) {
                    return array(
                        'value' => $stat['value'] ?? '',
                        'label' => $stat['label'] ?? '',
                    );
                },
                is_array( $stats ) ? $stats : array()
            )
        ),
        'missionVision' => array(
            'backgroundImage' => tona_cms_image_url( function_exists( 'get_field' ) ? get_field( 'about_mission_background_image', $post_id ) : '' ),
            'missionEyebrow' => tona_cms_text_field( $post_id, 'about_mission_eyebrow' ),
            'missionText'    => tona_cms_text_field( $post_id, 'about_mission_text' ),
            'visionEyebrow'  => tona_cms_text_field( $post_id, 'about_vision_eyebrow' ),
            'visionText'     => tona_cms_text_field( $post_id, 'about_vision_text' ),
        ),
        'valuesTitle' => tona_cms_text_field( $post_id, 'about_values_title' ),
        'values'      => array_values(
            array_map(
                function ( $value ) {
                    return array(
                        'icon'      => $value['icon'] ?? 'Shield',
                        'iconImage' => tona_cms_image_url( $value['icon_image'] ?? '' ),
                        'title'     => $value['title'] ?? '',
                        'desc'      => $value['description'] ?? '',
                    );
                },
                is_array( $values ) ? $values : array()
            )
        ),
        'timelineTitle' => tona_cms_text_field( $post_id, 'about_timeline_title' ),
        'timeline'      => array_values(
            array_map(
                function ( $item ) {
                    return array(
                        'year'  => $item['year'] ?? '',
                        'title' => $item['title'] ?? '',
                        'desc'  => $item['description'] ?? '',
                    );
                },
                is_array( $timeline ) ? $timeline : array()
            )
        ),
        'certificationsTitle' => tona_cms_text_field( $post_id, 'about_certifications_title' ),
        'certifications'      => array_values(
            array_map(
                function ( $certification ) {
                    return array(
                        'code'  => $certification['code'] ?? '',
                        'title' => $certification['title'] ?? '',
                        'org'   => $certification['org'] ?? '',
                    );
                },
                is_array( $certifications ) ? $certifications : array()
            )
        ),
        'cta' => array(
            'title'          => tona_cms_text_field( $post_id, 'about_cta_title' ),
            'description'    => tona_cms_text_field( $post_id, 'about_cta_description' ),
            'primaryLabel'   => tona_cms_text_field( $post_id, 'about_cta_primary_label' ),
            'primaryUrl'     => tona_cms_text_field( $post_id, 'about_cta_primary_url' ),
            'secondaryLabel' => tona_cms_text_field( $post_id, 'about_cta_secondary_label' ),
            'secondaryUrl'   => tona_cms_text_field( $post_id, 'about_cta_secondary_url' ),
        ),
    );
}

function tona_cms_culture_payload( $page ) {
    $post_id = $page->ID;
    $stats = function_exists( 'get_field' ) ? get_field( 'culture_stats', $post_id ) : array();
    $themes = function_exists( 'get_field' ) ? get_field( 'culture_yearly_themes', $post_id ) : array();
    $activities = function_exists( 'get_field' ) ? get_field( 'culture_activities', $post_id ) : array();
    $academy_stats = function_exists( 'get_field' ) ? get_field( 'culture_academy_stats', $post_id ) : array();
    $gallery = function_exists( 'get_field' ) ? get_field( 'culture_gallery_photos', $post_id ) : array();

    return array(
        'id'     => $post_id,
        'slug'   => $page->post_name,
        'title'  => get_the_title( $page ),
        'colors' => array(
            'heroBackground'       => tona_cms_text_field( $post_id, 'culture_hero_background' ),
            'statsBackground'      => tona_cms_text_field( $post_id, 'culture_stats_background' ),
            'themesBackground'     => tona_cms_text_field( $post_id, 'culture_themes_background' ),
            'activitiesBackground' => tona_cms_text_field( $post_id, 'culture_activities_background' ),
            'academyBackground'    => tona_cms_text_field( $post_id, 'culture_academy_background' ),
            'galleryBackground'    => tona_cms_text_field( $post_id, 'culture_gallery_background' ),
            'ctaBackground'        => tona_cms_text_field( $post_id, 'culture_cta_background' ),
        ),
        'hero'   => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'culture_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'culture_hero_description' ),
            'decorativeText'  => tona_cms_text_field( $post_id, 'culture_hero_decorative_text' ),
        ),
        'stats'  => array_values(
            array_map(
                function ( $stat ) {
                    return array(
                        'value' => $stat['value'] ?? '',
                        'label' => $stat['label'] ?? '',
                    );
                },
                is_array( $stats ) ? $stats : array()
            )
        ),
        'themesTitle'       => tona_cms_text_field( $post_id, 'culture_themes_title' ),
        'themesDescription' => tona_cms_text_field( $post_id, 'culture_themes_description' ),
        'yearlyThemes'      => array_values(
            array_map(
                function ( $theme, $theme_index ) {
                    $theme_year = trim( (string) ( $theme['year'] ?? '' ) );

                    return array(
                        'year'        => $theme_year,
                        'theme'       => $theme['theme'] ?? '',
                        'color'       => $theme['color'] ?? '',
                        'description' => $theme['description'] ?? '',
                        'milestones'  => array_values(
                            array_filter(
                                array_map(
                                    'trim',
                                    preg_split( '/\r\n|\r|\n/', $theme['milestones'] ?? '' )
                                )
                            )
                        ),
                        'active'      => 0 === $theme_index,
                    );
                },
                is_array( $themes ) ? $themes : array(),
                array_keys( is_array( $themes ) ? $themes : array() )
            )
        ),
        'activitiesTitle' => tona_cms_text_field( $post_id, 'culture_activities_title' ),
        'activities'      => array_values(
            array_map(
                function ( $activity ) {
                    return array(
                        'icon'        => $activity['icon'] ?? 'Heart',
                        'iconImage'   => tona_cms_image_url( $activity['icon_image'] ?? '' ),
                        'title'       => $activity['title'] ?? '',
                        'subtitle'    => $activity['subtitle'] ?? '',
                        'description' => $activity['description'] ?? '',
                        'image'       => tona_cms_image_url( $activity['image'] ?? '' ),
                        'color'       => $activity['color'] ?? '',
                    );
                },
                is_array( $activities ) ? $activities : array()
            )
        ),
        'academy' => array(
            'eyebrow'     => tona_cms_text_field( $post_id, 'culture_academy_eyebrow' ),
            'title'       => tona_cms_text_field( $post_id, 'culture_academy_title' ),
            'description' => tona_cms_text_field( $post_id, 'culture_academy_description' ),
            'image'       => tona_cms_image_url( function_exists( 'get_field' ) ? get_field( 'culture_academy_image', $post_id ) : '' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'culture_academy_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'culture_academy_link_url' ),
            'stats'       => array_values(
                array_map(
                    function ( $stat ) {
                        return array(
                            'value' => $stat['value'] ?? '',
                            'label' => $stat['label'] ?? '',
                        );
                    },
                    is_array( $academy_stats ) ? $academy_stats : array()
                )
            ),
        ),
        'gallery' => array(
            'title'  => tona_cms_text_field( $post_id, 'culture_gallery_title' ),
            'photos' => array_values(
                array_filter(
                    array_map(
                        function ( $photo ) {
                            return tona_cms_image_url( $photo['image'] ?? '' );
                        },
                        is_array( $gallery ) ? $gallery : array()
                    )
                )
            ),
        ),
        'cta' => array(
            'title'       => tona_cms_text_field( $post_id, 'culture_cta_title' ),
            'description' => tona_cms_text_field( $post_id, 'culture_cta_description' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'culture_cta_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'culture_cta_link_url' ),
        ),
    );
}

function tona_cms_csr_payload( $page ) {
    $post_id = $page->ID;
    $impact = function_exists( 'get_field' ) ? get_field( 'csr_impact', $post_id ) : array();
    $programs = function_exists( 'get_field' ) ? get_field( 'csr_programs', $post_id ) : array();
    $commitment_items = function_exists( 'get_field' ) ? get_field( 'csr_commitment_items', $post_id ) : array();

    return array(
        'id'     => $post_id,
        'slug'   => $page->post_name,
        'title'  => get_the_title( $page ),
        'colors' => array(
            'heroBackground'       => tona_cms_text_field( $post_id, 'csr_hero_background' ),
            'programsBackground'   => tona_cms_text_field( $post_id, 'csr_programs_background' ),
            'commitmentBackground' => tona_cms_text_field( $post_id, 'csr_commitment_background' ),
            'ctaBackground'        => tona_cms_text_field( $post_id, 'csr_cta_background' ),
        ),
        'hero'   => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'csr_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'csr_hero_description' ),
            'decorativeText'  => tona_cms_text_field( $post_id, 'csr_hero_decorative_text' ),
        ),
        'impact' => array_values(
            array_map(
                function ( $item ) {
                    return array(
                        'icon'  => $item['icon'] ?? 'Handshake',
                        'value' => $item['value'] ?? '',
                        'label' => $item['label'] ?? '',
                    );
                },
                is_array( $impact ) ? $impact : array()
            )
        ),
        'programsSection' => array(
            'title'       => tona_cms_text_field( $post_id, 'csr_programs_title' ),
            'description' => tona_cms_text_field( $post_id, 'csr_programs_description' ),
        ),
        'programs' => array_values(
            array_map(
                function ( $program ) {
                    return array(
                        'id'          => sanitize_title( $program['title'] ?? '' ),
                        'icon'        => $program['icon'] ?? 'Heart',
                        'color'       => $program['color'] ?? '',
                        'bgColor'     => $program['bg_color'] ?? '',
                        'tag'         => $program['tag'] ?? '',
                        'title'       => $program['title'] ?? '',
                        'subtitle'    => $program['subtitle'] ?? '',
                        'description' => $program['description'] ?? '',
                        'image'       => tona_cms_image_url( $program['image'] ?? '' ),
                        'stats'       => array_values(
                            array_map(
                                function ( $stat ) {
                                    return array(
                                        'value' => $stat['value'] ?? '',
                                        'label' => $stat['label'] ?? '',
                                    );
                                },
                                is_array( $program['stats'] ?? null ) ? $program['stats'] : array()
                            )
                        ),
                        'highlights'  => array_values(
                            array_filter(
                                array_map(
                                    function ( $highlight ) {
                                        return is_array( $highlight ) ? trim( $highlight['item'] ?? '' ) : '';
                                    },
                                    is_array( $program['highlights'] ?? null ) ? $program['highlights'] : array()
                                )
                            )
                        ),
                    );
                },
                is_array( $programs ) ? $programs : array()
            )
        ),
        'commitment' => array(
            'title'       => tona_cms_text_field( $post_id, 'csr_commitment_title' ),
            'description' => tona_cms_text_field( $post_id, 'csr_commitment_description' ),
            'items'       => array_values(
                array_map(
                    function ( $item ) {
                        return array(
                            'title' => $item['title'] ?? '',
                            'desc'  => $item['description'] ?? '',
                        );
                    },
                    is_array( $commitment_items ) ? $commitment_items : array()
                )
            ),
        ),
        'cta' => array(
            'title'          => tona_cms_text_field( $post_id, 'csr_cta_title' ),
            'description'    => tona_cms_text_field( $post_id, 'csr_cta_description' ),
            'primaryLabel'   => tona_cms_text_field( $post_id, 'csr_cta_primary_label' ),
            'primaryUrl'     => tona_cms_text_field( $post_id, 'csr_cta_primary_url' ),
            'secondaryLabel' => tona_cms_text_field( $post_id, 'csr_cta_secondary_label' ),
            'secondaryUrl'   => tona_cms_text_field( $post_id, 'csr_cta_secondary_url' ),
        ),
    );
}

function tona_cms_services_payload( $page ) {
    $post_id = $page->ID;
    $services = function_exists( 'get_field' ) ? get_field( 'services_items', $post_id ) : array();
    $process_steps = function_exists( 'get_field' ) ? get_field( 'services_process_steps', $post_id ) : array();
    $timelapse_slides = function_exists( 'get_field' ) ? get_field( 'services_timelapse_slides', $post_id ) : array();

    return array(
        'id'     => $post_id,
        'slug'   => $page->post_name,
        'title'  => get_the_title( $page ),
        'colors' => array(
            'heroBackground'     => tona_cms_text_field( $post_id, 'services_hero_background' ),
            'servicesBackground' => tona_cms_text_field( $post_id, 'services_services_background' ),
            'processBackground'  => tona_cms_text_field( $post_id, 'services_process_background' ),
            'timelapseBackground' => tona_cms_text_field( $post_id, 'services_timelapse_background' ),
            'ctaBackground'      => tona_cms_text_field( $post_id, 'services_cta_background' ),
        ),
        'hero'   => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'services_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'services_hero_description' ),
        ),
        'services' => array_values(
            array_map(
                function ( $service, $index ) use ( $services ) {
                    $features = preg_split( '/\r\n|\r|\n/', $service['features'] ?? '' );
                    $featured_index = null;

                    foreach ( is_array( $services ) ? $services : array() as $service_index => $service_item ) {
                        if ( ! empty( $service_item['featured'] ) ) {
                            $featured_index = $service_index;
                            break;
                        }
                    }

                    $is_featured = null !== $featured_index ? $index === $featured_index : false;

                    return array(
                        'icon'        => $service['icon'] ?? 'Wrench',
                        'iconImage'   => tona_cms_image_url( $service['icon_image'] ?? '' ),
                        'number'      => $service['number'] ?? '',
                        'tag'         => $is_featured ? "Th\u{1EBF} M\u{1EA1}nh H\u{00E0}ng \u{0110}\u{1EA7}u" : '',
                        'title'       => $service['title'] ?? '',
                        'subtitle'    => $service['subtitle'] ?? '',
                        'description' => $service['description'] ?? '',
                        'features'    => array_values(
                            array_filter(
                                array_map( 'trim', is_array( $features ) ? $features : array() )
                            )
                        ),
                        'image'       => tona_cms_image_url( $service['image'] ?? '' ),
                        'featured'    => $is_featured,
                        'linkLabel'   => $service['link_label'] ?? '',
                        'linkUrl'     => $service['link_url'] ?? '',
                    );
                },
                is_array( $services ) ? $services : array(),
                array_keys( is_array( $services ) ? $services : array() )
            )
        ),
        'process' => array(
            'title' => tona_cms_text_field( $post_id, 'services_process_title' ),
            'steps' => array_values(
                array_map(
                    function ( $step ) {
                        return array(
                            'step'        => $step['step'] ?? '',
                            'title'       => $step['title'] ?? '',
                            'description' => $step['description'] ?? '',
                        );
                    },
                    is_array( $process_steps ) ? $process_steps : array()
                )
            ),
        ),
        'timelapse' => array(
            'title'       => tona_cms_text_field( $post_id, 'services_timelapse_title' ),
            'description' => tona_cms_text_field( $post_id, 'services_timelapse_description' ),
            'slides'      => array_values(
                array_map(
                    function ( $slide ) {
                        return array(
                            'title'    => $slide['title'] ?? '',
                            'subtitle' => $slide['subtitle'] ?? '',
                            'duration' => $slide['duration'] ?? '',
                            'image'    => tona_cms_image_url( $slide['image'] ?? '' ),
                        );
                    },
                    is_array( $timelapse_slides ) ? $timelapse_slides : array()
                )
            ),
        ),
        'cta' => array(
            'title'       => tona_cms_text_field( $post_id, 'services_cta_title' ),
            'description' => tona_cms_text_field( $post_id, 'services_cta_description' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'services_cta_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'services_cta_link_url' ),
        ),
    );
}

function tona_cms_job_payload( $post ) {
    $post_id = $post->ID;
    $terms = get_the_terms( $post_id, 'tona_job_category' );
    $terms = is_array( $terms ) ? $terms : array();
    $summary_rows = function_exists( 'get_field' ) ? get_field( 'job_summary', $post_id ) : array();
    $summary = array();

    if ( is_array( $summary_rows ) && ! empty( $summary_rows ) ) {
        if ( isset( $summary_rows[0]['field'], $summary_rows[0]['value'] ) ) {
            foreach ( $summary_rows as $summary_row ) {
                if ( ! is_array( $summary_row ) || empty( $summary_row['field'] ) ) {
                    continue;
                }

                $summary[ $summary_row['field'] ] = $summary_row['value'] ?? '';
            }
        } elseif ( is_array( $summary_rows[0] ) ) {
            $summary = $summary_rows[0];
        }
    }

    $slots = $summary['slots'] ?? ( function_exists( 'get_field' ) ? get_field( 'job_slots', $post_id ) : 1 );

    return array(
        'id'           => $post_id,
        'slug'         => $post->post_name,
        'title'        => get_the_title( $post ),
        'categories'   => array_values(
            array_map(
                function ( $term ) {
                    return array(
                        'id'   => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                    );
                },
                $terms
            )
        ),
        'categorySlugs' => array_values( wp_list_pluck( $terms, 'slug' ) ),
        'department'   => $summary['department'] ?? tona_cms_text_field( $post_id, 'job_department' ),
        'location'     => $summary['location'] ?? tona_cms_text_field( $post_id, 'job_location' ),
        'type'         => $summary['type'] ?? tona_cms_text_field( $post_id, 'job_type' ),
        'level'        => $summary['level'] ?? tona_cms_text_field( $post_id, 'job_level' ),
        'date'         => $summary['date'] ?? tona_cms_text_field( $post_id, 'job_date' ),
        'salary'       => $summary['salary'] ?? tona_cms_text_field( $post_id, 'job_salary' ),
        'slots'        => (int) ( $slots ?: 1 ),
        'description'  => tona_cms_text_field( $post_id, 'job_description' ) ?: wp_strip_all_tags( get_the_content( null, false, $post ) ),
        'requirements' => tona_cms_lines_field( $post_id, 'job_requirements' ),
        'skills'       => tona_cms_lines_field( $post_id, 'job_skills' ),
        'benefits'     => tona_cms_lines_field( $post_id, 'job_benefits' ),
    );
}

function tona_cms_jobs_payload() {
    $jobs = get_posts(
        array(
            'post_type'      => 'tona_job',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => array(
                'menu_order' => 'ASC',
                'date'       => 'DESC',
            ),
        )
    );

    return array_values(
        array_map( 'tona_cms_job_payload', is_array( $jobs ) ? $jobs : array() )
    );
}

function tona_cms_jobs_page_payload( $page ) {
    $post_id = $page->ID;
    $perks = function_exists( 'get_field' ) ? get_field( 'jobs_perks', $post_id ) : array();

    return array(
        'id'     => $post_id,
        'slug'   => $page->post_name,
        'title'  => get_the_title( $page ),
        'colors' => array(
            'heroBackground'    => tona_cms_text_field( $post_id, 'jobs_hero_background' ),
            'perksBackground'   => tona_cms_text_field( $post_id, 'jobs_perks_background' ),
            'internsBackground' => tona_cms_text_field( $post_id, 'jobs_interns_background' ),
            'cultureBackground' => tona_cms_text_field( $post_id, 'jobs_culture_background' ),
        ),
        'hero'   => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'jobs_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'jobs_hero_description' ),
            'decorativeText'  => tona_cms_text_field( $post_id, 'jobs_hero_decorative_text' ),
        ),
        'perksEyebrow' => tona_cms_text_field( $post_id, 'jobs_perks_eyebrow' ),
        'perks'        => array_values(
            array_map(
                function ( $perk ) {
                    return array(
                        'icon'      => $perk['icon'] ?? 'TrendingUp',
                        'iconImage' => tona_cms_image_url( $perk['icon_image'] ?? '' ),
                        'title'     => $perk['title'] ?? '',
                        'desc'      => $perk['description'] ?? '',
                    );
                },
                is_array( $perks ) ? $perks : array()
            )
        ),
        'jobsTitle'     => tona_cms_text_field( $post_id, 'jobs_list_title' ),
        'emptyJobsText' => tona_cms_text_field( $post_id, 'jobs_empty_text' ),
        'spontaneous'   => array(
            'eyebrow'     => tona_cms_text_field( $post_id, 'jobs_spontaneous_eyebrow' ),
            'title'       => tona_cms_text_field( $post_id, 'jobs_spontaneous_title' ),
            'description' => tona_cms_text_field( $post_id, 'jobs_spontaneous_description' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'jobs_spontaneous_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'jobs_spontaneous_link_url' ),
        ),
        'interns'       => array(
            'eyebrow'        => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_left', 'jobs_interns_Intro_left' ), 'jobs_interns_eyebrow', 'jobs_interns_eyebrow' ),
            'title'          => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_left', 'jobs_interns_Intro_left' ), 'jobs_interns_title', 'jobs_interns_title' ),
            'description'    => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_left', 'jobs_interns_Intro_left' ), 'jobs_interns_description', 'jobs_interns_description' ),
            'seasonLabel'    => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_right', 'jobs_interns_Intro_right' ), 'jobs_interns_season_label', 'jobs_interns_season_label' ),
            'slotsValue'     => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_right', 'jobs_interns_Intro_right' ), 'jobs_interns_slots_value', 'jobs_interns_slots_value' ),
            'slotsLabel'     => '',
            'majorsValue'    => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_right', 'jobs_interns_Intro_right' ), 'jobs_interns_majors_value', 'jobs_interns_majors_value' ),
            'majorsLabel'    => '',
            'note'           => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_right', 'jobs_interns_Intro_right' ), 'jobs_interns_note', 'jobs_interns_note' ),
            'ctaTitle'       => tona_cms_text_field( $post_id, 'jobs_interns_cta_title' ),
            'ctaDescription' => tona_cms_text_field( $post_id, 'jobs_interns_cta_description' ),
            'ctaLinkLabel'   => tona_cms_text_field( $post_id, 'jobs_interns_cta_link_label' ),
            'ctaLinkUrl'     => tona_cms_text_field( $post_id, 'jobs_interns_cta_link_url' ),
        ),
        'cultureTeaser' => array(
            'title'       => tona_cms_text_field( $post_id, 'jobs_culture_title' ),
            'description' => tona_cms_text_field( $post_id, 'jobs_culture_description' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'jobs_culture_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'jobs_culture_link_url' ),
        ),
    );
}

function tona_cms_project_payload( $post ) {
    $post_id = $post->ID;
    $terms = get_the_terms( $post_id, 'tona_project_category' );
    $terms = is_array( $terms ) ? $terms : array();
    $gallery = function_exists( 'get_field' ) ? get_field( 'project_gallery', $post_id ) : array();
    $summary_rows = function_exists( 'get_field' ) ? get_field( 'project_summary', $post_id ) : array();
    $summary = array();

    if ( is_array( $summary_rows ) && ! empty( $summary_rows ) ) {
        foreach ( $summary_rows as $summary_row ) {
            if ( ! is_array( $summary_row ) || empty( $summary_row['field'] ) ) {
                continue;
            }

            $summary[ $summary_row['field'] ] = $summary_row['value'] ?? '';
        }
    }

    $gallery_images = array_values(
        array_filter(
            array_map(
                function ( $item ) {
                    return tona_cms_image_url( $item['image'] ?? '' );
                },
                is_array( $gallery ) ? $gallery : array()
            )
        )
    );

    $images = $gallery_images;
    $main_image_url = ! empty( $gallery_images ) ? $gallery_images[0] : '';

    $category = ! empty( $terms ) ? $terms[0]->name : '';
    $category_slug = ! empty( $terms ) ? $terms[0]->slug : '';

    return array(
        'id'              => $post_id,
        'slug'            => $post->post_name,
        'title'           => get_the_title( $post ),
        'category'        => $category,
        'categorySlug'    => $category_slug,
        'categories'      => array_values(
            array_map(
                function ( $term ) {
                    return array(
                        'id'   => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                    );
                },
                $terms
            )
        ),
        'image'           => $main_image_url,
        'images'          => $images,
        'description'     => wp_strip_all_tags( get_the_content( null, false, $post ) ),
        'location'        => $summary['location'] ?? tona_cms_text_field( $post_id, 'project_location' ),
        'area'            => $summary['area'] ?? tona_cms_text_field( $post_id, 'project_area' ),
        'client'          => $summary['client'] ?? tona_cms_text_field( $post_id, 'project_client' ),
        'status'          => $summary['status'] ?? tona_cms_text_field( $post_id, 'project_status' ),
        'year'            => $summary['year'] ?? tona_cms_text_field( $post_id, 'project_year' ),
        'duration'        => $summary['duration'] ?? tona_cms_text_field( $post_id, 'project_duration' ),
        'renovationItems' => tona_cms_repeater_lines_field( $post_id, 'project_renovation_items', 'item', 'project_renovation_items' ),
        'highlights'      => tona_cms_repeater_lines_field( $post_id, 'project_highlights', 'item', 'project_highlights' ),
        'leedGold'        => (bool) ( function_exists( 'get_field' ) ? get_field( 'project_leed_gold', $post_id ) : false ),
    );
}

function tona_cms_projects_payload() {
    $projects = get_posts(
        array(
            'post_type'      => 'tona_project',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => array(
                'menu_order' => 'ASC',
                'date'       => 'DESC',
            ),
        )
    );

    return array_values(
        array_map( 'tona_cms_project_payload', is_array( $projects ) ? $projects : array() )
    );
}

function tona_cms_project_by_slug_payload( $slug ) {
    $project = get_page_by_path( sanitize_title( $slug ), OBJECT, 'tona_project' );

    if ( ! $project || 'publish' !== $project->post_status ) {
        return null;
    }

    return tona_cms_project_payload( $project );
}

function tona_cms_projects_page_payload( $page ) {
    $post_id = $page->ID;
    $stats = function_exists( 'get_field' ) ? get_field( 'projects_stats', $post_id ) : array();

    return array(
        'id'             => $post_id,
        'slug'           => $page->post_name,
        'title'          => get_the_title( $page ),
        'colors'         => array(
            'heroBackground'  => tona_cms_text_field( $post_id, 'projects_hero_background' ),
            'statsBackground' => tona_cms_text_field( $post_id, 'projects_stats_background' ),
            'ctaBackground'   => tona_cms_text_field( $post_id, 'projects_cta_background' ),
        ),
        'hero'           => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'projects_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'projects_hero_description' ),
        ),
        'stats'          => array_values(
            array_map(
                function ( $stat ) {
                    return array(
                        'value' => $stat['value'] ?? '',
                        'label' => $stat['label'] ?? '',
                    );
                },
                is_array( $stats ) ? $stats : array()
            )
        ),
        'cta'            => array(
            'title'       => tona_cms_text_field( $post_id, 'projects_cta_title' ),
            'description' => tona_cms_text_field( $post_id, 'projects_cta_description' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'projects_cta_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'projects_cta_link_url' ),
        ),
    );
}

function tona_cms_news_terms_payload( $post_id, $taxonomy ) {
    $terms = get_the_terms( $post_id, $taxonomy );

    if ( is_wp_error( $terms ) || ! is_array( $terms ) ) {
        return array();
    }

    return array_values(
        array_map(
            function ( $term ) {
                return array(
                    'id'   => $term->term_id,
                    'name' => tona_cms_decode_text( $term->name ),
                    'slug' => $term->slug,
                );
            },
            $terms
        )
    );
}

function tona_cms_news_payload( $post ) {
    $post_id = $post->ID;
    $categories = tona_cms_news_terms_payload( $post_id, 'tona_news_category' );
    $tags = tona_cms_news_terms_payload( $post_id, 'tona_news_tag' );
    $image = get_the_post_thumbnail_url( $post, 'large' );
    $author_name = tona_cms_text_field( $post_id, 'news_author_name' );

    return array(
        'id'           => $post_id,
        'slug'         => $post->post_name,
        'title'        => tona_cms_decode_text( get_the_title( $post ) ),
        'date'         => get_the_date( 'd/m/Y', $post ),
        'category'     => ! empty( $categories ) ? $categories[0]['name'] : '',
        'categorySlug' => ! empty( $categories ) ? $categories[0]['slug'] : '',
        'categories'   => $categories,
        'tags'         => array_values( wp_list_pluck( $tags, 'name' ) ),
        'image'        => $image ? esc_url_raw( $image ) : '',
        'excerpt'      => tona_cms_decode_text( has_excerpt( $post ) ? get_the_excerpt( $post ) : wp_trim_words( wp_strip_all_tags( $post->post_content ), 32 ) ),
        'content'      => apply_filters( 'the_content', $post->post_content ),
        'readTime'     => tona_cms_text_field( $post_id, 'news_read_time' ),
        'author'       => $author_name ?: tona_cms_decode_text( get_the_author_meta( 'display_name', (int) $post->post_author ) ),
    );
}

function tona_cms_related_news_payload( $post, $limit = 3 ) {
    $terms = get_the_terms( $post->ID, 'tona_news_category' );

    if ( is_wp_error( $terms ) || empty( $terms ) ) {
        return array();
    }

    $related_posts = get_posts(
        array(
            'post_type'      => 'tona_news',
            'post_status'    => 'publish',
            'posts_per_page' => $limit,
            'post__not_in'   => array( $post->ID ),
            'tax_query'      => array(
                array(
                    'taxonomy' => 'tona_news_category',
                    'field'    => 'term_id',
                    'terms'    => wp_list_pluck( $terms, 'term_id' ),
                ),
            ),
            'orderby'        => 'date',
            'order'          => 'DESC',
        )
    );

    return array_values(
        array_map( 'tona_cms_news_payload', is_array( $related_posts ) ? $related_posts : array() )
    );
}

function tona_cms_news_list_payload() {
    $posts = get_posts(
        array(
            'post_type'      => 'tona_news',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => 'date',
            'order'          => 'DESC',
        )
    );

    return array_values(
        array_map( 'tona_cms_news_payload', is_array( $posts ) ? $posts : array() )
    );
}

function tona_cms_news_by_slug_payload( $slug ) {
    $post = get_page_by_path( sanitize_title( $slug ), OBJECT, 'tona_news' );

    if ( ! $post || 'publish' !== $post->post_status ) {
        return null;
    }

    $payload = tona_cms_news_payload( $post );
    $payload['related'] = tona_cms_related_news_payload( $post );

    return $payload;
}

function tona_cms_news_page_payload( $page ) {
    $post_id = $page->ID;

    return array(
        'id'     => $post_id,
        'slug'   => $page->post_name,
        'title'  => get_the_title( $page ),
        'colors' => array(
            'heroBackground' => tona_cms_text_field( $post_id, 'news_hero_background' ),
            'ctaBackground'  => tona_cms_text_field( $post_id, 'news_cta_background' ),
        ),
        'hero'   => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'news_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'news_hero_description' ),
        ),
        'listing' => array(
            'featuredLabel'     => tona_cms_text_field( $post_id, 'news_featured_label' ),
            'searchPlaceholder' => tona_cms_text_field( $post_id, 'news_search_placeholder' ),
            'emptyText'         => tona_cms_text_field( $post_id, 'news_empty_text' ),
            'loadMoreLabel'     => tona_cms_text_field( $post_id, 'news_load_more_label' ),
        ),
        'cta' => array(
            'title'            => tona_cms_text_field( $post_id, 'news_cta_title' ),
            'description'      => tona_cms_text_field( $post_id, 'news_cta_description' ),
            'emailPlaceholder' => tona_cms_text_field( $post_id, 'news_cta_email_placeholder' ),
            'buttonLabel'      => tona_cms_text_field( $post_id, 'news_cta_button_label' ),
        ),
    );
}

function tona_cms_register_rest_routes() {
    register_rest_route(
        'tona/v1',
        '/members',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function () {
                return rest_ensure_response( tona_cms_members_list_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/news',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function () {
                return rest_ensure_response( tona_cms_news_list_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/news/(?P<slug>[a-z0-9-]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                $article = tona_cms_news_by_slug_payload( $request->get_param( 'slug' ) );

                if ( ! $article ) {
                    return new WP_Error( 'tona_news_not_found', 'News article not found.', array( 'status' => 404 ) );
                }

                return rest_ensure_response( $article );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/projects',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function () {
                return rest_ensure_response( tona_cms_projects_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/projects/(?P<slug>[a-z0-9-]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                $project = tona_cms_project_by_slug_payload( $request->get_param( 'slug' ) );

                if ( ! $project ) {
                    return new WP_Error( 'tona_project_not_found', 'Project not found.', array( 'status' => 404 ) );
                }

                return rest_ensure_response( $project );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/jobs',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function () {
                return rest_ensure_response( tona_cms_jobs_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/page-template/(?P<template>[a-z0-9-]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                $page = tona_cms_get_page_by_template( $request->get_param( 'template' ) );

                if ( ! $page ) {
                    return new WP_Error( 'tona_page_not_found', 'Page not found.', array( 'status' => 404 ) );
                }

                return rest_ensure_response( tona_cms_page_payload( $page ) );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/pages/(?P<slug>[a-z0-9-\/]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                $slug = $request->get_param( 'slug' );
                $page = tona_cms_get_page_by_slug( $slug );

                if ( ! $page ) {
                    return new WP_Error( 'tona_page_not_found', 'Page not found.', array( 'status' => 404 ) );
                }

                return rest_ensure_response( tona_cms_page_payload( $page ) );
            },
        )
    );
}
add_action( 'rest_api_init', 'tona_cms_register_rest_routes' );

