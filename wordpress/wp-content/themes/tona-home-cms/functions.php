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
    if ( get_page_by_path( 'doi-ngu', OBJECT, 'page' ) ) {
        return;
    }

    wp_insert_post(
        array(
            'post_type'    => 'page',
            'post_status'  => 'publish',
            'post_title'   => 'Doi Ngu',
            'post_name'    => 'doi-ngu',
            'post_content' => '',
        )
    );
}
add_action( 'after_switch_theme', 'tona_cms_create_default_pages' );

function tona_cms_acf_json_save_path( $path ) {
    return get_stylesheet_directory() . '/acf-json';
}
add_filter( 'acf/settings/save_json', 'tona_cms_acf_json_save_path' );

function tona_cms_acf_json_load_paths( $paths ) {
    $paths[] = get_stylesheet_directory() . '/acf-json';
    return $paths;
}
add_filter( 'acf/settings/load_json', 'tona_cms_acf_json_load_paths' );

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
