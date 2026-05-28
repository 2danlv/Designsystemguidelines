<?php
/**
 * Applicants post type setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_register_applicant_post_type() {
    register_post_type(
        'tona_applicant',
        array(
            'labels'          => array(
                'name'          => 'Applicants',
                'singular_name' => 'Applicant',
                'add_new_item'  => 'Add New Applicant',
                'edit_item'     => 'Edit Applicant',
            ),
            'public'          => false,
            'show_ui'         => true,
            'show_in_menu'    => true,
            'show_in_rest'    => true,
            'menu_icon'       => 'dashicons-id',
            'supports'        => array( 'title' ),
            'capability_type' => 'post',
            'map_meta_cap'    => true,
            'capabilities'    => array(
                'create_posts'           => 'do_not_allow',
                'delete_post'            => 'do_not_allow',
                'delete_posts'           => 'do_not_allow',
                'delete_private_posts'   => 'do_not_allow',
                'delete_published_posts' => 'do_not_allow',
                'delete_others_posts'    => 'do_not_allow',
            ),
        )
    );
}
add_action( 'init', 'tona_cms_register_applicant_post_type' );

function tona_cms_block_applicant_create_delete_caps( $caps, $cap, $user_id, $args ) {
    if ( in_array( $cap, array( 'delete_post', 'delete_posts' ), true ) ) {
        $post_id = isset( $args[0] ) ? (int) $args[0] : 0;

        if ( $post_id && 'tona_applicant' === get_post_type( $post_id ) ) {
            return array( 'do_not_allow' );
        }
    }

    return $caps;
}
add_filter( 'map_meta_cap', 'tona_cms_block_applicant_create_delete_caps', 10, 4 );

function tona_cms_redirect_applicant_new_screen() {
    global $pagenow;

    if (
        is_admin()
        && 'post-new.php' === $pagenow
        && 'tona_applicant' === ( $_GET['post_type'] ?? '' )
    ) {
        wp_safe_redirect( admin_url( 'edit.php?post_type=tona_applicant' ) );
        exit;
    }
}
add_action( 'admin_init', 'tona_cms_redirect_applicant_new_screen' );

function tona_cms_remove_applicant_add_new_submenu() {
    remove_submenu_page( 'edit.php?post_type=tona_applicant', 'post-new.php?post_type=tona_applicant' );
}
add_action( 'admin_menu', 'tona_cms_remove_applicant_add_new_submenu', 999 );

function tona_cms_applicant_new_count() {
    $query = new WP_Query(
        array(
            'post_type'      => 'tona_applicant',
            'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_key'       => 'applicant_status',
            'meta_value'     => 'new',
        )
    );

    return (int) $query->found_posts;
}

function tona_cms_add_applicant_menu_badge() {
    global $menu;

    $count = tona_cms_applicant_new_count();

    if ( $count < 1 || ! is_array( $menu ) ) {
        return;
    }

    foreach ( $menu as $index => $item ) {
        if ( isset( $item[2] ) && 'edit.php?post_type=tona_applicant' === $item[2] ) {
            $menu[ $index ][0] .= sprintf(
                ' <span class="awaiting-mod count-%1$d"><span class="pending-count">%1$d</span></span>',
                $count
            );
            break;
        }
    }
}
add_action( 'admin_menu', 'tona_cms_add_applicant_menu_badge', 1000 );

function tona_cms_applicant_row_actions( $actions, $post ) {
    if ( $post && 'tona_applicant' === $post->post_type ) {
        unset( $actions['inline hide-if-no-js'], $actions['trash'], $actions['delete'] );
    }

    return $actions;
}
add_filter( 'post_row_actions', 'tona_cms_applicant_row_actions', 10, 2 );

function tona_cms_applicant_bulk_actions( $actions ) {
    unset( $actions['trash'], $actions['delete'] );

    return $actions;
}
add_filter( 'bulk_actions-edit-tona_applicant', 'tona_cms_applicant_bulk_actions' );

function tona_cms_applicant_admin_columns( $columns ) {
    $date_column = isset( $columns['date'] ) ? $columns['date'] : null;

    unset( $columns['date'] );
    $columns['applicant_status']   = 'Status';
    $columns['applicant_position'] = 'Position';
    $columns['applicant_type']     = 'Type';
    $columns['applicant_email']    = 'Email';
    $columns['applicant_phone']    = 'Phone';
    $columns['applicant_cv']       = 'CV';

    if ( null !== $date_column ) {
        $columns['date'] = $date_column;
    }

    return $columns;
}
add_filter( 'manage_tona_applicant_posts_columns', 'tona_cms_applicant_admin_columns' );

function tona_cms_applicant_admin_column_content( $column, $post_id ) {
    $meta_map = array(
        'applicant_status'   => 'applicant_status',
        'applicant_position' => 'applicant_position',
        'applicant_type'     => 'applicant_type',
        'applicant_email'    => 'applicant_email',
        'applicant_phone'    => 'applicant_phone',
    );

    if ( isset( $meta_map[ $column ] ) ) {
        $value = get_post_meta( $post_id, $meta_map[ $column ], true ) ?: '-';

        if ( 'applicant_status' === $column && '-' !== $value ) {
            echo wp_kses_post( tona_cms_applicant_status_badge( $value ) );
            return;
        }

        echo esc_html( $value );
    }

    if ( 'applicant_cv' === $column ) {
        echo wp_kses_post( tona_cms_applicant_cv_link( $post_id ) );
    }
}
add_action( 'manage_tona_applicant_posts_custom_column', 'tona_cms_applicant_admin_column_content', 10, 2 );

function tona_cms_applicant_status_badge( $status ) {
    $labels = array(
        'new'       => 'New',
        'reviewing' => 'Reviewing',
        'interview' => 'Interview',
        'hired'     => 'Hired',
        'rejected'  => 'Rejected',
    );
    $colors = array(
        'new'       => array( '#e8f2ff', '#0b5cab' ),
        'reviewing' => array( '#fff7e6', '#9a5b00' ),
        'interview' => array( '#f2e8ff', '#673ab7' ),
        'hired'     => array( '#e8f7ef', '#167044' ),
        'rejected'  => array( '#fdecec', '#b42318' ),
    );
    $status_key = sanitize_key( $status );
    $label      = $labels[ $status_key ] ?? $status;
    $color_pair = $colors[ $status_key ] ?? array( '#f0f0f1', '#50575e' );

    return sprintf(
        '<span class="tona-applicant-status tona-applicant-status-%1$s" style="display:inline-flex;align-items:center;border-radius:999px;padding:4px 10px;background:%2$s;color:%3$s;font-weight:700;font-size:12px;line-height:1.2;">%4$s</span>',
        esc_attr( $status_key ),
        esc_attr( $color_pair[0] ),
        esc_attr( $color_pair[1] ),
        esc_html( $label )
    );
}

function tona_cms_hide_applicant_data_acf_fields( $field ) {
    global $post;

    if (
        ! $post
        || 'tona_applicant' !== get_post_type( $post )
        || empty( $field['name'] )
        || 0 !== strpos( (string) $field['name'], 'applicant_' )
        || 'applicant_status' === $field['name']
    ) {
        return $field;
    }

    return false;
}
add_filter( 'acf/prepare_field', 'tona_cms_hide_applicant_data_acf_fields', 20 );

function tona_cms_applicant_cv_link( $post_id ) {
    $attachment_id = (int) get_post_meta( $post_id, 'applicant_cv', true );
    $url           = $attachment_id ? wp_get_attachment_url( $attachment_id ) : '';

    if ( ! $url ) {
        return '-';
    }

    $label = get_the_title( $attachment_id ) ?: 'Download CV';

    return '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $label ) . '</a>';
}

function tona_cms_add_applicant_information_metabox() {
    add_meta_box(
        'tona_applicant_information',
        'Submitted Applicant Information',
        'tona_cms_render_applicant_information_metabox',
        'tona_applicant',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes_tona_applicant', 'tona_cms_add_applicant_information_metabox' );

function tona_cms_render_applicant_information_metabox( $post ) {
    $rows = array(
        'Application Status'   => tona_cms_applicant_status_badge( get_post_meta( $post->ID, 'applicant_status', true ) ?: 'new' ),
        'Application Type'     => get_post_meta( $post->ID, 'applicant_type', true ),
        'Position'             => get_post_meta( $post->ID, 'applicant_position', true ),
        'Full Name'            => get_post_meta( $post->ID, 'applicant_name', true ),
        'Email'                => get_post_meta( $post->ID, 'applicant_email', true ),
        'Phone'                => get_post_meta( $post->ID, 'applicant_phone', true ),
        'CV File'              => tona_cms_applicant_cv_link( $post->ID ),
        'Experience'           => get_post_meta( $post->ID, 'applicant_experience', true ),
        'University'           => get_post_meta( $post->ID, 'applicant_university', true ),
        'Major'                => get_post_meta( $post->ID, 'applicant_major', true ),
        'School Year'          => get_post_meta( $post->ID, 'applicant_school_year', true ),
        'Available Start Date' => get_post_meta( $post->ID, 'applicant_start_date', true ),
        'Message'              => get_post_meta( $post->ID, 'applicant_message', true ),
    );
    ?>
    <style>
        .tona-applicant-info {
            width: 100%;
            border-collapse: collapse;
        }
        .tona-applicant-info th,
        .tona-applicant-info td {
            padding: 12px 14px;
            border-bottom: 1px solid #dcdcde;
            text-align: left;
            vertical-align: top;
        }
        .tona-applicant-info th {
            width: 220px;
            color: #1d2327;
            background: #f6f7f7;
            font-weight: 600;
        }
        .tona-applicant-info td {
            white-space: pre-wrap;
        }
    </style>
    <table class="tona-applicant-info">
        <tbody>
            <?php foreach ( $rows as $label => $value ) : ?>
                <tr>
                    <th><?php echo esc_html( $label ); ?></th>
                    <td>
                        <?php
                        if ( in_array( $label, array( 'CV File', 'Application Status' ), true ) ) {
                            echo wp_kses_post( $value );
                        } else {
                            echo esc_html( '' !== (string) $value ? $value : '-' );
                        }
                        ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <?php
}
