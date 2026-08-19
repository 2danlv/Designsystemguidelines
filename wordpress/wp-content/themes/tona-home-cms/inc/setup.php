<?php
/**
 * Theme setup and module loading.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    register_nav_menus(
        array(
            'primary' => 'Header Menu',
        )
    );
}
add_action( 'after_setup_theme', 'tona_cms_theme_setup' );

require_once get_stylesheet_directory() . '/inc/post-types/jobs.php';
require_once get_stylesheet_directory() . '/inc/post-types/applicants.php';
require_once get_stylesheet_directory() . '/inc/post-types/members.php';
require_once get_stylesheet_directory() . '/inc/post-types/projects.php';
require_once get_stylesheet_directory() . '/inc/post-types/news.php';
require_once get_stylesheet_directory() . '/inc/i18n/ui-strings.php';
require_once get_stylesheet_directory() . '/inc/seo-field.php';
add_action( 'admin_print_footer_scripts', function () {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
            link.removeAttribute('target');
            const rel = link.getAttribute('rel');
            if (rel) {
                const values = rel
                    .split(/\s+/)
                    .filter(function (value) {
                        return value !== 'noopener' && value !== 'noreferrer';
                    });
                if (values.length) {
                    link.setAttribute('rel', values.join(' '));
                } else {
                    link.removeAttribute('rel');
                }
            }
        });
    });
    </script>
    <?php
}, PHP_INT_MAX );