<?php
/**
 * Page lookup and generic page payload helpers.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
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
        array_merge(
            array(
            'post_type'      => 'page',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'name'           => sanitize_title( $post_name ),
            ),
            tona_cms_language_query_args()
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
        $current_language = function_exists( 'pll_current_language' ) ? pll_current_language( 'slug' ) : '';

        if ( $front_page_id && $current_language && function_exists( 'pll_get_post' ) ) {
            $translated_front_page_id = (int) pll_get_post( $front_page_id, $current_language );
            $front_page_id = $translated_front_page_id ? $translated_front_page_id : $front_page_id;
        }

        if ( $front_page_id ) {
            $front_page = get_post( $front_page_id );

            if ( $front_page && 'page' === $front_page->post_type && 'publish' === $front_page->post_status ) {
                return $front_page;
            }
        }
    }

    $pages = get_posts(
        array_merge(
            array(
            'post_type'      => 'page',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'orderby'        => 'menu_order title',
            'order'          => 'ASC',
            'meta_key'       => '_wp_page_template',
            'meta_value'     => $template_map[ $template_alias ],
            ),
            tona_cms_language_query_args()
        )
    );

    if ( ! empty( $pages[0] ) ) {
        return $pages[0];
    }

    return null;
}

function tona_cms_page_payload( $page ) {
    $template = get_page_template_slug( $page );
    $front_page_id = (int) get_option( 'page_on_front' );

    if ( 'templates/tona-home.php' === $template || ( $front_page_id && (int) $page->ID === $front_page_id ) ) {
        return tona_cms_home_payload( $page );
    }

    if ( 'templates/tona-members.php' === $template ) {
        return tona_cms_members_payload( $page );
    }

    if ( 'templates/tona-about.php' === $template ) {
        return tona_cms_about_payload( $page );
    }

    if ( 'templates/tona-culture.php' === $template ) {
        return tona_cms_culture_payload( $page );
    }

    if ( 'templates/tona-csr.php' === $template ) {
        return tona_cms_csr_payload( $page );
    }

    if ( 'templates/tona-services.php' === $template ) {
        return tona_cms_services_payload( $page );
    }

    if ( 'templates/tona-jobs.php' === $template ) {
        return tona_cms_jobs_page_payload( $page );
    }

    if ( 'templates/tona-projects.php' === $template ) {
        return tona_cms_projects_page_payload( $page );
    }

    if ( 'templates/tona-news.php' === $template ) {
        return tona_cms_news_page_payload( $page );
    }

    return array(
        'id'      => $page->ID,
        'slug'    => $page->post_name,
        'title'   => get_the_title( $page ),
        'content' => apply_filters( 'the_content', $page->post_content ),
    );
}

