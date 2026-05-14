<?php
/**
 * Advanced Custom Fields PRO
 *
 * @package       ACF
 * @author        WP Engine
 *
 * @wordpress-plugin
 * Plugin Name:       Advanced Custom Fields - Add on
 * Plugin URI:        https://www.advancedcustomfields.com
 * Description:       Customize WordPress with powerful, professional and intuitive fields.
 * Version:           6.2.8
 * Author:            WP Engine
 * Author URI:        https://wpengine.com/?utm_source=wordpress.org&utm_medium=referral&utm_campaign=plugin_directory&utm_content=advanced_custom_fields
 * Update URI:        https://www.advancedcustomfields.com/pro
 * Text Domain:       acf
 * Domain Path:       /lang
 * Requires PHP:      7.0
 * Requires at least: 5.8
 */
$lic_data = base64_encode(
  maybe_serialize( [ 
    "key" => "********",
    "url" => home_url(),
    ] )
  );
update_option( "acf_pro_license", $lic_data );
update_option( "acf_pro_license_status", [ "status" => "active", "next_check" => time() * 9 ] );
add_action( "init", function ()
{
  add_filter(
    "pre_http_request",
    function ($pre, $url, $request_args)
    {
      if ( is_string( $url ) && strpos( $url, "https://connect.advancedcustomfields.com/" ) !== false ) {
        return [ "response" => [ "code" => 200, "message" => "OK" ] ];
      }
      return $pre;
    },
    10,
    3
  );
} );
// delete_site_transient( "update_plugins" );
// delete_transient( "acf_plugin_updates" );
?>