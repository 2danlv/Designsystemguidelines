<?php
/**
 * Tona headless CMS bootstrap.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once get_stylesheet_directory() . '/inc/setup.php';
require_once get_stylesheet_directory() . '/inc/acf/config.php';
require_once get_stylesheet_directory() . '/inc/api/helpers.php';
require_once get_stylesheet_directory() . '/inc/api/page-resolvers.php';
require_once get_stylesheet_directory() . '/inc/api/pages.php';
require_once get_stylesheet_directory() . '/inc/api/jobs.php';
require_once get_stylesheet_directory() . '/inc/api/projects.php';
require_once get_stylesheet_directory() . '/inc/api/news.php';
require_once get_stylesheet_directory() . '/inc/api/settings.php';
require_once get_stylesheet_directory() . '/inc/api/applicants.php';
require_once get_stylesheet_directory() . '/inc/api/routes.php';
require_once get_stylesheet_directory() . '/inc/api/rest.php';
