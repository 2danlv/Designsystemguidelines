<?php
/**
 * Polylang string translations for fixed React UI labels.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_ui_string_defaults() {
    return array(
        'common.home'              => 'Trang Chủ',
        'common.news'              => 'Tin Tức',
        'common.culture'           => 'Cuộc Sống Tona',
        'common.back'              => 'Quay Lại',
        'common.all'               => 'Tất Cả',
        'common.highlights'        => 'Điểm Nổi Bật',
        'common.video_title'       => 'Video Tona',
        'common.switch_language'   => 'Chuyển sang',
        'common.menu_toggle'       => 'Đóng/Mở Menu',
        'home.hero.primary_label'  => 'Xem Dự Án',
        'home.hero.secondary_label' => 'Dịch Vụ',
        'home.services.title'      => 'Dịch Vụ Cốt Lõi',
        'home.services.strength'   => 'Thế Mạnh',
        'home.services.view_all'   => 'Xem Tất Cả Dịch Vụ',
        'home.projects.label'      => 'Dự Án',
        'home.projects.title'      => 'Dự Án Nổi Bật',
        'home.projects.view_all'   => 'Xem Tất Cả',
        'home.projects.detail'     => 'Chi Tiết Dự Án',
        'home.news.title'          => 'Tin Tức & Hoạt Động',
        'home.news.view_all'       => 'Xem Tất Cả',
        'home.news.read_more'      => 'Đọc Tiếp',
        'home.partners.title'      => 'Đối Tác & Khách Hàng',
        'jobs.apply_now'           => 'Ứng Tuyển Ngay',
        'jobs.all_departments'     => 'Tất Cả',
        'jobs.view_jd'             => 'Xem Mô Tả Công Việc',
        'jobs.detail'              => 'Chi Tiết',
        'jobs.requirements'        => 'Yêu Cầu',
        'jobs.skills'              => 'Kỹ Năng',
        'jobs.benefits'            => 'Phúc Lợi',
        'jobs.salary'              => 'Mức Lương',
        'jobs.slots_suffix'        => 'vị trí',
        'jobs.form.success'        => 'Hồ sơ của bạn đã được gửi thành công.',
        'jobs.form.error'          => 'Không thể gửi hồ sơ. Vui lòng thử lại.',
        'jobs.form.submitting'     => 'Đang gửi...',
        'members.since'            => 'Tại Tona từ',
        'members.education'        => 'Học Vấn & Chứng Chỉ',
        'members.expertise'        => 'Chuyên Môn',
        'members.achievements'     => 'Thành Tựu Nổi Bật',
        'members.view_profile'     => 'Xem Hồ Sơ',
        'news.read_more'           => 'Đọc Tiếp',
        'news.featured_badge'      => 'Nổi Bật',
        'news.not_found'           => 'Không tìm thấy bài viết',
        'news.back'                => 'Quay Lại Tin Tức',
        'news.related'             => 'Bài Viết Liên Quan',
        'news.cta_title'           => 'Dự Án Của Bạn?',
        'news.cta_description'     => 'Liên hệ Tona ngay hôm nay để được tư vấn.',
        'news.cta_button'          => 'Liên Hệ',
        'news.more'                => 'Tin Tức Khác',
        'projects.all'             => 'Tất Cả',
        'projects.detail'          => 'Xem Chi Tiết',
        'services.construction_suffix' => 'thi công',
        'services.featured_project'    => 'Dự Án Tiêu Biểu',
        'services.project_year'        => 'Năm',
        'services.project_detail'      => 'Xem Chi Tiết',
        'services.projects_all'        => 'Xem Tất Cả Dự Án',
        'culture.academy_image_alt'    => 'Học Viện Tona',
        'culture.gallery_image_alt'    => 'Văn Hóa Tona',
        'project.lightbox.close'   => 'Đóng (ESC)',
        'project.gallery.zoom'     => 'Phóng To',
        'project.not_found'        => 'Không Tìm Thấy Dự Án',
        'project.back'             => 'Quay Lại Danh Sách Dự Án',
        'project.back_all'         => 'Tất Cả Dự Án',
        'project.spec.client'      => 'Khách Hàng',
        'project.spec.location'    => 'Vị Trí',
        'project.spec.area'        => 'Diện Tích',
        'project.spec.duration'    => 'Thời Gian',
        'project.spec.status'      => 'Trạng Thái',
        'project.leed_badge'       => 'Chứng Nhận LEED Gold',
        'project.leed_note'        => 'Công trình đạt chứng nhận xanh LEED Gold',
        'project.highlights'       => 'Điểm Nổi Bật',
        'project.construction'     => 'Hạng Mục Thi Công',
        'project.cta_eyebrow'      => 'Có dự án tương tự?',
        'project.cta_title'        => 'Hãy Liên Hệ Với Chúng Tôi',
        'project.cta_button'       => 'Liên Hệ Ngay',
        'project.related'          => 'Dự Án Liên Quan',
    );
}

function tona_cms_register_ui_strings() {
    if ( ! function_exists( 'pll_register_string' ) ) {
        return;
    }

    foreach ( tona_cms_ui_string_defaults() as $key => $default_value ) {
        pll_register_string( $key, $default_value, 'Tona UI', true );
    }
}
add_action( 'init', 'tona_cms_register_ui_strings', 20 );
add_action( 'admin_init', 'tona_cms_register_ui_strings', 20 );
add_action( 'pll_init', 'tona_cms_register_ui_strings', 20 );

function tona_cms_register_ui_strings_admin_page() {
    add_submenu_page(
        'tona-site-settings',
        'Đồng Bộ Bản Dịch Giao Diện',
        'Đồng Bộ Bản Dịch Giao Diện',
        'manage_options',
        'tona-sync-ui-translations',
        'tona_cms_render_ui_strings_admin_page'
    );
}
add_action( 'admin_menu', 'tona_cms_register_ui_strings_admin_page' );

function tona_cms_render_ui_strings_admin_page() {
    if ( isset( $_POST['tona_sync_ui_translations'] ) && check_admin_referer( 'tona_sync_ui_translations' ) ) {
        tona_cms_register_ui_strings();
        echo '<div class="notice notice-success"><p>Đã đồng bộ chuỗi giao diện. Vào Ngôn ngữ > Bản dịch và lọc nhóm "Tona UI".</p></div>';
    }

    echo '<div class="wrap">';
    echo '<h1>Đồng Bộ Bản Dịch Giao Diện</h1>';
    echo '<p>Đăng ký các nhãn giao diện React vào phần dịch chuỗi của Polylang. Tiếng Việt là ngôn ngữ mặc định.</p>';
    echo '<form method="post">';
    wp_nonce_field( 'tona_sync_ui_translations' );
    echo '<p><button type="submit" name="tona_sync_ui_translations" class="button button-primary">Đồng Bộ Bản Dịch</button></p>';
    echo '</form>';
    echo '</div>';
}

function tona_cms_ui_strings_payload( $language = 'vi' ) {
    $payload = array();

    foreach ( tona_cms_ui_string_defaults() as $key => $default_value ) {
        $translated_value = 'vi' === $language
            ? $default_value
            : ( function_exists( 'pll__' ) ? pll__( $default_value ) : $default_value );
        $payload[ $key ] = $translated_value;
    }

    return $payload;
}
