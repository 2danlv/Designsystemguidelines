<?php
/**
 * Page payloads.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_home_title_image_value( $post_id ) {
    // This field used to be injected only on the edit screen. Reading the raw
    // attachment ID also supports images saved before it joined the JSON group.
    $attachment_id = get_post_meta( $post_id, 'home_hero_title_image', true );

    if ( ! empty( $attachment_id ) ) {
        return $attachment_id;
    }

    return function_exists( 'get_field' ) ? get_field( 'home_hero_title_image', $post_id ) : '';
}

function tona_cms_home_payload( $page ) {
    $post_id = $page->ID;
    $title_image = tona_cms_home_title_image_value( $post_id );

    if ( empty( $title_image ) && function_exists( 'get_field' ) && function_exists( 'pll_get_post' ) ) {
        $current_language = function_exists( 'pll_get_post_language' ) ? pll_get_post_language( $post_id, 'slug' ) : '';
        $fallback_language = 'en' === $current_language ? 'vi' : 'en';
        $fallback_post_id = (int) pll_get_post( $post_id, $fallback_language );

        if ( $fallback_post_id && $fallback_post_id !== (int) $post_id ) {
            $title_image = tona_cms_home_title_image_value( $fallback_post_id );
        }
    }

    $marquee_items = function_exists( 'get_field' ) ? get_field( 'home_marquee_items', $post_id ) : array();

    // Polylang stores each translated home page as a separate post. If the
    // marquee has only been entered on one translation, reuse it instead of
    // returning an empty strip on the other language.
    if ( empty( $marquee_items ) && function_exists( 'get_field' ) && function_exists( 'pll_get_post' ) ) {
        $current_language = function_exists( 'pll_get_post_language' ) ? pll_get_post_language( $post_id, 'slug' ) : '';
        $fallback_language = 'en' === $current_language ? 'vi' : 'en';
        $fallback_post_id = (int) pll_get_post( $post_id, $fallback_language );

        if ( $fallback_post_id && $fallback_post_id !== (int) $post_id ) {
            $fallback_marquee_items = get_field( 'home_marquee_items', $fallback_post_id );

            if ( is_array( $fallback_marquee_items ) && ! empty( $fallback_marquee_items ) ) {
                $marquee_items = $fallback_marquee_items;
            }
        }
    }

    $stats = function_exists( 'get_field' ) ? get_field( 'home_slogan_stats', $post_id ) : array();

    if ( empty( $stats ) && function_exists( 'get_field' ) && function_exists( 'pll_get_post' ) ) {
        $current_language = function_exists( 'pll_get_post_language' ) ? pll_get_post_language( $post_id, 'slug' ) : '';
        $fallback_language = 'en' === $current_language ? 'vi' : 'en';
        $fallback_post_id = (int) pll_get_post( $post_id, $fallback_language );

        if ( $fallback_post_id && $fallback_post_id !== (int) $post_id ) {
            $fallback_stats = get_field( 'home_slogan_stats', $fallback_post_id );

            if ( is_array( $fallback_stats ) && ! empty( $fallback_stats ) ) {
                $stats = $fallback_stats;
            }
        }
    }

    $partners = function_exists( 'get_field' ) ? get_field( 'home_partner_logos', $post_id ) : array();

    return array(
        'id'      => $post_id,
        'slug'    => $page->post_name,
        'title'   => get_the_title( $page ),
        'hero'    => array(
            'backgroundColor' => tona_cms_text_field( $post_id, 'home_hero_background' ),
            'videoId'         => tona_cms_text_field( $post_id, 'home_hero_video_id' ),
            'ticker'          => tona_cms_text_field( $post_id, 'home_hero_ticker' ),
            'title'           => tona_cms_text_field( $post_id, 'home_hero_title' ),
            'titleImage'      => tona_cms_image_url( $title_image ),
            'description'     => tona_cms_text_field( $post_id, 'home_hero_description' ),
            'primaryLabel'   => tona_cms_text_field( $post_id, 'home_hero_primary_label' ),
            'primaryUrl'     => tona_cms_link_url_value( function_exists( 'get_field' ) ? get_field( 'home_hero_primary_url', $post_id ) : '' ),
            'secondaryLabel' => tona_cms_text_field( $post_id, 'home_hero_secondary_label' ),
            'secondaryUrl'   => tona_cms_link_url_value( function_exists( 'get_field' ) ? get_field( 'home_hero_secondary_url', $post_id ) : '' ),
        ),
        'marquee' => array(
            'items' => array_values(
                array_filter(
                    array_map(
                        function ( $item ) {
                            return is_array( $item ) ? trim( $item['text'] ?? '' ) : '';
                        },
                        is_array( $marquee_items ) ? $marquee_items : array()
                    )
                )
            ),
        ),
        'slogan'  => array(
            'eyebrow'     => tona_cms_text_field( $post_id, 'home_slogan_eyebrow' ),
            'title'       => tona_cms_text_field( $post_id, 'home_slogan_title' ),
            'accentTitle' => tona_cms_text_field( $post_id, 'home_slogan_accent_title' ),
            'description' => tona_cms_text_field( $post_id, 'home_slogan_description' ),
            'stats'       => array_values(
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
        ),
        'sections' => array(
            'servicesTitle' => tona_cms_text_field( $post_id, 'home_services_title' ),
            'projectsLabel' => tona_cms_text_field( $post_id, 'home_projects_label' ),
            'projectsTitle' => tona_cms_text_field( $post_id, 'home_projects_title' ),
            'newsTitle'     => tona_cms_text_field( $post_id, 'home_news_title' ),
        ),
        'partners' => array(
            'title'       => tona_cms_text_field( $post_id, 'home_partners_title' ),
            'description' => tona_cms_text_field( $post_id, 'home_partners_description' ),
            'logos'       => array_values(
                array_filter(
                    array_map(
                        function ( $partner ) {
                            return tona_cms_image_url( $partner['logo'] ?? '' );
                        },
                        is_array( $partners ) ? $partners : array()
                    )
                )
            ),
        ),
    );
}

function tona_cms_members_payload( $page ) {
    $post_id = $page->ID;
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
            'linkUrl'     => tona_cms_link_url_value( function_exists( 'get_field' ) ? get_field( 'members_teaser_link_url', $post_id ) : '' ),
        ),
    );
}

function tona_cms_member_repeater_items( $post_id, $field_name ) {
    $rows = function_exists( 'get_field' ) ? get_field( $field_name, $post_id ) : array();

    if ( ! is_array( $rows ) ) {
        return array();
    }

    return array_values(
        array_filter(
            array_map(
                function ( $row ) {
                    return is_array( $row ) ? trim( $row['item'] ?? '' ) : '';
                },
                $rows
            )
        )
    );
}

function tona_cms_member_payload( $post ) {
    $post_id = $post->ID;

    return array(
        'id'           => $post_id,
        'slug'         => $post->post_name,
        'name'         => get_the_title( $post ),
        'role'         => tona_cms_text_field( $post_id, 'member_role' ),
        'roleEn'       => tona_cms_text_field( $post_id, 'member_role_en' ),
        'image'        => get_the_post_thumbnail_url( $post_id, 'large' ) ?: '',
        'bio'          => tona_cms_decode_text( wp_strip_all_tags( get_the_content( null, false, $post ) ) ),
        'linkedin'     => tona_cms_text_field( $post_id, 'member_linkedin' ) ?: '#',
        'education'    => tona_cms_text_field( $post_id, 'member_education' ),
        'since'        => tona_cms_text_field( $post_id, 'member_since' ),
        'expertise'    => tona_cms_member_repeater_items( $post_id, 'member_expertise' ),
        'achievements' => tona_cms_member_repeater_items( $post_id, 'member_achievements' ),
        'quote'        => tona_cms_text_field( $post_id, 'member_quote' ),
    );
}

function tona_cms_members_list_payload() {
    $query_args = array(
        'post_type'      => 'tona_member',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => array(
            'menu_order' => 'ASC',
            'date'       => 'DESC',
        ),
    );
    $language_args = tona_cms_language_query_args();
    $posts = get_posts( array_merge( $query_args, $language_args ) );

    // Older member posts can exist before a Polylang language is assigned.
    // Keep them visible until translated member posts are created in CMS.
    if ( empty( $posts ) && ! empty( $language_args ) ) {
        $posts = get_posts( $query_args );
    }

    return array_values(
        array_map( 'tona_cms_member_payload', is_array( $posts ) ? $posts : array() )
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
            'eyebrow'         => tona_cms_text_field( $post_id, 'about_hero_eyebrow' ),
            'title'           => tona_cms_group_text_field( $post_id, array( 'about_hero_intro_left', 'kv_left' ), 'about_hero_title', 'about_hero_title' ),
            'description'     => tona_cms_group_text_field( $post_id, array( 'about_hero_intro_left', 'kv_left' ), 'about_hero_description', 'about_hero_description' ),
            'videoId'         => tona_cms_text_field( $post_id, 'about_hero_video_id' ),
            'bottomLabel'     => tona_cms_text_field( $post_id, 'about_hero_bottom_label' ),
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
        'ceo' => array(
            'eyebrow' => tona_cms_text_field( $post_id, 'about_ceo_eyebrow' ),
            'quote'   => tona_cms_text_field( $post_id, 'about_ceo_quote' ),
            'accent'  => tona_cms_text_field( $post_id, 'about_ceo_accent' ),
            'name'    => tona_cms_text_field( $post_id, 'about_ceo_name' ),
            'role'    => tona_cms_text_field( $post_id, 'about_ceo_role' ),
        ),
        'cta' => array(
            'title'          => tona_cms_text_field( $post_id, 'about_cta_title' ),
            'description'    => tona_cms_text_field( $post_id, 'about_cta_description' ),
            'primaryLabel'   => tona_cms_text_field( $post_id, 'about_cta_primary_label' ),
            'primaryUrl'     => tona_cms_link_url_value( function_exists( 'get_field' ) ? get_field( 'about_cta_primary_url', $post_id ) : '' ),
            'secondaryLabel' => tona_cms_text_field( $post_id, 'about_cta_secondary_label' ),
            'secondaryUrl'   => tona_cms_link_url_value( function_exists( 'get_field' ) ? get_field( 'about_cta_secondary_url', $post_id ) : '' ),
        ),
    );
}

function tona_cms_culture_payload( $page ) {
    $post_id = $page->ID;
    $stats = function_exists( 'get_field' ) ? get_field( 'culture_stats', $post_id ) : array();
    $themes = function_exists( 'get_field' ) ? get_field( 'culture_yearly_themes', $post_id ) : array();
    $activities = function_exists( 'get_field' ) ? get_field( 'culture_activities', $post_id ) : array();
    $social_stats = function_exists( 'get_field' ) ? get_field( 'culture_social_stats', $post_id ) : array();
    $social_badges = function_exists( 'get_field' ) ? get_field( 'culture_social_badges', $post_id ) : array();
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
            'socialResponsibilityBackground' => tona_cms_text_field( $post_id, 'culture_social_background' ),
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
        'socialResponsibility' => array(
            'eyebrow'     => tona_cms_text_field( $post_id, 'culture_social_eyebrow' ),
            'title'       => tona_cms_text_field( $post_id, 'culture_social_title' ),
            'description' => tona_cms_text_field( $post_id, 'culture_social_description' ),
            'image'       => tona_cms_image_url( function_exists( 'get_field' ) ? get_field( 'culture_social_image', $post_id ) : '' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'culture_social_link_label' ),
            'linkUrl'     => tona_cms_text_field( $post_id, 'culture_social_link_url' ),
            'badges'      => array_values(
                array_filter(
                    array_map(
                        function ( $badge ) {
                            return is_array( $badge ) ? trim( $badge['text'] ?? '' ) : '';
                        },
                        is_array( $social_badges ) ? $social_badges : array()
                    )
                )
            ),
            'stats'       => array_values(
                array_map(
                    function ( $stat ) {
                        return array(
                            'value' => $stat['value'] ?? '',
                            'label' => $stat['label'] ?? '',
                        );
                    },
                    is_array( $social_stats ) ? $social_stats : array()
                )
            ),
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

function tona_cms_csr_payload( $page ) {
    $post_id = $page->ID;
    $impact = function_exists( 'get_field' ) ? get_field( 'csr_impact', $post_id ) : array();
    $programs = function_exists( 'get_field' ) ? get_field( 'csr_programs', $post_id ) : array();
    $commitment_items = function_exists( 'get_field' ) ? get_field( 'csr_commitment_items', $post_id ) : array();

    return array(
        'id'     => $post_id,
        'slug'   => $page->post_name,
        'title'  => get_the_title( $page ),
        'colors' => array(
            'heroBackground'       => tona_cms_text_field( $post_id, 'csr_hero_background' ),
            'programsBackground'   => tona_cms_text_field( $post_id, 'csr_programs_background' ),
            'commitmentBackground' => tona_cms_text_field( $post_id, 'csr_commitment_background' ),
            'ctaBackground'        => tona_cms_text_field( $post_id, 'csr_cta_background' ),
        ),
        'hero'   => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'csr_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'csr_hero_description' ),
            'decorativeText'  => tona_cms_text_field( $post_id, 'csr_hero_decorative_text' ),
        ),
        'impact' => array_values(
            array_map(
                function ( $item ) {
                    return array(
                        'icon'  => $item['icon'] ?? 'Handshake',
                        'value' => $item['value'] ?? '',
                        'label' => $item['label'] ?? '',
                    );
                },
                is_array( $impact ) ? $impact : array()
            )
        ),
        'programsSection' => array(
            'title'       => tona_cms_text_field( $post_id, 'csr_programs_title' ),
            'description' => tona_cms_text_field( $post_id, 'csr_programs_description' ),
        ),
        'programs' => array_values(
            array_map(
                function ( $program ) {
                    return array(
                        'id'          => sanitize_title( $program['title'] ?? '' ),
                        'icon'        => $program['icon'] ?? 'Heart',
                        'color'       => $program['color'] ?? '',
                        'bgColor'     => $program['bg_color'] ?? '',
                        'tag'         => $program['tag'] ?? '',
                        'title'       => $program['title'] ?? '',
                        'subtitle'    => $program['subtitle'] ?? '',
                        'description' => $program['description'] ?? '',
                        'image'       => tona_cms_image_url( $program['image'] ?? '' ),
                        'stats'       => array_values(
                            array_map(
                                function ( $stat ) {
                                    return array(
                                        'value' => $stat['value'] ?? '',
                                        'label' => $stat['label'] ?? '',
                                    );
                                },
                                is_array( $program['stats'] ?? null ) ? $program['stats'] : array()
                            )
                        ),
                        'highlights'  => array_values(
                            array_filter(
                                array_map(
                                    function ( $highlight ) {
                                        return is_array( $highlight ) ? trim( $highlight['item'] ?? '' ) : '';
                                    },
                                    is_array( $program['highlights'] ?? null ) ? $program['highlights'] : array()
                                )
                            )
                        ),
                    );
                },
                is_array( $programs ) ? $programs : array()
            )
        ),
        'commitment' => array(
            'title'       => tona_cms_text_field( $post_id, 'csr_commitment_title' ),
            'description' => tona_cms_text_field( $post_id, 'csr_commitment_description' ),
            'items'       => array_values(
                array_map(
                    function ( $item ) {
                        return array(
                            'title' => $item['title'] ?? '',
                            'desc'  => $item['description'] ?? '',
                        );
                    },
                    is_array( $commitment_items ) ? $commitment_items : array()
                )
            ),
        ),
        'cta' => array(
            'title'          => tona_cms_text_field( $post_id, 'csr_cta_title' ),
            'description'    => tona_cms_text_field( $post_id, 'csr_cta_description' ),
            'primaryLabel'   => tona_cms_text_field( $post_id, 'csr_cta_primary_label' ),
            'primaryUrl'     => tona_cms_text_field( $post_id, 'csr_cta_primary_url' ),
            'secondaryLabel' => tona_cms_text_field( $post_id, 'csr_cta_secondary_label' ),
            'secondaryUrl'   => tona_cms_text_field( $post_id, 'csr_cta_secondary_url' ),
        ),
    );
}

function tona_cms_services_payload( $page ) {
    $post_id = $page->ID;
    $services = function_exists( 'get_field' ) ? get_field( 'services_items', $post_id ) : array();
    $process_steps = function_exists( 'get_field' ) ? get_field( 'services_process_steps', $post_id ) : array();
    $timelapse_slides = function_exists( 'get_field' ) ? get_field( 'services_timelapse_slides', $post_id ) : array();

    return array(
        'id'     => $post_id,
        'slug'   => $page->post_name,
        'title'  => get_the_title( $page ),
        'colors' => array(
            'heroBackground'     => tona_cms_text_field( $post_id, 'services_hero_background' ),
            'servicesBackground' => tona_cms_text_field( $post_id, 'services_services_background' ),
            'processBackground'  => tona_cms_text_field( $post_id, 'services_process_background' ),
            'timelapseBackground' => tona_cms_text_field( $post_id, 'services_timelapse_background' ),
            'ctaBackground'      => tona_cms_text_field( $post_id, 'services_cta_background' ),
        ),
        'hero'   => array(
            'breadcrumbLabel' => get_the_title( $page ),
            'title'           => tona_cms_text_field( $post_id, 'services_hero_title' ),
            'description'     => tona_cms_text_field( $post_id, 'services_hero_description' ),
            'decorativeText'  => tona_cms_text_field( $post_id, 'services_hero_decorative_text' ),
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
                        'linkUrl'     => tona_cms_link_url_value( $service['link_url'] ?? '' ),
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
        'timelapse' => array(
            'title'       => tona_cms_text_field( $post_id, 'services_timelapse_title' ),
            'description' => tona_cms_text_field( $post_id, 'services_timelapse_description' ),
            'slides'      => array_values(
                array_map(
                    function ( $slide ) {
                        return array(
                            'title'    => $slide['title'] ?? '',
                            'subtitle' => $slide['subtitle'] ?? '',
                            'duration' => $slide['duration'] ?? '',
                            'video'    => tona_cms_image_url( $slide['video'] ?? ( $slide['image'] ?? '' ) ),
                        );
                    },
                    is_array( $timelapse_slides ) ? $timelapse_slides : array()
                )
            ),
        ),
        'cta' => array(
            'title'       => tona_cms_text_field( $post_id, 'services_cta_title' ),
            'description' => tona_cms_text_field( $post_id, 'services_cta_description' ),
            'linkLabel'   => tona_cms_text_field( $post_id, 'services_cta_link_label' ),
            'linkUrl'     => tona_cms_link_url_value( function_exists( 'get_field' ) ? get_field( 'services_cta_link_url', $post_id ) : '' ),
        ),
    );
}

