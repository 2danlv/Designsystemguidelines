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

function tona_cms_create_default_pages() {
    $pages = array(
        'doi-ngu' => 'Doi Ngu',
        'gioi-thieu-tona' => 'Gioi Thieu Tona',
    );

    foreach ( $pages as $slug => $title ) {
        if ( get_page_by_path( $slug, OBJECT, 'page' ) ) {
            continue;
        }

        wp_insert_post(
            array(
                'post_type'    => 'page',
                'post_status'  => 'publish',
                'post_title'   => $title,
                'post_name'    => $slug,
                'post_content' => '',
            )
        );
    }
}
add_action( 'after_switch_theme', 'tona_cms_create_default_pages' );
add_action( 'init', 'tona_cms_create_default_pages' );

function tona_cms_acf_json_save_path( $path ) {
    return get_stylesheet_directory() . '/acf-json';
}
add_filter( 'acf/settings/save_json', 'tona_cms_acf_json_save_path' );

function tona_cms_acf_json_load_paths( $paths ) {
    $paths[] = get_stylesheet_directory() . '/acf-json';
    return $paths;
}
add_filter( 'acf/settings/load_json', 'tona_cms_acf_json_load_paths' );

function tona_cms_acf_location_rule_types( $choices ) {
    $choices['Post']['page_slug'] = 'Page Slug';
    return $choices;
}
add_filter( 'acf/location/rule_types', 'tona_cms_acf_location_rule_types' );

function tona_cms_acf_location_rule_values_page_slug( $choices ) {
    $choices['doi-ngu'] = 'Doi Ngu';
    $choices['gioi-thieu-tona'] = 'Gioi Thieu Tona';
    return $choices;
}
add_filter( 'acf/location/rule_values/page_slug', 'tona_cms_acf_location_rule_values_page_slug' );

function tona_cms_acf_location_rule_match_page_slug( $match, $rule, $options ) {
    $post_id = isset( $options['post_id'] ) ? (int) $options['post_id'] : 0;
    $post = $post_id ? get_post( $post_id ) : null;

    if ( ! $post || 'page' !== $post->post_type ) {
        return false;
    }

    $is_match = $post->post_name === $rule['value'];

    return '==' === $rule['operator'] ? $is_match : ! $is_match;
}
add_filter( 'acf/location/rule_match/page_slug', 'tona_cms_acf_location_rule_match_page_slug', 10, 3 );

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

function tona_cms_about_background_field_map() {
    return array(
        'field_tona_about_hero_description' => tona_cms_acf_color_field(
            'field_tona_about_hero_background',
            'Hero Background Color',
            'about_hero_background',
            '#002d17',
            'Leave empty to use the default dark green background.'
        ),
        'field_tona_about_tab_mission' => tona_cms_acf_image_field(
            'field_tona_about_mission_background_image',
            'Background Image',
            'about_mission_background_image',
            'Image behind the Mission / Vision cards. Leave empty to keep the default artwork.'
        ),
        'field_tona_about_values_title' => tona_cms_acf_color_field(
            'field_tona_about_values_background',
            'Section Background Color',
            'about_values_background',
            '#ffffff',
            'Leave empty to use the default white background.'
        ),
        'field_tona_about_timeline_title' => tona_cms_acf_color_field(
            'field_tona_about_timeline_background',
            'Section Background Color',
            'about_timeline_background',
            '#f9f9f7',
            'Leave empty to use the default light background.'
        ),
        'field_tona_about_certifications_title' => tona_cms_acf_color_field(
            'field_tona_about_certifications_background',
            'Section Background Color',
            'about_certifications_background',
            '#002d17',
            'Leave empty to use the default dark green background.'
        ),
        'field_tona_about_tab_cta' => tona_cms_acf_color_field(
            'field_tona_about_cta_background',
            'CTA Background Color',
            'about_cta_background',
            '#ffffff',
            'Leave empty to use the default white background.',
            'tona-about-cta-background'
        ),
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

function tona_cms_about_load_fields( $fields, $parent ) {
    $parent_key = is_array( $parent ) && isset( $parent['key'] ) ? $parent['key'] : '';

    if ( 'group_tona_about_page' !== $parent_key ) {
        return $fields;
    }

    foreach ( tona_cms_about_background_field_map() as $after_key => $field ) {
        $fields = tona_cms_insert_acf_field_after( $fields, $after_key, $field );
    }

    return $fields;
}
add_filter( 'acf/load_fields', 'tona_cms_about_load_fields', 20, 2 );

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
        '1.0.0'
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

function tona_cms_prepare_members_field( $field ) {
    if ( ! tona_cms_is_page_editor_screen() ) {
        return $field;
    }

    $field_map = array(
        'field_tona_members_tab_hero' => array( 'label' => '01. Hero' ),
        'field_tona_members_breadcrumb_label' => array(
            'label'        => 'Breadcrumb',
            'instructions' => 'Dòng nhỏ trong breadcrumb ở đầu trang.',
        ),
        'field_tona_members_hero_title' => array(
            'label'        => 'Tiêu đề Hero',
            'instructions' => 'Tiêu đề lớn trong trên đầu trang. Có thể xuống dòng.',
        ),
        'field_tona_members_hero_description' => array(
            'label'        => 'Mô tả Hero',
            'instructions' => 'Đoạn mô tả ngắn ngay dưới tiêu đề.',
        ),
        'field_tona_members_tab_leadership' => array( 'label' => '02. Cards lãnh đạo' ),
        'field_tona_members_leadership' => array(
            'label'        => 'Danh sách card lãnh đạo',
            'instructions' => 'Mỗi dòng là một card chân dung trên giao diện. Kéo để đổi thứ tự hiển thị.',
        ),
        'field_tona_members_member_id' => array(
            'label'        => 'ID',
            'instructions' => 'Có thể để trống. Chỉ dùng nội bộ.',
        ),
        'field_tona_members_member_name' => array( 'label' => 'Tên' ),
        'field_tona_members_member_role' => array( 'label' => 'Chức danh' ),
        'field_tona_members_member_role_en' => array( 'label' => 'Chức danh EN' ),
        'field_tona_members_member_image' => array(
            'label'        => 'Ảnh chân dung',
        ),
        'field_tona_members_member_bio' => array( 'label' => 'Mô tả ngắn' ),
        'field_tona_members_member_linkedin' => array( 'label' => 'LinkedIn' ),
        'field_tona_members_tab_values' => array( 'label' => '03. Giá trị' ),
        'field_tona_members_values_title' => array(
            'label'        => 'Tiêu đề section',
            'instructions' => 'Heading của khu vực nền xanh đậm ở giữa trang.',
        ),
        'field_tona_members_values' => array(
            'label'        => 'Danh sách ô giá trị',
            'instructions' => 'Mỗi dòng là một ô trong grid giá trị.',
        ),
        'field_tona_members_value_icon' => array( 'label' => 'Icon' ),
        'field_tona_members_value_title' => array( 'label' => 'Tiêu đề ô' ),
        'field_tona_members_value_description' => array( 'label' => 'Mô tả ô' ),
        'field_tona_members_tab_teaser' => array( 'label' => '04. CTA cuối trang' ),
        'field_tona_members_teaser_title' => array(
            'label'        => 'Tiêu đề CTA',
            'instructions' => 'Tiêu đề block nền trắng cuối trang.',
            'wrapper'      => array(
                'width' => '50',
                'class' => 'tona-cta-title',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_description' => array(
            'label'   => 'Mô tả CTA',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-description',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_link_label' => array(
            'label'   => 'Chữ trên nút',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-button-label',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_link_url' => array(
            'label'   => 'Trang đích của nút',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-button-url',
                'id'    => '',
            ),
        ),
    );

    if ( isset( $field_map[ $field['key'] ] ) ) {
        $field = array_merge( $field, $field_map[ $field['key'] ] );
    }

    return $field;
}
add_filter( 'acf/prepare_field', 'tona_cms_prepare_members_field' );

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

function tona_cms_text_field( $post_id, $field_name ) {
    $value = function_exists( 'get_field' ) ? get_field( $field_name, $post_id ) : '';
    return is_string( $value ) ? $value : '';
}

function tona_cms_get_page_by_slug( $slug ) {
    $page = get_page_by_path( sanitize_title( $slug ), OBJECT, 'page' );

    if ( ! $page || 'publish' !== $page->post_status ) {
        return null;
    }

    return $page;
}

function tona_cms_members_payload( $page ) {
    $post_id = $page->ID;
    $leadership = function_exists( 'get_field' ) ? get_field( 'members_leadership', $post_id ) : array();
    $values = function_exists( 'get_field' ) ? get_field( 'members_values', $post_id ) : array();

    return array(
        'id'        => $post_id,
        'slug'      => $page->post_name,
        'title'     => get_the_title( $page ),
        'hero'      => array(
            'breadcrumbLabel' => tona_cms_text_field( $post_id, 'members_breadcrumb_label' ),
            'title'           => tona_cms_text_field( $post_id, 'members_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'members_hero_description' ),
        ),
        'leadership' => array_values(
            array_map(
                function ( $member ) {
                    return array(
                        'id'       => sanitize_title( $member['id'] ?? $member['name'] ?? '' ),
                        'name'     => $member['name'] ?? '',
                        'role'     => $member['role'] ?? '',
                        'roleEn'   => $member['role_en'] ?? '',
                        'image'    => tona_cms_image_url( $member['image'] ?? '' ),
                        'bio'      => $member['bio'] ?? '',
                        'linkedin' => $member['linkedin'] ?? '#',
                    );
                },
                is_array( $leadership ) ? $leadership : array()
            )
        ),
        'valuesTitle' => tona_cms_text_field( $post_id, 'members_values_title' ),
        'values'      => array_values(
            array_map(
                function ( $value ) {
                    return array(
                        'icon'  => $value['icon'] ?? 'Shield',
                        'title' => $value['title'] ?? '',
                        'desc'  => $value['description'] ?? '',
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

function tona_cms_about_payload( $page ) {
    $post_id = $page->ID;
    $stats = function_exists( 'get_field' ) ? get_field( 'about_stats', $post_id ) : array();
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
            'breadcrumbLabel' => tona_cms_text_field( $post_id, 'about_breadcrumb_label' ),
            'title'           => tona_cms_text_field( $post_id, 'about_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'about_hero_description' ),
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
                        'icon'  => $value['icon'] ?? 'Shield',
                        'title' => $value['title'] ?? '',
                        'desc'  => $value['description'] ?? '',
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

function tona_cms_register_rest_routes() {
    register_rest_route(
        'tona/v1',
        '/pages/(?P<slug>[a-z0-9-]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                $slug = $request->get_param( 'slug' );
                $page = tona_cms_get_page_by_slug( $slug );

                if ( ! $page ) {
                    return new WP_Error( 'tona_page_not_found', 'Page not found.', array( 'status' => 404 ) );
                }

                if ( 'doi-ngu' === $page->post_name ) {
                    return rest_ensure_response( tona_cms_members_payload( $page ) );
                }

                if ( 'gioi-thieu-tona' === $page->post_name ) {
                    return rest_ensure_response( tona_cms_about_payload( $page ) );
                }

                return rest_ensure_response(
                    array(
                        'id'      => $page->ID,
                        'slug'    => $page->post_name,
                        'title'   => get_the_title( $page ),
                        'content' => apply_filters( 'the_content', $page->post_content ),
                    )
                );
            },
        )
    );
}
add_action( 'rest_api_init', 'tona_cms_register_rest_routes' );
