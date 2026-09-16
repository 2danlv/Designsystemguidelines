<?php
/**
 * CMS route resolver payloads.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_route_template_alias( $template ) {
    $template_map = array(
        'templates/tona-home.php'     => 'tona-home',
        'templates/tona-members.php'  => 'tona-members',
        'templates/tona-about.php'    => 'tona-about',
        'templates/tona-culture.php'  => 'tona-culture',
        'templates/tona-csr.php'      => 'tona-csr',
        'templates/tona-services.php' => 'tona-services',
        'templates/tona-jobs.php'     => 'tona-jobs',
        'templates/tona-projects.php' => 'tona-projects',
        'templates/tona-news.php'     => 'tona-news',
    );

    return $template_map[ $template ] ?? '';
}

function tona_cms_resolve_post_type_from_path( $path ) {
    $path = strtok( (string) $path, '?' ) ?: '';
    $path = strtok( $path, '#' ) ?: $path;
    $path = preg_replace( '#^/(vi|en)(?=/|$)#', '', $path );
    $segments = array_values( array_filter( explode( '/', trim( $path, '/' ) ) ) );
    $slug = ! empty( $segments ) ? sanitize_title( end( $segments ) ) : '';

    if ( '' === $slug ) {
        return 0;
    }

    foreach ( array( 'tona_project', 'tona_news', 'tona_job', 'page' ) as $post_type ) {
        $posts = get_posts(
            array_merge(
                array(
                    'post_type'      => $post_type,
                    'post_status'    => 'publish',
                    'posts_per_page' => 1,
                    'name'           => $slug,
                    'fields'         => 'ids',
                ),
                tona_cms_language_query_args()
            )
        );

        if ( ! empty( $posts[0] ) ) {
            return (int) $posts[0];
        }
    }

    return 0;
}

function tona_cms_resolve_route_payload( $request ) {
    $requested_language = tona_cms_apply_rest_language( $request );

    $path = trim( (string) $request->get_param( 'path' ) );
    $path = '/' . ltrim( $path, '/' );
    $path = strtok( $path, '?' ) ?: '/';
    $path = strtok( $path, '#' ) ?: $path;
    $language_from_path = '';

    if ( preg_match( '#^/(vi|en)(?=/|$)#', $path, $matches ) ) {
        $language_from_path = $matches[1];
    }

    $is_language_home = in_array( $path, array( '/', '/vi', '/vi/', '/en', '/en/' ), true );

    if ( $is_language_home ) {
        $front_page_id = (int) get_option( 'page_on_front' );
        $home_language = $language_from_path ?: ( function_exists( 'pll_current_language' ) ? pll_current_language( 'slug' ) : 'vi' );
        $home_language = in_array( $home_language, array( 'vi', 'en' ), true ) ? $home_language : 'vi';

        if ( $front_page_id && $home_language && function_exists( 'pll_get_post' ) ) {
            $translated_front_page_id = (int) pll_get_post( $front_page_id, $home_language );
            $front_page_id = $translated_front_page_id ? $translated_front_page_id : $front_page_id;
        }

        if ( $front_page_id ) {
            $post_id = $front_page_id;
        }
    }

    // Resolve the translated slug first. url_to_postid() can return the default
    // language page when WordPress lives in a subdirectory and Polylang is active.
    if ( empty( $post_id ) ) {
        $post_id = tona_cms_resolve_post_type_from_path( $path );
    }

    if ( ! $post_id ) {
        $post_id = url_to_postid( home_url( $path ) );
    }

    if ( ! $post_id ) {
        $path_without_language = preg_replace( '#^/(vi|en)(?=/|$)#', '', $path );
        $post_id = url_to_postid( home_url( $path_without_language ?: '/' ) );
    }

    if ( ! $post_id ) {
        return array(
            'type' => 'not_found',
        );
    }

    $post = get_post( $post_id );

    if ( ! $post || 'publish' !== $post->post_status ) {
        return array(
            'type' => 'not_found',
        );
    }

    // url_to_postid() can resolve the default-language post when translated
    // projects share a slug. Keep the route tied to the requested language.
    $post_language = function_exists( 'pll_get_post_language' ) ? pll_get_post_language( $post_id, 'slug' ) : '';
    if ( 'tona_project' === $post->post_type && in_array( $post_language, array( 'vi', 'en' ), true )
        && $requested_language !== $post_language ) {
        $translated_id = function_exists( 'pll_get_post' ) ? (int) pll_get_post( $post_id, $requested_language ) : 0;
        $translated_post = $translated_id ? get_post( $translated_id ) : null;

        if ( ! $translated_post || 'publish' !== $translated_post->post_status
            || $translated_post->post_name !== basename( trim( $path, '/' ) ) ) {
            return array( 'type' => 'not_found' );
        }

        $post = $translated_post;
        $post_id = $translated_id;
    }

    $translations = array();
    if ( function_exists( 'pll_get_post' ) ) {
        foreach ( array( 'vi', 'en' ) as $language ) {
            $translated_id = (int) pll_get_post( $post_id, $language );

            // Some imported project translations share a slug without a
            // Polylang translation link. Resolve only an existing post.
            if ( ! $translated_id && 'tona_project' === $post->post_type ) {
                $matching_posts = get_posts(
                    array(
                        'post_type'        => 'tona_project',
                        'post_status'      => 'publish',
                        'posts_per_page'   => 1,
                        'name'             => $post->post_name,
                        'lang'             => $language,
                        'fields'           => 'ids',
                        'suppress_filters' => false,
                    )
                );
                $translated_id = ! empty( $matching_posts[0] ) ? (int) $matching_posts[0] : 0;
            }

            if ( $translated_id ) {
                $translated_post = get_post( $translated_id );

                if ( $translated_post && 'publish' === $translated_post->post_status ) {
                    $translations[ $language ] = 'tona_project' === $translated_post->post_type
                        ? ( 'en' === $language ? '/en/project-tona/' : '/du-an-tona/' ) . $translated_post->post_name
                        : tona_cms_frontend_url( get_permalink( $translated_id ) );
                }
            }
        }
    }

    $seo = tona_cms_seo_payload( $post );

    if ( 'tona_project' === $post->post_type ) {
        return array(
            'type'         => 'project',
            'title'        => $seo['title'],
            'seo'          => $seo,
            'slug'         => $post->post_name,
            'project'      => tona_cms_project_payload( $post ),
            'translations' => $translations,
        );
    }

    if ( 'tona_news' === $post->post_type ) {
        return array(
            'type'         => 'news',
            'title'        => $seo['title'],
            'seo'          => $seo,
            'slug'         => $post->post_name,
            'translations' => $translations,
        );
    }

    if ( 'tona_job' === $post->post_type ) {
        return array(
            'type'         => 'page',
            'title'        => $seo['title'],
            'seo'          => $seo,
            'template'     => 'tona-jobs',
            'slug'         => $post->post_name,
            'translations' => $translations,
        );
    }

    if ( 'page' === $post->post_type ) {
        $front_page_id = (int) get_option( 'page_on_front' );
        $template = get_page_template_slug( $post_id );
        $template_alias = tona_cms_route_template_alias( $template );

        if ( $is_language_home || ( ! $template_alias && $front_page_id && (int) $post_id === $front_page_id ) ) {
            $template_alias = 'tona-home';
        }

        $payload = array(
            'type'         => 'page',
            'title'        => $seo['title'],
            'seo'          => $seo,
            'template'     => $template_alias,
            'slug'         => $post->post_name,
            'translations' => $translations,
        );

        if ( ! $template_alias ) {
            $payload['page'] = tona_cms_page_payload( $post );
        }

        return $payload;
    }

    return array(
        'type' => 'not_found',
    );
}
