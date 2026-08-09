<?php
/**
 * Project payloads.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
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
        'renovationItems' => tona_cms_repeater_lines_field( $post_id, 'project_renovation_items', 'item' ),
        'highlights'      => tona_cms_repeater_lines_field( $post_id, 'project_highlights', 'item' ),
        'leedGold'        => (bool) ( function_exists( 'get_field' ) ? get_field( 'project_leed_gold', $post_id ) : false ),
    );
}

function tona_cms_projects_payload() {
    $projects = get_posts(
        array_merge(
            array(
            'post_type'      => 'tona_project',
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
        array_map( 'tona_cms_project_payload', is_array( $projects ) ? $projects : array() )
    );
}

function tona_cms_project_by_slug_payload( $slug ) {
    $projects = get_posts(
        array_merge(
            array(
                'post_type'      => 'tona_project',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'name'           => sanitize_title( $slug ),
            ),
            tona_cms_language_query_args()
        )
    );
    $project = ! empty( $projects[0] ) ? $projects[0] : null;

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

