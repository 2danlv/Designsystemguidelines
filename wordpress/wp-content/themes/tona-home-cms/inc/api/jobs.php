<?php
/**
 * Job payloads.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

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
        'jdUrl'        => tona_cms_text_field( $post_id, 'job_jd_url' ),
        'slots'        => (int) ( $slots ?: 1 ),
        'description'  => tona_cms_text_field( $post_id, 'job_description' ) ?: wp_strip_all_tags( get_the_content( null, false, $post ) ),
        'requirements' => tona_cms_lines_field( $post_id, 'job_requirements' ),
        'skills'       => tona_cms_lines_field( $post_id, 'job_skills' ),
        'benefits'     => tona_cms_lines_field( $post_id, 'job_benefits' ),
    );
}

function tona_cms_jobs_payload() {
    $jobs = get_posts(
        array_merge(
            array(
            'post_type'      => 'tona_job',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => array(
                'menu_order' => 'ASC',
                'date'       => 'DESC',
            ),
            ),
            tona_cms_language_query_args()
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
                        'icon'      => $perk['icon'] ?? '',
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
            'eyebrow'        => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_left', 'jobs_interns_Intro_left' ), 'jobs_interns_eyebrow' ),
            'title'          => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_left', 'jobs_interns_Intro_left' ), 'jobs_interns_title' ),
            'description'    => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_left', 'jobs_interns_Intro_left' ), 'jobs_interns_description' ),
            'seasonLabel'    => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_right', 'jobs_interns_Intro_right' ), 'jobs_interns_season_label' ),
            'slotsValue'     => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_right', 'jobs_interns_Intro_right' ), 'jobs_interns_slots_value' ),
            'slotsLabel'     => '',
            'majorsValue'    => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_right', 'jobs_interns_Intro_right' ), 'jobs_interns_majors_value' ),
            'majorsLabel'    => '',
            'note'           => tona_cms_group_text_field( $post_id, array( 'jobs_interns_intro_right', 'jobs_interns_Intro_right' ), 'jobs_interns_note' ),
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
        'applicationModal' => array(
            'description'              => tona_cms_text_field( $post_id, 'jobs_apply_description' ),
            'nameLabel'                => tona_cms_text_field( $post_id, 'jobs_apply_name_label' ),
            'namePlaceholder'          => tona_cms_text_field( $post_id, 'jobs_apply_name_placeholder' ),
            'emailLabel'               => tona_cms_text_field( $post_id, 'jobs_apply_email_label' ),
            'emailPlaceholder'         => tona_cms_text_field( $post_id, 'jobs_apply_email_placeholder' ),
            'phoneLabel'               => tona_cms_text_field( $post_id, 'jobs_apply_phone_label' ),
            'phonePlaceholder'         => tona_cms_text_field( $post_id, 'jobs_apply_phone_placeholder' ),
            'experienceLabel'          => tona_cms_text_field( $post_id, 'jobs_apply_experience_label' ),
            'experiencePlaceholder'    => tona_cms_text_field( $post_id, 'jobs_apply_experience_placeholder' ),
            'coverLetterLabel'         => tona_cms_text_field( $post_id, 'jobs_apply_cover_letter_label' ),
            'coverLetterPlaceholder'   => tona_cms_text_field( $post_id, 'jobs_apply_cover_letter_placeholder' ),
            'cvLabel'                  => tona_cms_text_field( $post_id, 'jobs_apply_cv_label' ),
            'cvHelpText'               => tona_cms_text_field( $post_id, 'jobs_apply_cv_help_text' ),
            'submitLabel'              => tona_cms_text_field( $post_id, 'jobs_apply_submit_label' ),
            'internTypeLabel'          => tona_cms_text_field( $post_id, 'jobs_apply_intern_type_label' ),
            'internDescription'        => tona_cms_text_field( $post_id, 'jobs_apply_intern_description' ),
            'universityLabel'          => tona_cms_text_field( $post_id, 'jobs_apply_university_label' ),
            'universityPlaceholder'    => tona_cms_text_field( $post_id, 'jobs_apply_university_placeholder' ),
            'majorLabel'               => tona_cms_text_field( $post_id, 'jobs_apply_major_label' ),
            'majorPlaceholder'         => tona_cms_text_field( $post_id, 'jobs_apply_major_placeholder' ),
            'schoolYearLabel'          => tona_cms_text_field( $post_id, 'jobs_apply_school_year_label' ),
            'schoolYearPlaceholder'    => tona_cms_text_field( $post_id, 'jobs_apply_school_year_placeholder' ),
            'startDateLabel'           => tona_cms_text_field( $post_id, 'jobs_apply_start_date_label' ),
            'startDatePlaceholder'     => tona_cms_text_field( $post_id, 'jobs_apply_start_date_placeholder' ),
            'internCvLabel'            => tona_cms_text_field( $post_id, 'jobs_apply_intern_cv_label' ),
            'internCvHelpText'         => tona_cms_text_field( $post_id, 'jobs_apply_intern_cv_help_text' ),
            'internSubmitLabel'        => tona_cms_text_field( $post_id, 'jobs_apply_intern_submit_label' ),
        ),
    );
}

