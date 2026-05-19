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
        'doi-ngu' => array(
            'title'    => 'Doi Ngu',
            'template' => 'templates/tona-members.php',
        ),
        'gioi-thieu-tona' => array(
            'title'    => 'Gioi Thieu Tona',
            'template' => 'templates/tona-about.php',
        ),
        'cuoc-song-tona' => array(
            'title'    => 'Cuoc Song Tona',
            'template' => 'templates/tona-culture.php',
        ),
        'dich-vu' => array(
            'title'    => 'Dich Vu',
            'template' => 'templates/tona-services.php',
        ),
        'nghe-nghiep' => array(
            'title'    => 'Nghe Nghiep',
            'template' => 'templates/tona-jobs.php',
        ),
        'du-an-tona' => array(
            'title'    => 'Du An Tona',
            'template' => 'templates/tona-projects.php',
        ),
    );

    foreach ( $pages as $slug => $page_config ) {
        $page = get_page_by_path( $slug, OBJECT, 'page' );

        if ( $page ) {
            update_post_meta( $page->ID, '_wp_page_template', $page_config['template'] );
            continue;
        }

        $page_id = wp_insert_post(
            array(
                'post_type'    => 'page',
                'post_status'  => 'publish',
                'post_title'   => $page_config['title'],
                'post_name'    => $slug,
                'post_content' => '',
            )
        );

        if ( $page_id && ! is_wp_error( $page_id ) ) {
            update_post_meta( $page_id, '_wp_page_template', $page_config['template'] );
        }
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

function tona_cms_normalize_acf_field_group_location( $field_group ) {
    if ( ! is_array( $field_group ) || empty( $field_group['key'] ) ) {
        return $field_group;
    }

    $template_locations = array(
        'group_tona_members_page'  => 'templates/tona-members.php',
        'group_tona_about_page'    => 'templates/tona-about.php',
        'group_tona_culture_page'  => 'templates/tona-culture.php',
        'group_tona_services_page' => 'templates/tona-services.php',
        'group_tona_jobs_page'     => 'templates/tona-jobs.php',
        'group_tona_projects_page' => 'templates/tona-projects.php',
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

function tona_cms_about_load_fields( $fields, $parent ) {
    $parent_key = tona_cms_acf_parent_key( $parent );

    if ( 'group_tona_about_page' !== $parent_key ) {
        return $fields;
    }

    foreach ( tona_cms_about_background_field_map() as $after_key => $field ) {
        $fields = tona_cms_insert_acf_field_after( $fields, $after_key, $field );
    }

    return $fields;
}
add_filter( 'acf/load_fields', 'tona_cms_about_load_fields', 20, 2 );

function tona_cms_culture_yearly_themes_acf_field( $field ) {
    if ( empty( $field['sub_fields'] ) || ! is_array( $field['sub_fields'] ) ) {
        return $field;
    }

    $field['sub_fields'] = array_values(
        array_filter(
            $field['sub_fields'],
            function ( $sub_field ) {
                return 'field_tona_culture_theme_active' !== ( $sub_field['key'] ?? '' );
            }
        )
    );

    return $field;
}
add_filter( 'acf/load_field/key=field_tona_culture_yearly_themes', 'tona_cms_culture_yearly_themes_acf_field', 20 );

function tona_cms_remove_breadcrumb_label_fields( $fields, $parent ) {
    if ( ! is_array( $fields ) ) {
        return $fields;
    }

    return array_values(
        array_filter(
            $fields,
            function ( $field ) {
                return ! preg_match( '/_breadcrumb_label$/', $field['name'] ?? '' );
            }
        )
    );
}
add_filter( 'acf/load_fields', 'tona_cms_remove_breadcrumb_label_fields', 25, 2 );

function tona_cms_jobs_page_load_fields( $fields, $parent ) {
    $parent_key = tona_cms_acf_parent_key( $parent );

    if ( 'group_tona_jobs_page' !== $parent_key || ! is_array( $fields ) ) {
        return $fields;
    }

    return array_values(
        array_filter(
            $fields,
            function ( $field ) {
                return ! in_array(
                    $field['key'] ?? '',
                    array(
                        'field_tona_jobs_interns_slots_label',
                        'field_tona_jobs_interns_majors_label',
                    ),
                    true
                );
            }
        )
    );
}
add_filter( 'acf/load_fields', 'tona_cms_jobs_page_load_fields', 20, 2 );

function tona_cms_jobs_interns_slots_value_acf_field( $field ) {
    $field['label'] = 'Internship Slots';
    $field['instructions'] = '';
    $field['wrapper']['width'] = '40';
    return $field;
}
add_filter( 'acf/load_field/key=field_tona_jobs_interns_slots_value', 'tona_cms_jobs_interns_slots_value_acf_field', 20 );

function tona_cms_jobs_interns_majors_value_acf_field( $field ) {
    $field['label'] = 'Majors Count';
    $field['instructions'] = '';
    $field['wrapper']['width'] = '40';
    return $field;
}
add_filter( 'acf/load_field/key=field_tona_jobs_interns_majors_value', 'tona_cms_jobs_interns_majors_value_acf_field', 20 );

function tona_cms_services_items_acf_field( $field ) {
    if ( empty( $field['sub_fields'] ) || ! is_array( $field['sub_fields'] ) ) {
        return $field;
    }

    $field['sub_fields'] = array_values(
        array_filter(
            $field['sub_fields'],
            function ( $sub_field ) {
                return 'field_tona_services_item_tag' !== ( $sub_field['key'] ?? '' );
            }
        )
    );

    return $field;
}
add_filter( 'acf/load_field/key=field_tona_services_items', 'tona_cms_services_items_acf_field', 20 );

function tona_cms_jobs_interns_intro_left_acf_field( $field ) {
    $field['label'] = 'Internship Intro Left';
    $field['name'] = 'jobs_interns_intro_left';
    return $field;
}
add_filter( 'acf/load_field/key=field_6a0c927692087', 'tona_cms_jobs_interns_intro_left_acf_field', 20 );

function tona_cms_jobs_interns_intro_right_acf_field( $field ) {
    $field['label'] = 'Internship Summary Right';
    $field['name'] = 'jobs_interns_intro_right';
    return $field;
}
add_filter( 'acf/load_field/key=field_6a0c92aa92088', 'tona_cms_jobs_interns_intro_right_acf_field', 20 );

function tona_cms_about_hero_left_acf_field( $field ) {
    $field['label'] = 'Hero Intro Left';
    $field['name'] = 'about_hero_intro_left';
    return $field;
}
add_filter( 'acf/load_field/key=field_6a0c957f227a9', 'tona_cms_about_hero_left_acf_field', 20 );

function tona_cms_about_hero_right_acf_field( $field ) {
    $field['label'] = 'Hero Stats Right';
    $field['name'] = 'about_hero_stats_right';
    return $field;
}
add_filter( 'acf/load_field/key=field_6a0c95b1227aa', 'tona_cms_about_hero_right_acf_field', 20 );

function tona_cms_project_summary_acf_field( $field ) {
    $field['type'] = 'repeater';
    $field['label'] = 'Project Summary Items';
    $field['name'] = 'project_summary';
    $field['_name'] = 'project_summary';
    $field['instructions'] = 'Each row is one project info item shown on the project card/detail specs.';
    $field['wrapper'] = array(
        'width' => '',
        'class' => 'tona-acf-section',
        'id'    => '',
    );
    $field['collapsed'] = 'field_tona_project_summary_item_value';
    $field['min'] = 0;
    $field['max'] = 6;
    $field['layout'] = 'table';
    $field['button_label'] = 'Add Summary Item';
    $field['rows_per_page'] = 20;
    $field['sub_fields'] = array(
        array(
            'ID'                => 0,
            'key'               => 'field_tona_project_summary_item_key',
            '_key'              => 'field_tona_project_summary_item_key',
            'label'             => 'Item',
            'name'              => 'field',
            '_name'             => 'field',
            'type'              => 'select',
            'instructions'      => '',
            'required'          => 0,
            'conditional_logic' => 0,
            'wrapper'           => array(
                'width' => '35',
                'class' => '',
                'id'    => '',
            ),
            'choices'           => array(
                'client'   => 'Client',
                'location' => 'Location',
                'area'     => 'Area',
                'duration' => 'Duration',
                'status'   => 'Status',
                'year'     => 'Year',
            ),
            'default_value'     => 'client',
            'return_format'     => 'value',
            'multiple'          => 0,
            'allow_null'        => 0,
            'ui'                => 1,
            'ajax'              => 0,
            'placeholder'       => '',
            'parent_repeater'   => 'field_tona_project_summary',
        ),
        array(
            'ID'                => 0,
            'key'               => 'field_tona_project_summary_item_value',
            '_key'              => 'field_tona_project_summary_item_value',
            'label'             => 'Value',
            'name'              => 'value',
            '_name'             => 'value',
            'type'              => 'text',
            'instructions'      => 'Enter the value for this summary item.',
            'required'          => 0,
            'conditional_logic' => 0,
            'wrapper'           => array(
                'width' => '65',
                'class' => '',
                'id'    => '',
            ),
            'default_value'     => '',
            'maxlength'         => '',
            'placeholder'       => '',
            'prepend'           => '',
            'append'            => '',
            'parent_repeater'   => 'field_tona_project_summary',
        ),
    );

    return $field;
}
add_filter( 'acf/load_field/key=field_tona_project_summary', 'tona_cms_project_summary_acf_field', 20 );

function tona_cms_project_line_repeater_acf_field( $field, $label, $name, $sub_field_key, $button_label ) {
    $field['type'] = 'repeater';
    $field['label'] = $label;
    $field['name'] = $name;
    $field['_name'] = $name;
    $field['instructions'] = 'Each row is one item.';
    $field['wrapper'] = array(
        'width' => '',
        'class' => 'tona-acf-section',
        'id'    => '',
    );
    $field['collapsed'] = $sub_field_key;
    $field['min'] = 0;
    $field['max'] = 0;
    $field['layout'] = 'table';
    $field['button_label'] = $button_label;
    $field['rows_per_page'] = 20;
    $field['sub_fields'] = array(
        array(
            'ID'                => 0,
            'key'               => $sub_field_key,
            '_key'              => $sub_field_key,
            'label'             => 'Item',
            'name'              => 'item',
            '_name'             => 'item',
            'type'              => 'text',
            'instructions'      => '',
            'required'          => 0,
            'conditional_logic' => 0,
            'wrapper'           => array(
                'width' => '',
                'class' => '',
                'id'    => '',
            ),
            'default_value'     => '',
            'maxlength'         => '',
            'placeholder'       => '',
            'prepend'           => '',
            'append'            => '',
            'parent_repeater'   => $field['key'],
        ),
    );

    return $field;
}

function tona_cms_project_renovation_items_acf_field( $field ) {
    return tona_cms_project_line_repeater_acf_field(
        $field,
        'Construction Items',
        'project_renovation_items',
        'field_tona_project_renovation_item_text',
        'Add Construction Item'
    );
}
add_filter( 'acf/load_field/key=field_tona_project_renovation_items', 'tona_cms_project_renovation_items_acf_field', 20 );

function tona_cms_project_highlights_acf_field( $field ) {
    return tona_cms_project_line_repeater_acf_field(
        $field,
        'Highlights',
        'project_highlights',
        'field_tona_project_highlight_text',
        'Add Highlight'
    );
}
add_filter( 'acf/load_field/key=field_tona_project_highlights', 'tona_cms_project_highlights_acf_field', 20 );

function tona_cms_migrate_project_lines_to_repeater( $post_id, $field_name, $field_key, $sub_field_name, $sub_field_key ) {
    $raw_value = get_post_meta( $post_id, $field_name, true );

    if ( ! is_string( $raw_value ) || '' === trim( $raw_value ) || preg_match( '/^\d+$/', trim( $raw_value ) ) ) {
        return;
    }

    $items = array_values(
        array_filter(
            array_map( 'trim', preg_split( '/\R+/', $raw_value ) )
        )
    );

    if ( empty( $items ) ) {
        return;
    }

    update_post_meta( $post_id, $field_name, count( $items ) );
    update_post_meta( $post_id, '_' . $field_name, $field_key );

    foreach ( $items as $index => $item ) {
        $row_key = $field_name . '_' . $index . '_' . $sub_field_name;
        update_post_meta( $post_id, $row_key, $item );
        update_post_meta( $post_id, '_' . $row_key, $sub_field_key );
    }
}

function tona_cms_migrate_project_repeaters_on_edit() {
    $post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

    if ( ! $post_id || 'tona_project' !== get_post_type( $post_id ) ) {
        return;
    }

    tona_cms_migrate_project_lines_to_repeater(
        $post_id,
        'project_renovation_items',
        'field_tona_project_renovation_items',
        'item',
        'field_tona_project_renovation_item_text'
    );
    tona_cms_migrate_project_lines_to_repeater(
        $post_id,
        'project_highlights',
        'field_tona_project_highlights',
        'item',
        'field_tona_project_highlight_text'
    );
}
add_action( 'load-post.php', 'tona_cms_migrate_project_repeaters_on_edit' );

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
        '1.0.1'
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
        'field_tona_members_hero_title' => array(
            'label'        => 'TiÃªu Ä‘á» Hero',
            'instructions' => 'TiÃªu Ä‘á» lá»›n trong trÃªn Ä‘áº§u trang. CÃ³ thá»ƒ xuá»‘ng dÃ²ng.',
        ),
        'field_tona_members_hero_description' => array(
            'label'        => 'MÃ´ táº£ Hero',
            'instructions' => 'Äoáº¡n mÃ´ táº£ ngáº¯n ngay dÆ°á»›i tiÃªu Ä‘á».',
        ),
        'field_tona_members_tab_leadership' => array( 'label' => '02. Cards lÃ£nh Ä‘áº¡o' ),
        'field_tona_members_leadership' => array(
            'label'        => 'Danh sÃ¡ch card lÃ£nh Ä‘áº¡o',
            'instructions' => 'Má»—i dÃ²ng lÃ  má»™t card chÃ¢n dung trÃªn giao diá»‡n. KÃ©o Ä‘á»ƒ Ä‘á»•i thá»© tá»± hiá»ƒn thá»‹.',
        ),
        'field_tona_members_member_id' => array(
            'label'        => 'ID',
            'instructions' => 'CÃ³ thá»ƒ Ä‘á»ƒ trá»‘ng. Chá»‰ dÃ¹ng ná»™i bá»™.',
        ),
        'field_tona_members_member_name' => array( 'label' => 'TÃªn' ),
        'field_tona_members_member_role' => array( 'label' => 'Chá»©c danh' ),
        'field_tona_members_member_role_en' => array( 'label' => 'Chá»©c danh EN' ),
        'field_tona_members_member_image' => array(
            'label'        => 'áº¢nh chÃ¢n dung',
        ),
        'field_tona_members_member_bio' => array( 'label' => 'MÃ´ táº£ ngáº¯n' ),
        'field_tona_members_member_linkedin' => array( 'label' => 'LinkedIn' ),
        'field_tona_members_tab_values' => array( 'label' => '03. GiÃ¡ trá»‹' ),
        'field_tona_members_values_title' => array(
            'label'        => 'TiÃªu Ä‘á» section',
            'instructions' => 'Heading cá»§a khu vá»±c ná»n xanh Ä‘áº­m á»Ÿ giá»¯a trang.',
        ),
        'field_tona_members_values' => array(
            'label'        => 'Danh sÃ¡ch Ã´ giÃ¡ trá»‹',
            'instructions' => 'Má»—i dÃ²ng lÃ  má»™t Ã´ trong grid giÃ¡ trá»‹.',
        ),
        'field_tona_members_value_icon' => array( 'label' => 'Icon' ),
        'field_tona_members_value_title' => array( 'label' => 'TiÃªu Ä‘á» Ã´' ),
        'field_tona_members_value_description' => array( 'label' => 'MÃ´ táº£ Ã´' ),
        'field_tona_members_tab_teaser' => array( 'label' => '04. CTA cuá»‘i trang' ),
        'field_tona_members_teaser_title' => array(
            'label'        => 'TiÃªu Ä‘á» CTA',
            'instructions' => 'TiÃªu Ä‘á» block ná»n tráº¯ng cuá»‘i trang.',
            'wrapper'      => array(
                'width' => '50',
                'class' => 'tona-cta-title',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_description' => array(
            'label'   => 'MÃ´ táº£ CTA',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-description',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_link_label' => array(
            'label'   => 'Chá»¯ trÃªn nÃºt',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-button-label',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_link_url' => array(
            'label'   => 'Trang Ä‘Ã­ch cá»§a nÃºt',
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

function tona_cms_prepare_members_field_clean_labels( $field ) {
    if ( ! tona_cms_is_page_editor_screen() ) {
        return $field;
    }

    $field_map = array(
        'field_tona_members_tab_hero' => array( 'label' => '01. Hero' ),
        'field_tona_members_hero_title' => array(
            'label'        => 'Hero Title',
            'instructions' => 'Large heading at the top of the page. Line breaks are allowed.',
        ),
        'field_tona_members_hero_description' => array(
            'label'        => 'Hero Description',
            'instructions' => 'Short paragraph below the hero title.',
        ),
        'field_tona_members_tab_leadership' => array( 'label' => '02. Leadership Cards' ),
        'field_tona_members_leadership' => array(
            'label'        => 'Leadership Members',
            'instructions' => 'Each row is one portrait card. Drag rows to change the display order.',
        ),
        'field_tona_members_member_id' => array(
            'label'        => 'ID',
            'instructions' => 'Optional internal ID.',
        ),
        'field_tona_members_member_name' => array( 'label' => 'Name' ),
        'field_tona_members_member_role' => array( 'label' => 'Role' ),
        'field_tona_members_member_role_en' => array( 'label' => 'Role EN' ),
        'field_tona_members_member_image' => array( 'label' => 'Portrait Image' ),
        'field_tona_members_member_bio' => array( 'label' => 'Short Bio' ),
        'field_tona_members_member_linkedin' => array( 'label' => 'LinkedIn' ),
        'field_tona_members_tab_values' => array( 'label' => '03. Core Values' ),
        'field_tona_members_values_title' => array(
            'label'        => 'Values Section Title',
            'instructions' => 'Heading for the values section.',
        ),
        'field_tona_members_values' => array(
            'label'        => 'Values',
            'instructions' => 'Each row is one card in the values grid.',
        ),
        'field_tona_members_value_icon' => array( 'label' => 'Icon' ),
        'field_tona_members_value_title' => array( 'label' => 'Card Title' ),
        'field_tona_members_value_description' => array( 'label' => 'Card Description' ),
        'field_tona_members_tab_teaser' => array( 'label' => '04. Footer CTA' ),
        'field_tona_members_teaser_title' => array(
            'label'        => 'CTA Title',
            'instructions' => 'Title for the white CTA block at the bottom of the page.',
            'wrapper'      => array(
                'width' => '50',
                'class' => 'tona-cta-title',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_description' => array(
            'label'   => 'CTA Description',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-description',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_link_label' => array(
            'label'   => 'Button Label',
            'wrapper' => array(
                'width' => '50',
                'class' => 'tona-cta-button-label',
                'id'    => '',
            ),
        ),
        'field_tona_members_teaser_link_url' => array(
            'label'   => 'Button Target Page',
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
add_filter( 'acf/prepare_field', 'tona_cms_prepare_members_field_clean_labels', 20 );

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
            'breadcrumbLabel' => get_the_title( $page ),
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
