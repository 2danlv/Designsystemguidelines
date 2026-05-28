<?php
/**
 * Applicant submission payloads.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_submit_applicant_payload( $request ) {
    $params = array();

    if ( $request instanceof WP_REST_Request ) {
        $request_params = $request->get_params();
        $json_params    = $request->get_json_params();
        $params         = array_merge(
            is_array( $request_params ) ? $request_params : array(),
            is_array( $json_params ) ? $json_params : array()
        );
    }

    $name = sanitize_text_field( $params['name'] ?? '' );
    $email = sanitize_email( $params['email'] ?? '' );
    $phone = sanitize_text_field( $params['phone'] ?? '' );
    $position = sanitize_text_field( $params['position'] ?? '' );
    $application_type = sanitize_text_field( $params['type'] ?? 'Job' );

    if ( '' === $name || '' === $email || '' === $phone ) {
        return new WP_Error( 'tona_applicant_missing_fields', 'Name, email and phone are required.', array( 'status' => 400 ) );
    }

    $post_id = wp_insert_post(
        array(
            'post_type'   => 'tona_applicant',
            'post_status' => 'private',
            'post_title'  => trim( $name . ( $position ? ' - ' . $position : '' ) ),
        ),
        true
    );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'tona_applicant_create_failed', 'Could not create applicant.', array( 'status' => 500 ) );
    }

    $meta_fields = array(
        'applicant_status'      => 'new',
        'applicant_type'        => $application_type,
        'applicant_position'    => $position,
        'applicant_name'        => $name,
        'applicant_email'       => $email,
        'applicant_phone'       => $phone,
        'applicant_experience'  => sanitize_text_field( $params['experience'] ?? '' ),
        'applicant_university'  => sanitize_text_field( $params['university'] ?? '' ),
        'applicant_major'       => sanitize_text_field( $params['major'] ?? '' ),
        'applicant_school_year' => sanitize_text_field( $params['schoolYear'] ?? '' ),
        'applicant_start_date'  => sanitize_text_field( $params['startDate'] ?? '' ),
        'applicant_message'     => sanitize_textarea_field( $params['message'] ?? '' ),
    );

    foreach ( $meta_fields as $meta_key => $meta_value ) {
        update_post_meta( $post_id, $meta_key, $meta_value );
    }

    $files = $request instanceof WP_REST_Request ? $request->get_file_params() : array();

    if ( ! empty( $files['cv']['tmp_name'] ) ) {
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $uploaded = wp_handle_upload(
            $files['cv'],
            array(
                'test_form' => false,
                'mimes'     => array(
                    'pdf'  => 'application/pdf',
                    'doc'  => 'application/msword',
                    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ),
            )
        );

        if ( is_array( $uploaded ) && empty( $uploaded['error'] ) ) {
            $file_path = $uploaded['file'];
            $file_type = wp_check_filetype( basename( $file_path ), null );
            $attachment_id = wp_insert_attachment(
                array(
                    'post_mime_type' => $file_type['type'] ?? '',
                    'post_title'     => sanitize_file_name( basename( $file_path ) ),
                    'post_content'   => '',
                    'post_status'    => 'inherit',
                ),
                $file_path,
                $post_id
            );

            if ( ! is_wp_error( $attachment_id ) ) {
                wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $file_path ) );
                update_post_meta( $post_id, 'applicant_cv', $attachment_id );
            }
        }
    }

    return array(
        'success' => true,
        'id'      => $post_id,
    );
}
