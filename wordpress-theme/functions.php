<?php
/**
 * Tona Corporation Theme Functions
 */

// Enqueue styles and scripts
function tona_enqueue_assets() {
    // Main stylesheet
    wp_enqueue_style('tona-style', get_template_directory_uri() . '/css/style.css', array(), '1.0.0');
    
    // Main JavaScript
    wp_enqueue_script('tona-main', get_template_directory_uri() . '/js/main.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'tona_enqueue_assets');

// Theme support
function tona_theme_support() {
    // Add title tag support
    add_theme_support('title-tag');
    
    // Add post thumbnails
    add_theme_support('post-thumbnails');
    
    // Add custom logo
    add_theme_support('custom-logo', array(
        'height'      => 40,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'tona'),
        'footer'  => __('Footer Menu', 'tona'),
    ));
    
    // Add HTML5 support
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
}
add_action('after_setup_theme', 'tona_theme_support');

// Custom excerpt length
function tona_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'tona_excerpt_length');

// Custom excerpt more
function tona_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'tona_excerpt_more');

// Register widget areas
function tona_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'tona'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here to appear in your sidebar.', 'tona'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'tona_widgets_init');
