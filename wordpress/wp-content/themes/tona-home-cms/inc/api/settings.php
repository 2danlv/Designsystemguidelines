<?php
/**
 * Menu and site settings payloads.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_menu_items_payload( $items ) {
    return array_values(
        array_filter(
            array_map(
                function ( $item ) {
                    if ( ! is_array( $item ) ) {
                        return null;
                    }

                    $children = $item['children'] ?? array();

                    return array(
                        'label'    => $item['label'] ?? '',
                        'url'      => $item['url'] ?? '',
                        'children' => array_values(
                            array_filter(
                                array_map(
                                    function ( $child ) {
                                        if ( ! is_array( $child ) ) {
                                            return null;
                                        }

                                        return array(
                                            'label' => $child['label'] ?? '',
                                            'url'   => $child['url'] ?? '',
                                        );
                                    },
                                    is_array( $children ) ? $children : array()
                                )
                            )
                        ),
                    );
                },
                is_array( $items ) ? $items : array()
            )
        )
    );
}

function tona_cms_link_url_value( $value ) {
    if ( is_array( $value ) ) {
        $value = $value['url'] ?? '';
    }

    $url = is_string( $value ) ? trim( $value ) : '';

    if ( '' === $url ) {
        return '';
    }

    return tona_cms_frontend_url( $url );
}

function tona_cms_frontend_url( $url, $menu_item = null ) {
    $url = is_string( $url ) ? trim( $url ) : '';

    if ( '' === $url || '#' === $url || preg_match( '/^(mailto:|tel:)/i', $url ) ) {
        return $url;
    }

    $home_host = wp_parse_url( home_url(), PHP_URL_HOST );
    $url_host = wp_parse_url( $url, PHP_URL_HOST );

    if ( $url_host && $home_host && strtolower( $url_host ) !== strtolower( $home_host ) ) {
        return esc_url_raw( $url );
    }

    $path = wp_parse_url( $url, PHP_URL_PATH );
    $site_path = wp_parse_url( site_url(), PHP_URL_PATH );
    $path = is_string( $path ) ? $path : $url;
    $site_path = is_string( $site_path ) ? rtrim( $site_path, '/' ) : '';

    if ( $site_path && 0 === strpos( $path, $site_path . '/' ) ) {
        $path = substr( $path, strlen( $site_path ) );
    } elseif ( $site_path && $path === $site_path ) {
        $path = '/';
    }

    $path = '' === $path ? '/' : $path;
    $path = '/' . ltrim( $path, '/' );
    $path = '/' === $path ? $path : rtrim( $path, '/' );

    $language_base = '';
    if ( preg_match( '#^/(vi|en)(?=/|$)#', $path, $matches ) ) {
        $language_base = '/' . $matches[1];
    }

    if ( $menu_item && isset( $menu_item->type, $menu_item->object, $menu_item->object_id ) && 'post_type' === $menu_item->type && 'page' === $menu_item->object ) {
        $page_id = (int) $menu_item->object_id;
        $page_slug = $page_id ? (string) get_post_field( 'post_name', $page_id ) : '';
        $page_template = $page_id ? (string) get_page_template_slug( $page_id ) : '';
        $front_page_id = (int) get_option( 'page_on_front' );

        if ( $page_id && ( $front_page_id === $page_id || 'templates/tona-home.php' === $page_template ) ) {
            $current_language = function_exists( 'pll_current_language' ) ? pll_current_language( 'slug' ) : 'vi';
            $current_language = in_array( $current_language, array( 'vi', 'en' ), true ) ? $current_language : 'vi';

            if ( '/en' === $language_base || 'en' === $current_language ) {
                return '/en';
            }

            return '/';
        }
    }

    if ( 0 === strpos( $path, '/vi/' ) ) {
        $path = substr( $path, 3 );
    } elseif ( '/vi' === $path ) {
        $path = '/';
    }

    return $path;
}

function tona_cms_apply_rest_language( $request ) {
    $language = $request instanceof WP_REST_Request ? sanitize_key( (string) $request->get_param( 'lang' ) ) : '';

    if ( ! in_array( $language, array( 'vi', 'en' ), true ) ) {
        $language = 'vi';
    }

    if ( function_exists( 'pll_switch_language' ) ) {
        pll_switch_language( $language );
    }

    return $language;
}

function tona_cms_language_query_args() {
    if ( ! function_exists( 'pll_current_language' ) ) {
        return array();
    }

    $language = pll_current_language( 'slug' );

    return $language ? array( 'lang' => $language ) : array();
}

function tona_cms_nav_menu_payload( $location = 'primary' ) {
    $locations = get_nav_menu_locations();
    $current_language = function_exists( 'pll_current_language' ) ? pll_current_language( 'slug' ) : '';
    $localized_location = $current_language ? $location . '_' . $current_language : '';
    $menu_id = ! empty( $locations[ $location ] ) ? (int) $locations[ $location ] : 0;

    if ( $localized_location && ! empty( $locations[ $localized_location ] ) ) {
        $menu_id = (int) $locations[ $localized_location ];
    }

    if ( ! $menu_id ) {
        $menu_names = array_filter(
            array(
                $current_language ? 'Menu ' . strtoupper( $current_language ) : '',
                'Menu VN',
            )
        );
        $menu = null;

        foreach ( $menu_names as $menu_name ) {
            $menu = wp_get_nav_menu_object( $menu_name );

            if ( $menu ) {
                break;
            }
        }

        if ( ! $menu ) {
            $menus = wp_get_nav_menus();
            $menu = ! empty( $menus[0] ) ? $menus[0] : null;
        }

        $menu_id = $menu ? (int) $menu->term_id : 0;
    }

    if ( ! $menu_id ) {
        return array();
    }

    $menu_items = wp_get_nav_menu_items( $menu_id );

    if ( empty( $menu_items ) || is_wp_error( $menu_items ) ) {
        return array();
    }

    $items_by_parent = array();

    foreach ( $menu_items as $item ) {
        $parent_id = (int) $item->menu_item_parent;

        if ( ! isset( $items_by_parent[ $parent_id ] ) ) {
            $items_by_parent[ $parent_id ] = array();
        }

        $items_by_parent[ $parent_id ][] = $item;
    }

    $build_items = function ( $parent_id ) use ( &$build_items, &$items_by_parent ) {
        return array_values(
            array_map(
                function ( $item ) use ( &$build_items ) {
                    return array(
                        'label'    => tona_cms_decode_text( $item->title ),
                        'url'      => tona_cms_frontend_url( $item->url, $item ),
                        'children' => $build_items( (int) $item->ID ),
                    );
                },
                $items_by_parent[ $parent_id ] ?? array()
            )
        );
    };

    return $build_items( 0 );
}

function tona_cms_link_items_payload( $items ) {
    return array_values(
        array_filter(
            array_map(
                function ( $item ) {
                    if ( ! is_array( $item ) ) {
                        return null;
                    }

                    return array(
                        'label' => $item['label'] ?? '',
                        'url'   => tona_cms_link_url_value( $item['url'] ?? '' ),
                    );
                },
                is_array( $items ) ? $items : array()
            )
        )
    );
}

function tona_cms_option_link_field( $option_id, $field_name ) {
    $value = function_exists( 'get_field' ) ? get_field( $field_name, $option_id ) : '';
    return tona_cms_link_url_value( $value );
}

function tona_cms_localized_option_link_field( $option_id, $field_name, $language ) {
    if ( 'en' === $language ) {
        $localized_value = tona_cms_option_link_field( $option_id, $field_name . '_en' );

        if ( '' !== $localized_value ) {
            return $localized_value;
        }
    }

    return tona_cms_option_link_field( $option_id, $field_name );
}

function tona_cms_project_category_from_value( $value ) {
    if ( $value instanceof WP_Term ) {
        return $value;
    }

    if ( is_array( $value ) ) {
        if ( ! empty( $value['term_id'] ) ) {
            $term = get_term( (int) $value['term_id'], 'tona_project_category' );
            return $term && ! is_wp_error( $term ) ? $term : null;
        }

        if ( ! empty( $value['slug'] ) ) {
            $term = get_term_by( 'slug', sanitize_title( $value['slug'] ), 'tona_project_category' );
            return $term && ! is_wp_error( $term ) ? $term : null;
        }
    }

    if ( is_numeric( $value ) ) {
        $term = get_term( (int) $value, 'tona_project_category' );
        return $term && ! is_wp_error( $term ) ? $term : null;
    }

    if ( is_string( $value ) && '' !== trim( $value ) ) {
        $term = get_term_by( 'slug', sanitize_title( $value ), 'tona_project_category' );
        return $term && ! is_wp_error( $term ) ? $term : null;
    }

    return null;
}

function tona_cms_projects_page_filter_url( $term, $language ) {
    $page = function_exists( 'tona_cms_get_page_by_template' ) ? tona_cms_get_page_by_template( 'tona-projects' ) : null;
    $base_url = $page ? tona_cms_frontend_url( get_permalink( $page ) ) : ( 'en' === $language ? '/en/projects' : '/du-an-tona' );
    $base_url = rtrim( $base_url ?: '/', '/' );

    if ( '' === $base_url ) {
        $base_url = '/';
    }

    return $base_url . '#' . rawurlencode( $term->slug );
}

function tona_cms_project_category_link_items_payload( $items, $language ) {
    return array_values(
        array_filter(
            array_map(
                function ( $item ) use ( $language ) {
                    if ( ! is_array( $item ) ) {
                        return null;
                    }

                    $term = tona_cms_project_category_from_value( $item['category'] ?? null );

                    if ( $term ) {
                        return array(
                            'label' => trim( $item['label'] ?? '' ) ?: tona_cms_decode_text( $term->name ),
                            'url'   => tona_cms_projects_page_filter_url( $term, $language ),
                        );
                    }

                    return array(
                        'label' => $item['label'] ?? '',
                        'url'   => tona_cms_link_url_value( $item['url'] ?? '' ),
                    );
                },
                is_array( $items ) ? $items : array()
            )
        )
    );
}

function tona_cms_localized_project_category_link_items_payload( $option_id, $field_name, $language ) {
    if ( 'en' === $language && function_exists( 'get_field' ) ) {
        $localized_items = get_field( $field_name . '_en', $option_id );
        $localized_payload = tona_cms_project_category_link_items_payload( is_array( $localized_items ) ? $localized_items : array(), $language );

        if ( ! empty( $localized_payload ) ) {
            return $localized_payload;
        }
    }

    return tona_cms_project_category_link_items_payload( function_exists( 'get_field' ) ? get_field( $field_name, $option_id ) : array(), $language );
}

function tona_cms_site_settings_payload() {
    $option_id = 'option';
    $current_language = function_exists( 'pll_current_language' ) ? pll_current_language( 'slug' ) : 'vi';
    $current_language = in_array( $current_language, array( 'vi', 'en' ), true ) ? $current_language : 'vi';
    $socials = function_exists( 'get_field' ) ? get_field( 'site_footer_socials', $option_id ) : array();
    $site_title = tona_cms_decode_text( get_bloginfo( 'name' ) );
    $site_tagline = tona_cms_decode_text( get_bloginfo( 'description' ) );
    $site_icon = function_exists( 'get_site_icon_url' ) ? get_site_icon_url( 512 ) : '';
    $header_logo = tona_cms_image_url( function_exists( 'get_field' ) ? get_field( 'site_header_logo', $option_id ) : '' );

    return array(
        'ui'   => tona_cms_ui_strings_payload( $current_language ),
        'site' => array(
            'title'   => $site_title,
            'tagline' => $site_tagline,
            'icon'    => $site_icon ? esc_url_raw( $site_icon ) : '',
        ),
        'header' => array(
            'logo'      => $header_logo ?: ( $site_icon ? esc_url_raw( $site_icon ) : '' ),
            'logoAlt'   => tona_cms_text_field( $option_id, 'site_header_logo_alt' ) ?: $site_title,
            'homeUrl'   => 'en' === $current_language ? '/en' : '/',
            'nav'       => tona_cms_nav_menu_payload( 'primary' ),
            'languages' => array(
                array(
                    'label' => 'VI',
                    'url'   => '/',
                ),
                array(
                    'label' => 'EN',
                    'url'   => '/en',
                ),
            ),
        ),
        'footer' => array(
            'cta' => array(
                'eyebrow'   => tona_cms_localized_text_field( $option_id, 'site_footer_cta_eyebrow', $current_language ),
                'title'     => tona_cms_localized_text_field( $option_id, 'site_footer_cta_title', $current_language ),
                'button'    => tona_cms_localized_text_field( $option_id, 'site_footer_cta_button', $current_language ),
                'buttonUrl' => tona_cms_localized_option_link_field( $option_id, 'site_footer_cta_button_url', $current_language ),
            ),
            'logo'           => tona_cms_image_url( function_exists( 'get_field' ) ? get_field( 'site_footer_logo', $option_id ) : '' ),
            'logoAlt'        => tona_cms_localized_text_field( $option_id, 'site_footer_logo_alt', $current_language ),
            'description'    => tona_cms_localized_text_field( $option_id, 'site_footer_description', $current_language ),
            'certifications' => array_values(
                array_filter(
                    array_map(
                        function ( $item ) {
                            return is_array( $item ) ? trim( $item['text'] ?? '' ) : '';
                        },
                        function_exists( 'get_field' ) ? ( get_field( 'site_footer_certifications', $option_id ) ?: array() ) : array()
                    )
                )
            ),
            'aboutTitle'     => tona_cms_localized_text_field( $option_id, 'site_footer_about_title', $current_language ),
            'aboutLinks'     => tona_cms_localized_link_items_payload( $option_id, 'site_footer_about_links', $current_language ),
            'projectsTitle'  => tona_cms_localized_text_field( $option_id, 'site_footer_projects_title', $current_language ),
            'projectLinks'   => tona_cms_localized_project_category_link_items_payload( $option_id, 'site_footer_project_links', $current_language ),
            'contactTitle'   => tona_cms_localized_text_field( $option_id, 'site_footer_contact_title', $current_language ),
            'address'        => tona_cms_localized_text_field( $option_id, 'site_footer_address', $current_language ),
            'phone'          => tona_cms_text_field( $option_id, 'site_footer_phone' ),
            'email'          => tona_cms_text_field( $option_id, 'site_footer_email' ),
            'socials'        => array_values(
                array_filter(
                    array_map(
                        function ( $item ) {
                            if ( ! is_array( $item ) ) {
                                return null;
                            }

                            return array(
                                'platform' => $item['platform'] ?? 'Facebook',
                                'url'      => $item['url'] ?? '',
                            );
                        },
                        is_array( $socials ) ? $socials : array()
                    )
                )
            ),
            'copyright'      => tona_cms_localized_text_field( $option_id, 'site_footer_copyright', $current_language ),
            'legalLinks'     => tona_cms_localized_link_items_payload( $option_id, 'site_footer_legal_links', $current_language ),
        ),
    );
}
