<?php
/**
 * Polylang string translations for fixed React UI labels.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_ui_string_defaults() {
    return array(
        'home.hero.primary_label' => 'View Projects',
        'home.services.title'     => 'Core Services',
        'home.services.view_all'  => 'View All Services',
        'home.projects.label'     => 'Portfolio',
        'home.projects.title'     => 'Featured Projects',
        'home.projects.view_all'  => 'View all',
        'home.news.title'         => 'News & Activities',
        'home.news.view_all'      => 'View All',
        'home.news.read_more'     => 'Read more',
        'home.partners.title'     => 'Partners & Customers',
        'jobs.apply_now'          => 'Apply Now',
        'jobs.view_jd'            => 'View JD',
        'jobs.detail'             => 'Detail',
        'jobs.requirements'       => 'Requirements',
        'jobs.skills'             => 'Skills',
        'jobs.benefits'           => 'Benefits',
        'jobs.salary'             => 'Salary',
        'jobs.slots_suffix'       => 'positions',
        'project.lightbox.close'   => 'Close (ESC)',
        'project.gallery.zoom'     => 'Zoom',
        'project.not_found'        => 'Project Not Found',
        'project.back'             => 'Back to Projects',
        'project.back_all'         => 'All Projects',
        'project.spec.client'      => 'Client',
        'project.spec.location'    => 'Location',
        'project.spec.area'        => 'Area',
        'project.spec.duration'    => 'Duration',
        'project.spec.status'      => 'Status',
        'project.leed_badge'       => 'LEED Gold Certified',
        'project.leed_note'        => 'Green building certified LEED Gold',
        'project.highlights'       => 'Highlights',
        'project.construction'     => 'Construction Items',
        'project.cta_eyebrow'      => 'Have a similar project?',
        'project.cta_title'        => 'Contact us',
        'project.cta_button'       => 'Contact Now',
        'project.related'          => 'Related Projects',
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
        'Sync UI Translations',
        'Sync UI Translations',
        'manage_options',
        'tona-sync-ui-translations',
        'tona_cms_render_ui_strings_admin_page'
    );
}
add_action( 'admin_menu', 'tona_cms_register_ui_strings_admin_page' );

function tona_cms_render_ui_strings_admin_page() {
    if ( isset( $_POST['tona_sync_ui_translations'] ) && check_admin_referer( 'tona_sync_ui_translations' ) ) {
        tona_cms_register_ui_strings();
        echo '<div class="notice notice-success"><p>UI translation strings synced. Go to Languages > Translations and filter group "Tona UI".</p></div>';
    }

    echo '<div class="wrap">';
    echo '<h1>Sync UI Translations</h1>';
    echo '<p>This registers fixed React UI labels into Polylang String Translations.</p>';
    echo '<form method="post">';
    wp_nonce_field( 'tona_sync_ui_translations' );
    echo '<p><button type="submit" name="tona_sync_ui_translations" class="button button-primary">Sync UI Translations</button></p>';
    echo '</form>';
    echo '</div>';
}

function tona_cms_ui_strings_payload( $language = 'vi' ) {
    $payload = array();

    foreach ( tona_cms_ui_string_defaults() as $key => $default_value ) {
        $translated_value = function_exists( 'pll__' ) ? pll__( $default_value ) : $default_value;
        $payload[ $key ] = $translated_value;
    }

    return $payload;
}
