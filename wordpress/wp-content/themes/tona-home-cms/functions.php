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

    $default_terms = array(
        'tuyen-dung' => 'Tuyen Dung',
        'thuc-tap'   => 'Thuc Tap',
    );

    foreach ( $default_terms as $slug => $name ) {
        if ( ! term_exists( $slug, 'tona_job_category' ) ) {
            wp_insert_term(
                $name,
                'tona_job_category',
                array(
                    'slug' => $slug,
                )
            );
        }
    }
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

    $selected_terms = wp_get_object_terms(
        $post->ID,
        $taxonomy,
        array(
            'fields' => 'ids',
        )
    );
    $selected_term_id = ! is_wp_error( $selected_terms ) && ! empty( $selected_terms ) ? (int) $selected_terms[0] : 0;

    if ( ! $selected_term_id ) {
        $default_term = get_term_by( 'slug', 'tuyen-dung', $taxonomy );
        $selected_term_id = $default_term ? (int) $default_term->term_id : 0;
    }

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
    echo '<p class="description">Choose exactly one category. Tuyen Dung shows in the main jobs list, Thuc Tap shows in the internship section.</p>';
    echo '</div>';
}

function tona_cms_job_category_single_term( $post_id ) {
    if ( wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
        return;
    }

    $terms = wp_get_object_terms(
        $post_id,
        'tona_job_category',
        array(
            'fields' => 'ids',
        )
    );

    if ( is_wp_error( $terms ) ) {
        return;
    }

    if ( empty( $terms ) ) {
        $default_term = get_term_by( 'slug', 'tuyen-dung', 'tona_job_category' );

        if ( $default_term ) {
            wp_set_object_terms( $post_id, array( (int) $default_term->term_id ), 'tona_job_category', false );
        }

        return;
    }

    wp_set_object_terms( $post_id, array( (int) $terms[0] ), 'tona_job_category', false );
}
add_action( 'save_post_tona_job', 'tona_cms_job_category_single_term', 20 );

function tona_cms_job_admin_columns( $columns ) {
    $date_column = isset( $columns['date'] ) ? $columns['date'] : null;

    if ( isset( $columns['date'] ) ) {
        unset( $columns['date'] );
    }

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

    if ( is_wp_error( $terms ) || empty( $terms ) ) {
        echo '&mdash;';
        return;
    }

    echo esc_html( implode( ', ', wp_list_pluck( $terms, 'name' ) ) );
}
add_action( 'manage_tona_job_posts_custom_column', 'tona_cms_job_admin_column_content', 10, 2 );

function tona_cms_job_admin_category_filter() {
    $screen = get_current_screen();

    if ( ! $screen || 'edit-tona_job' !== $screen->id ) {
        return;
    }

    $selected = isset( $_GET['tona_job_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_job_category'] ) ) : '';

    wp_dropdown_categories(
        array(
            'show_option_all' => 'All Job Categories',
            'taxonomy'        => 'tona_job_category',
            'name'            => 'tona_job_category',
            'orderby'         => 'name',
            'selected'        => $selected,
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

    if ( ! is_admin() || 'edit.php' !== $pagenow || ! $query->is_main_query() ) {
        return;
    }

    if ( 'tona_job' !== $query->get( 'post_type' ) ) {
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

function tona_cms_register_project_post_type() {
    register_post_type(
        'tona_project',
        array(
            'labels'       => array(
                'name'          => 'Projects',
                'singular_name' => 'Project',
                'add_new_item'  => 'Add New Project',
                'edit_item'     => 'Edit Project',
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'menu_icon'    => 'dashicons-building',
            'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
            'rewrite'      => array( 'slug' => 'projects' ),
        )
    );

    register_taxonomy(
        'tona_project_category',
        'tona_project',
        array(
            'labels'       => array(
                'name'          => 'Project Categories',
                'singular_name' => 'Project Category',
                'add_new_item'  => 'Add New Project Category',
                'edit_item'     => 'Edit Project Category',
            ),
            'hierarchical' => true,
            'public'       => true,
            'show_ui'      => true,
            'show_in_rest' => true,
            'rewrite'      => array( 'slug' => 'project-category' ),
        )
    );

    $default_terms = array(
        'industrial'      => 'Industrial',
        'commercial'      => 'Commercial',
        'solar-rooftop'   => 'Solar Rooftop',
        'hotels'          => 'Hotels',
        'apartments'      => 'Apartments',
    );

    foreach ( $default_terms as $slug => $name ) {
        if ( ! term_exists( $slug, 'tona_project_category' ) ) {
            wp_insert_term(
                $name,
                'tona_project_category',
                array(
                    'slug' => $slug,
                )
            );
        }
    }
}
add_action( 'init', 'tona_cms_register_project_post_type' );

function tona_cms_project_admin_columns( $columns ) {
    $date_column = isset( $columns['date'] ) ? $columns['date'] : null;

    if ( isset( $columns['date'] ) ) {
        unset( $columns['date'] );
    }

    $columns['tona_project_category'] = 'Categories';

    if ( null !== $date_column ) {
        $columns['date'] = $date_column;
    }

    return $columns;
}
add_filter( 'manage_tona_project_posts_columns', 'tona_cms_project_admin_columns' );

function tona_cms_project_admin_column_content( $column, $post_id ) {
    if ( 'tona_project_category' !== $column ) {
        return;
    }

    $terms = get_the_terms( $post_id, 'tona_project_category' );

    if ( is_wp_error( $terms ) || empty( $terms ) ) {
        echo '&mdash;';
        return;
    }

    echo esc_html( implode( ', ', wp_list_pluck( $terms, 'name' ) ) );
}
add_action( 'manage_tona_project_posts_custom_column', 'tona_cms_project_admin_column_content', 10, 2 );

function tona_cms_project_admin_category_filter() {
    $screen = get_current_screen();

    if ( ! $screen || 'edit-tona_project' !== $screen->id ) {
        return;
    }

    $selected = isset( $_GET['tona_project_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_project_category'] ) ) : '';

    wp_dropdown_categories(
        array(
            'show_option_all' => 'All Project Categories',
            'taxonomy'        => 'tona_project_category',
            'name'            => 'tona_project_category',
            'orderby'         => 'name',
            'selected'        => $selected,
            'hierarchical'    => true,
            'depth'           => 0,
            'show_count'      => false,
            'hide_empty'      => false,
            'value_field'     => 'slug',
        )
    );
}
add_action( 'restrict_manage_posts', 'tona_cms_project_admin_category_filter' );

function tona_cms_project_admin_category_query( $query ) {
    global $pagenow;

    if ( ! is_admin() || 'edit.php' !== $pagenow || ! $query->is_main_query() ) {
        return;
    }

    if ( 'tona_project' !== $query->get( 'post_type' ) ) {
        return;
    }

    $category = isset( $_GET['tona_project_category'] ) ? sanitize_text_field( wp_unslash( $_GET['tona_project_category'] ) ) : '';

    if ( '' === $category || '0' === $category ) {
        return;
    }

    $query->set(
        'tax_query',
        array(
            array(
                'taxonomy' => 'tona_project_category',
                'field'    => 'slug',
                'terms'    => $category,
            ),
        )
    );
}
add_action( 'pre_get_posts', 'tona_cms_project_admin_category_query' );

function tona_cms_create_default_pages() {
    $pages = array(
        'doi-ngu' => 'Doi Ngu',
        'gioi-thieu-tona' => 'Gioi Thieu Tona',
        'cuoc-song-tona' => 'Cuoc Song Tona',
        'dich-vu' => 'Dich Vu',
        'nghe-nghiep' => 'Nghe Nghiep',
        'du-an-tona' => 'Du An Tona',
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
    $choices['cuoc-song-tona'] = 'Cuoc Song Tona';
    $choices['dich-vu'] = 'Dich Vu';
    $choices['nghe-nghiep'] = 'Nghe Nghiep';
    $choices['du-an-tona'] = 'Du An Tona';
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

    wp_enqueue_script(
        'tona-cms-acf-admin',
        get_stylesheet_directory_uri() . '/assets/js/acf-admin.js',
        array( 'jquery' ),
        '1.0.0',
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
            'breadcrumbLabel' => tona_cms_text_field( $post_id, 'culture_breadcrumb_label' ),
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
                function ( $theme ) {
                    return array(
                        'year'        => $theme['year'] ?? '',
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
                        'active'      => ! empty( $theme['active'] ),
                    );
                },
                is_array( $themes ) ? $themes : array()
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

function tona_cms_services_payload( $page ) {
    $post_id = $page->ID;
    $services = function_exists( 'get_field' ) ? get_field( 'services_items', $post_id ) : array();
    $process_steps = function_exists( 'get_field' ) ? get_field( 'services_process_steps', $post_id ) : array();

    return array(
        'id'     => $post_id,
        'slug'   => $page->post_name,
        'title'  => get_the_title( $page ),
        'colors' => array(
            'heroBackground'     => tona_cms_text_field( $post_id, 'services_hero_background' ),
            'servicesBackground' => tona_cms_text_field( $post_id, 'services_services_background' ),
            'processBackground'  => tona_cms_text_field( $post_id, 'services_process_background' ),
            'ctaBackground'      => tona_cms_text_field( $post_id, 'services_cta_background' ),
        ),
        'hero'   => array(
            'breadcrumbLabel' => tona_cms_text_field( $post_id, 'services_breadcrumb_label' ),
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

                    return array(
                        'icon'        => $service['icon'] ?? 'Wrench',
                        'iconImage'   => tona_cms_image_url( $service['icon_image'] ?? '' ),
                        'number'      => $service['number'] ?? '',
                        'tag'         => $service['tag'] ?? '',
                        'title'       => $service['title'] ?? '',
                        'subtitle'    => $service['subtitle'] ?? '',
                        'description' => $service['description'] ?? '',
                        'features'    => array_values(
                            array_filter(
                                array_map( 'trim', is_array( $features ) ? $features : array() )
                            )
                        ),
                        'image'       => tona_cms_image_url( $service['image'] ?? '' ),
                        'featured'    => null !== $featured_index ? $index === $featured_index : false,
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
        'cta' => array(
            'title'       => tona_cms_text_field( $post_id, 'services_cta_title' ),
            'description' => tona_cms_text_field( $post_id, 'services_cta_description' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'services_cta_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'services_cta_link_url' ),
        ),
    );
}

function tona_cms_services_unique_featured_card( $value, $post_id, $field ) {
    if ( ! is_array( $value ) ) {
        return $value;
    }

    $featured_found = false;

    foreach ( $value as $row_index => $row ) {
        if ( ! is_array( $row ) ) {
            continue;
        }

        $featured_key = array_key_exists( 'featured', $row ) ? 'featured' : 'field_tona_services_item_featured';

        if ( ! empty( $row[ $featured_key ] ) && ! $featured_found ) {
            $value[ $row_index ][ $featured_key ] = 1;
            $featured_found = true;
            continue;
        }

        $value[ $row_index ][ $featured_key ] = 0;
    }

    return $value;
}
add_filter( 'acf/update_value/name=services_items', 'tona_cms_services_unique_featured_card', 20, 3 );

function tona_cms_job_payload( $post ) {
    $post_id = $post->ID;
    $terms = get_the_terms( $post_id, 'tona_job_category' );
    $terms = is_array( $terms ) ? $terms : array();

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
        'department'   => tona_cms_text_field( $post_id, 'job_department' ),
        'location'     => tona_cms_text_field( $post_id, 'job_location' ),
        'type'         => tona_cms_text_field( $post_id, 'job_type' ),
        'level'        => tona_cms_text_field( $post_id, 'job_level' ),
        'date'         => tona_cms_text_field( $post_id, 'job_date' ),
        'salary'       => tona_cms_text_field( $post_id, 'job_salary' ),
        'slots'        => (int) ( function_exists( 'get_field' ) ? get_field( 'job_slots', $post_id ) : 1 ),
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
            'breadcrumbLabel' => tona_cms_text_field( $post_id, 'jobs_breadcrumb_label' ),
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
            'eyebrow'        => tona_cms_text_field( $post_id, 'jobs_interns_eyebrow' ),
            'title'          => tona_cms_text_field( $post_id, 'jobs_interns_title' ),
            'description'    => tona_cms_text_field( $post_id, 'jobs_interns_description' ),
            'seasonLabel'    => tona_cms_text_field( $post_id, 'jobs_interns_season_label' ),
            'slotsValue'     => tona_cms_text_field( $post_id, 'jobs_interns_slots_value' ),
            'slotsLabel'     => tona_cms_text_field( $post_id, 'jobs_interns_slots_label' ),
            'majorsValue'    => tona_cms_text_field( $post_id, 'jobs_interns_majors_value' ),
            'majorsLabel'    => tona_cms_text_field( $post_id, 'jobs_interns_majors_label' ),
            'note'           => tona_cms_text_field( $post_id, 'jobs_interns_note' ),
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
    $main_image_url = has_post_thumbnail( $post_id ) ? get_the_post_thumbnail_url( $post_id, 'large' ) : '';

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

    if ( $main_image_url && ! in_array( $main_image_url, $images, true ) ) {
        array_unshift( $images, $main_image_url );
    }

    if ( ! $main_image_url && ! empty( $gallery_images ) ) {
        $main_image_url = $gallery_images[0];
    }

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
        'location'        => tona_cms_text_field( $post_id, 'project_location' ),
        'area'            => tona_cms_text_field( $post_id, 'project_area' ),
        'client'          => tona_cms_text_field( $post_id, 'project_client' ),
        'status'          => tona_cms_text_field( $post_id, 'project_status' ),
        'year'            => tona_cms_text_field( $post_id, 'project_year' ),
        'duration'        => tona_cms_text_field( $post_id, 'project_duration' ),
        'renovationItems' => tona_cms_lines_field( $post_id, 'project_renovation_items' ),
        'highlights'      => tona_cms_lines_field( $post_id, 'project_highlights' ),
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
            'breadcrumbLabel' => tona_cms_text_field( $post_id, 'projects_breadcrumb_label' ),
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

function tona_cms_register_rest_routes() {
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

                if ( 'cuoc-song-tona' === $page->post_name ) {
                    return rest_ensure_response( tona_cms_culture_payload( $page ) );
                }

                if ( 'dich-vu' === $page->post_name ) {
                    return rest_ensure_response( tona_cms_services_payload( $page ) );
                }

                if ( 'nghe-nghiep' === $page->post_name ) {
                    return rest_ensure_response( tona_cms_jobs_page_payload( $page ) );
                }

                if ( 'du-an-tona' === $page->post_name ) {
                    return rest_ensure_response( tona_cms_projects_page_payload( $page ) );
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
