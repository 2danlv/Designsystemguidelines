<?php
/**
 * News payloads.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_news_terms_payload( $post_id, $taxonomy ) {
    $terms = get_the_terms( $post_id, $taxonomy );

    if ( is_wp_error( $terms ) || ! is_array( $terms ) ) {
        return array();
    }

    return array_values(
        array_map(
            function ( $term ) {
                return array(
                    'id'   => $term->term_id,
                    'name' => tona_cms_decode_text( $term->name ),
                    'slug' => $term->slug,
                );
            },
            $terms
        )
    );
}

function tona_cms_news_payload( $post ) {
    $post_id = $post->ID;
    $categories = tona_cms_news_terms_payload( $post_id, 'tona_news_category' );
    $tags = tona_cms_news_terms_payload( $post_id, 'tona_news_tag' );
    $image = get_the_post_thumbnail_url( $post, 'large' );
    $author_name = tona_cms_text_field( $post_id, 'news_author_name' );

    return array(
        'id'           => $post_id,
        'slug'         => $post->post_name,
        'title'        => tona_cms_decode_text( get_the_title( $post ) ),
        'date'         => get_the_date( 'd/m/Y', $post ),
        'category'     => ! empty( $categories ) ? $categories[0]['name'] : '',
        'categorySlug' => ! empty( $categories ) ? $categories[0]['slug'] : '',
        'categories'   => $categories,
        'tags'         => array_values( wp_list_pluck( $tags, 'name' ) ),
        'image'        => $image ? esc_url_raw( $image ) : '',
        'excerpt'      => tona_cms_decode_text( has_excerpt( $post ) ? get_the_excerpt( $post ) : wp_trim_words( wp_strip_all_tags( $post->post_content ), 32 ) ),
        'content'      => apply_filters( 'the_content', $post->post_content ),
        'author'       => $author_name ?: tona_cms_decode_text( get_the_author_meta( 'display_name', (int) $post->post_author ) ),
    );
}

function tona_cms_related_news_payload( $post, $limit = 3 ) {
    $terms = get_the_terms( $post->ID, 'tona_news_category' );

    if ( is_wp_error( $terms ) || empty( $terms ) ) {
        return array();
    }

    $related_posts = get_posts(
        array_merge(
            array(
            'post_type'      => 'tona_news',
            'post_status'    => 'publish',
            'posts_per_page' => $limit,
            'post__not_in'   => array( $post->ID ),
            'tax_query'      => array(
                array(
                    'taxonomy' => 'tona_news_category',
                    'field'    => 'term_id',
                    'terms'    => wp_list_pluck( $terms, 'term_id' ),
                ),
            ),
            'orderby'        => 'date',
            'order'          => 'DESC',
            ),
            tona_cms_language_query_args()
        )
    );

    return array_values(
        array_map( 'tona_cms_news_payload', is_array( $related_posts ) ? $related_posts : array() )
    );
}

function tona_cms_news_list_payload() {
    $posts = get_posts(
        array_merge(
            array(
            'post_type'      => 'tona_news',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => 'date',
            'order'          => 'DESC',
            ),
            tona_cms_language_query_args()
        )
    );

    return array_values(
        array_map( 'tona_cms_news_payload', is_array( $posts ) ? $posts : array() )
    );
}

function tona_cms_news_by_slug_payload( $slug ) {
    $posts = get_posts(
        array_merge(
            array(
                'post_type'      => 'tona_news',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'name'           => sanitize_title( $slug ),
            ),
            tona_cms_language_query_args()
        )
    );
    $post = ! empty( $posts[0] ) ? $posts[0] : null;

    if ( ! $post || 'publish' !== $post->post_status ) {
        return null;
    }

    $payload = tona_cms_news_payload( $post );
    $payload['related'] = tona_cms_related_news_payload( $post );

    return $payload;
}

function tona_cms_news_page_payload( $page ) {
    $post_id = $page->ID;

    return array(
        'id'      => $post_id,
        'slug'    => $page->post_name,
        'title'   => get_the_title( $page ),
        'colors'  => array(
            'heroBackground' => tona_cms_text_field( $post_id, 'news_hero_background' ),
            'ctaBackground'  => tona_cms_text_field( $post_id, 'news_cta_background' ),
        ),
        'hero'    => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'news_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'news_hero_description' ),
        ),
        'listing' => array(
            'featuredLabel'    => tona_cms_text_field( $post_id, 'news_featured_label' ),
            'searchPlaceholder' => tona_cms_text_field( $post_id, 'news_search_placeholder' ),
            'emptyText'        => tona_cms_text_field( $post_id, 'news_empty_text' ),
            'loadMoreLabel'    => tona_cms_text_field( $post_id, 'news_load_more_label' ),
        ),
        'cta'     => array(
            'title'            => tona_cms_text_field( $post_id, 'news_cta_title' ),
            'description'      => tona_cms_text_field( $post_id, 'news_cta_description' ),
            'emailPlaceholder' => tona_cms_text_field( $post_id, 'news_cta_email_placeholder' ),
            'buttonLabel'      => tona_cms_text_field( $post_id, 'news_cta_button_label' ),
        ),
    );
}

