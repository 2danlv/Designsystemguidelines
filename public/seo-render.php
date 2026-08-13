<?php
/**
 * Dynamic HTML shell for the headless React frontend.
 * Injects live WordPress SEO fields before returning the Vite index document.
 */

$index_path = __DIR__ . '/index.html';
$wordpress_candidates = array(
    __DIR__ . '/wordpress/wp-load.php',
    dirname( __DIR__ ) . '/wordpress/wp-load.php',
);
$wordpress_bootstrap = '';

foreach ( $wordpress_candidates as $candidate ) {
    if ( is_readable( $candidate ) ) {
        $wordpress_bootstrap = $candidate;
        break;
    }
}

function tona_frontend_shell_fallback( $index_path ) {
    if ( is_readable( $index_path ) ) {
        header( 'Content-Type: text/html; charset=UTF-8' );
        readfile( $index_path );
    } else {
        http_response_code( 503 );
        echo 'Frontend is unavailable.';
    }
    exit;
}

if ( ! $wordpress_bootstrap ) {
    tona_frontend_shell_fallback( $index_path );
}

require_once $wordpress_bootstrap;

if ( ! is_readable( $index_path ) || ! function_exists( 'tona_cms_resolve_route_payload' ) ) {
    tona_frontend_shell_fallback( $index_path );
}

function tona_frontend_origin() {
    $forwarded_proto = isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) ? strtolower( trim( (string) $_SERVER['HTTP_X_FORWARDED_PROTO'] ) ) : '';
    $scheme = ( 'https' === $forwarded_proto || ( isset( $_SERVER['HTTPS'] ) && 'off' !== strtolower( (string) $_SERVER['HTTPS'] ) ) ) ? 'https' : 'http';
    $host = isset( $_SERVER['HTTP_HOST'] ) ? preg_replace( '/[^A-Za-z0-9.\-:\[\]]/', '', (string) $_SERVER['HTTP_HOST'] ) : '';

    return $host ? $scheme . '://' . $host : '';
}

function tona_frontend_absolute_url( $url, $origin ) {
    $url = trim( (string) $url );

    if ( '' === $url ) return '';
    if ( preg_match( '#^https?://#i', $url ) ) return esc_url_raw( $url );

    return esc_url_raw( rtrim( $origin, '/' ) . '/' . ltrim( $url, '/' ) );
}

function tona_frontend_meta_tag( $name, $content, $property = false ) {
    if ( '' === trim( (string) $content ) ) return '';

    $attribute = $property ? 'property' : 'name';
    return '<meta ' . $attribute . '="' . esc_attr( $name ) . '" content="' . esc_attr( $content ) . '">';
}

$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( (string) $_SERVER['REQUEST_URI'] ) : '/';
$requested_path = isset( $_GET['path'] ) ? wp_unslash( (string) $_GET['path'] ) : '';
$request_path = wp_parse_url( $requested_path ?: $request_uri, PHP_URL_PATH );
$request_path = is_string( $request_path ) && '' !== $request_path ? '/' . ltrim( $request_path, '/' ) : '/';
$language = preg_match( '#^/en(?=/|$)#', $request_path ) ? 'en' : 'vi';

$request = new WP_REST_Request( 'GET', '/tona/v1/resolve' );
$request->set_param( 'path', $request_path );
$request->set_param( 'lang', $language );
$route = tona_cms_resolve_route_payload( $request );
$settings = function_exists( 'tona_cms_site_settings_payload' ) ? tona_cms_site_settings_payload() : array();
$seo = is_array( $route ) && isset( $route['seo'] ) && is_array( $route['seo'] ) ? $route['seo'] : array();

$site_title = trim( (string) ( $settings['site']['title'] ?? get_bloginfo( 'name' ) ) );
$page_title = trim( (string) ( $seo['title'] ?? ( $route['title'] ?? '' ) ) );
$is_home = isset( $route['template'] ) && 'tona-home' === $route['template'];
$title = ( $is_home || '' === $page_title || $page_title === $site_title )
    ? $site_title
    : ( $site_title ? $page_title . ' | ' . $site_title : $page_title );

$description = trim( (string) ( $seo['description'] ?? '' ) );
if ( '' === $description ) {
    $description = 'A leading construction and MEP contractor delivering integrated international-standard building solutions from design to operation.';
}

$keywords = trim( (string) ( $seo['keywords'] ?? '' ) );
if ( '' === $keywords ) $keywords = 'tona corporate';

$origin = tona_frontend_origin();
$canonical_source = ! empty( $seo['canonicalCustom'] ) ? ( $seo['canonical'] ?? '' ) : $request_path;
$canonical = tona_frontend_absolute_url( $canonical_source, $origin );
$image = tona_frontend_absolute_url( $seo['image'] ?? '', $origin );
$type = in_array( $seo['type'] ?? '', array( 'article', 'website' ), true ) ? $seo['type'] : ( $is_home ? 'website' : 'article' );
$robots = implode( ', ', array( ! empty( $seo['noindex'] ) ? 'noindex' : 'index', ! empty( $seo['nofollow'] ) ? 'nofollow' : 'follow' ) );

$meta = array(
    '<title>' . esc_html( $title ) . '</title>',
    tona_frontend_meta_tag( 'description', $description ),
    tona_frontend_meta_tag( 'keywords', $keywords ),
    tona_frontend_meta_tag( 'robots', $robots ),
    $canonical ? '<link rel="canonical" href="' . esc_url( $canonical ) . '">' : '',
    tona_frontend_meta_tag( 'og:title', $title, true ),
    tona_frontend_meta_tag( 'og:description', $description, true ),
    tona_frontend_meta_tag( 'og:type', $type, true ),
    tona_frontend_meta_tag( 'og:url', $canonical, true ),
    tona_frontend_meta_tag( 'og:site_name', $site_title, true ),
    tona_frontend_meta_tag( 'og:image', $image, true ),
    tona_frontend_meta_tag( 'twitter:card', $image ? 'summary_large_image' : 'summary' ),
    tona_frontend_meta_tag( 'twitter:title', $title ),
    tona_frontend_meta_tag( 'twitter:description', $description ),
    tona_frontend_meta_tag( 'twitter:image', $image ),
    '<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-8WTPXZ7TFX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag(\'js\', new Date());
      gtag(\'config\', \'G-8WTPXZ7TFX\');
    </script>',
);

$meta = implode( "\n    ", array_filter( $meta ) );
$html = file_get_contents( $index_path );
$html = preg_replace( '/\s*<title>[\s\S]*?<\/title>/i', '', $html );
$html = preg_replace( '/<html\s+lang="[^"]*"/i', '<html lang="' . esc_attr( $language ) . '"', $html );
$html = str_replace( '</head>', '    ' . $meta . "\n  </head>", $html );

header( 'Content-Type: text/html; charset=UTF-8' );
header( 'Cache-Control: no-cache, no-store, must-revalidate' );
header( 'X-Robots-Tag: ' . $robots );
echo $html;
