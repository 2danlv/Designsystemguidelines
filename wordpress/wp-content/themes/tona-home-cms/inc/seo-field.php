<?php
/**
 * Plugin Name: Simple SEO Meta Box
 * Description: Lightweight SEO meta box for posts, pages, and custom post types.
 * Version: 1.0.0
 * Author: Your Name
 */

if ( !defined( 'ABSPATH' ) ) exit;

function tona_cms_default_seo_image() {
  $option_id = 'option';
  $header_logo = function_exists( 'get_field' ) ? get_field( 'site_header_logo', $option_id ) : '';
  $footer_logo = function_exists( 'get_field' ) ? get_field( 'site_footer_logo', $option_id ) : '';

  if ( function_exists( 'tona_cms_image_url' ) ) {
    $header_logo = tona_cms_image_url( $header_logo );
    $footer_logo = tona_cms_image_url( $footer_logo );
  }

  if ( $header_logo ) return esc_url_raw( $header_logo );
  if ( $footer_logo ) return esc_url_raw( $footer_logo );

  $custom_logo_id = (int) get_theme_mod( 'custom_logo' );
  if ( $custom_logo_id ) {
    $custom_logo = wp_get_attachment_image_url( $custom_logo_id, 'full' );
    if ( $custom_logo ) return esc_url_raw( $custom_logo );
  }

  $site_icon = function_exists( 'get_site_icon_url' ) ? get_site_icon_url( 512 ) : '';
  return $site_icon ? esc_url_raw( $site_icon ) : '';
}

class Simple_SEO_Meta_Box
{

  public function __construct() {
    add_action( 'add_meta_boxes', [ $this, 'register_meta_box' ] );
    add_action( 'save_post', [ $this, 'save_meta_box' ] );
    add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
  }

  /**
   * Register meta box
   */
  public function register_meta_box() {

    $post_types = [
      'post',
      'page',
      'tona_project',
      'tona_news',
      'tona_job',
    ];

    foreach ( $post_types as $post_type ) {
      add_meta_box(
        'simple_seo_meta_box',
        __( 'SEO & Chia sẻ mạng xã hội', 'simple-seo' ),
        [ $this, 'render_meta_box' ],
        $post_type,
        'normal',
        'high'
      );
    }
  }

  /**
   * Render meta box UI
   */
  public function render_meta_box( $post ) {

    wp_nonce_field( 'simple_seo_nonce', 'simple_seo_nonce_field' );
    $og_image_id = get_post_meta($post->ID, '_seo_og_image', true);
    $default_og_image_url = tona_cms_default_seo_image();
    $og_image_url = $og_image_id ? wp_get_attachment_image_url($og_image_id, 'medium') : $default_og_image_url;
    $seo_title   = get_post_meta( $post->ID, '_seo_title', true );
    $description = get_post_meta( $post->ID, '_seo_description', true );
    $keywords    = get_post_meta( $post->ID, '_seo_keywords', true );
    $noindex     = get_post_meta( $post->ID, '_seo_noindex', true );
    $nofollow    = get_post_meta( $post->ID, '_seo_nofollow', true );
    $canonical   = get_post_meta( $post->ID, '_seo_canonical', true );
    $seo_type    = get_post_meta( $post->ID, '_seo_type', true );
    if ( !$seo_type ) {
      $seo_type = 'article'; // default
    }
    ?>
    <p>
      <label><strong><?php _e( 'SEO title Character count', 'simple-seo' ); ?></strong>
        <span class="seo-count">( <span id="seo-title-count">0</span> )</span>
      </label>
      <input type="text" name="_seo_title" value="<?php echo esc_attr( $seo_title ); ?>" class="widefat seo-title">
    </p>
    <p class="howto">Enter the title you want to display on search engines. The text you enter here is given priority over the title of the article for the title tag (&lt;title&gt;).(*"Article title" is used for the headings of pages and indexes)</p>
    <p>
      <label><strong><?php _e( 'Meta description', 'simple-seo' ); ?></strong>
        <span class="seo-count">( <span id="seo-desc-count">0</span> )</span>
      </label>
      <textarea name="_seo_description" rows="3" class="widefat seo-desc" placeholder="A leading construction and MEP contractor delivering integrated international-standard building solutions from design to operation."><?php echo esc_textarea( $description ); ?></textarea>
    </p>
    <p class="howto">Enter a description for the article. The meta description you enter here will also be used as a snippet for blog cards. If left blank, the text entered for "Excerpt" is used as the meta description.</p>
    <p>
      <label><strong><?php _e( 'Meta keywords', 'simple-seo' ); ?></strong></label>
      <input type="text" name="_seo_keywords" value="<?php echo esc_attr( $keywords ); ?>" class="widefat" placeholder="tona corporate">
    </p>
    <p class="howto">Enter keywords related to the article, separated by commas. If left blank, keywords will be set automatically from the category name, etc.</p>
    <p>
      <label><strong>OGP Image</strong></label><br>
      <input type="hidden" name="_seo_og_image" id="seo_og_image" value="<?php echo esc_attr($og_image_id); ?>">
      <img id="seo_og_preview"  src="<?php echo esc_url($og_image_url); ?>" style="max-width:100%; height:auto; display:block; margin-bottom:10px;">
      <button type="button" class="button" id="seo_upload_image">
        Choose Image
      </button>
      <button type="button" class="button" id="seo_remove_image">
        Remove
      </button>
    </p>
    <p class="howto">Nếu không chọn ảnh, website tự dùng logo trong Logo &amp; Footer hoặc Site Icon.</p>
    <?php if ( !$og_image_id && !$default_og_image_url ) : ?>
      <p class="notice notice-warning inline" style="padding:10px 12px; margin:8px 0;">
        Chưa có logo mặc định. Hãy tải logo lên tại <strong>Logo &amp; Footer</strong> hoặc cấu hình <strong>Site Icon</strong>.
      </p>
    <?php endif; ?>
    <hr>
    <p>
      <label>
        <input type="checkbox" name="_seo_noindex" value="1" <?php checked( $noindex, '1' ); ?>>
        <?php _e( 'Do not index (noindex)', 'simple-seo' ); ?>
      </label>
    </p>
    <p class="howto">Sets a meta tag so that this page will not be indexed by search engines.</p>
    <p>
      <label>
        <input type="checkbox" name="_seo_nofollow" value="1" <?php checked( $nofollow, '1' ); ?>>
        <?php _e( 'Do not follow links (nofollow)', 'simple-seo' ); ?>
      </label>
    </p>
    <p class="howto">Sets a meta tag so that search engines will not follow links on this page.</p>
    <p>
      <label for="seo_type"><strong><?php _e( 'SEO Type', 'simple-seo' ); ?></strong></label>
      <select name="_seo_type" id="seo_type">
        <option value="article" <?php selected( $seo_type, 'article' ); ?>>
          article
        </option>
        <option value="website" <?php selected( $seo_type, 'website' ); ?>>
          website
        </option>
      </select>
    </p>

    <details>
      <summary><strong><?php _e( 'Advanced settings', 'simple-seo' ); ?></strong></summary>
      <p>
        <label><strong>Canonical URL</strong></label>
        <input type="url" name="_seo_canonical" value="<?php echo esc_url( $canonical ); ?>" class="widefat">
      </p>
      <p class="howto">If there are multiple URLs with similar or duplicate page content, this field can be used to indicate to the search engine which is a legitimate URL so that the page evaluation from the search engine is consolidated. If the content is duplicated, enter the URL of the canonical page.</p>
    </details>
    <script type="text/javascript">
      jQuery(document).ready(function ($) {

        function updateCount($field, $counter) {
          if (!$field.length || !$counter.length) return;
          $counter.text($field.val().length);
        }

        var $title = $('.seo-title');
        var $desc = $('.seo-desc');

        var $titleCount = $('#seo-title-count');
        var $descCount = $('#seo-desc-count');

        updateCount($title, $titleCount);
        updateCount($desc, $descCount);

        $title.on('input', function () {
          updateCount($title, $titleCount);
        });

        $desc.on('input', function () {
          updateCount($desc, $descCount);
        });

      });
      jQuery(document).ready(function ($) {

      let frame;
      const defaultOgpImage = <?php echo wp_json_encode( $default_og_image_url ); ?>;

      $('#seo_upload_image').on('click', function (e) {
        e.preventDefault();

        if (frame) {
          frame.open();
          return;
        }

        frame = wp.media({
          title: 'Select OGP Image',
          button: {
            text: 'Use this image'
          },
          multiple: false
        });

        frame.on('select', function () {
          let attachment = frame.state().get('selection').first().toJSON();

          $('#seo_og_image').val(attachment.id);
          // $('#seo_og_preview').attr('src', attachment.sizes.medium.url);
          let url =  attachment.sizes.thumbnail?.url ||  attachment.sizes.medium?.url ||  attachment.url;
          $('#seo_og_preview').attr('src', url);
        });

        frame.open();
      });

      $('#seo_remove_image').on('click', function () {
        $('#seo_og_image').val('');
        $('#seo_og_preview').attr('src', defaultOgpImage);
      });

    });
    </script>
    <?php
  }

  /**
   * Save meta
   */
  public function save_meta_box( $post_id ) {

    if (
    !isset( $_POST[ 'simple_seo_nonce_field' ] ) ||
    !wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ 'simple_seo_nonce_field' ] ) ), 'simple_seo_nonce' )
    ) return;

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;

    if ( !current_user_can( 'edit_post', $post_id ) ) return;

    if ( isset( $_POST['_seo_title'] ) ) {
      update_post_meta( $post_id, '_seo_title', sanitize_text_field( wp_unslash( $_POST['_seo_title'] ) ) );
    }

    if ( isset( $_POST['_seo_description'] ) ) {
      update_post_meta( $post_id, '_seo_description', sanitize_textarea_field( wp_unslash( $_POST['_seo_description'] ) ) );
    }

    if ( isset( $_POST['_seo_keywords'] ) ) {
      update_post_meta( $post_id, '_seo_keywords', sanitize_text_field( wp_unslash( $_POST['_seo_keywords'] ) ) );
    }

    if ( isset( $_POST['_seo_canonical'] ) ) {
      update_post_meta( $post_id, '_seo_canonical', esc_url_raw( wp_unslash( $_POST['_seo_canonical'] ) ) );
    }

    if ( isset( $_POST['_seo_og_image'] ) ) {
      update_post_meta( $post_id, '_seo_og_image', absint( $_POST['_seo_og_image'] ) );
    }

    update_post_meta( $post_id, '_seo_noindex', isset( $_POST[ '_seo_noindex' ] ) ? '1' : '' );
    update_post_meta( $post_id, '_seo_nofollow', isset( $_POST[ '_seo_nofollow' ] ) ? '1' : '' );
    if ( isset( $_POST[ '_seo_type' ] ) ) {
      $allowed = [ 'article', 'website' ];

      $submitted_type = sanitize_key( wp_unslash( $_POST[ '_seo_type' ] ) );
      $value = in_array( $submitted_type, $allowed, true )
        ? $submitted_type
        : 'article';

      update_post_meta( $post_id, '_seo_type', $value );
    }

  }

  /**
   * Assets
   */
  public function enqueue_assets( $hook ) {

    if ( !in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) return;

    $screen = get_current_screen();
    $post_types = [ 'post', 'page', 'tona_project', 'tona_news', 'tona_job' ];

    if ( !$screen || !in_array( $screen->post_type, $post_types, true ) ) return;

    wp_enqueue_media();
  }
}

new Simple_SEO_Meta_Box();

/**
 * Return the SEO fields used by the headless frontend.
 */
function tona_cms_seo_payload( $post ) {
  $post = get_post( $post );

  if ( !$post ) {
    return [];
  }

  $post_id = (int) $post->ID;
  $seo_title = trim( (string) get_post_meta( $post_id, '_seo_title', true ) );
  $description = trim( (string) get_post_meta( $post_id, '_seo_description', true ) );
  $keywords = trim( (string) get_post_meta( $post_id, '_seo_keywords', true ) );
  $canonical = trim( (string) get_post_meta( $post_id, '_seo_canonical', true ) );
  $type = get_post_meta( $post_id, '_seo_type', true );
  $image_id = (int) get_post_meta( $post_id, '_seo_og_image', true );
  $image = $image_id ? wp_get_attachment_image_url( $image_id, 'full' ) : '';

  if ( !$image ) {
    $image = tona_cms_default_seo_image();
  }

  if ( !$description ) {
    $description = 'A leading construction and MEP contractor delivering integrated international-standard building solutions from design to operation.';
  }

  if ( !$keywords ) {
    $keywords = 'tona corporate';
  }

  $permalink = get_permalink( $post );
  $frontend_url = function_exists( 'tona_cms_frontend_url' )
    ? tona_cms_frontend_url( $permalink )
    : $permalink;

  return [
    'title'       => html_entity_decode( wp_specialchars_decode( $seo_title ?: get_the_title( $post ), ENT_QUOTES ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ),
    'description' => $description,
    'keywords'    => $keywords,
    'canonical'   => $canonical ?: $frontend_url,
    'image'       => $image ? esc_url_raw( $image ) : '',
    'type'        => in_array( $type, [ 'article', 'website' ], true ) ? $type : 'article',
    'noindex'     => (bool) get_post_meta( $post_id, '_seo_noindex', true ),
    'nofollow'    => (bool) get_post_meta( $post_id, '_seo_nofollow', true ),
  ];
}

function simple_seo_generate_keywords( $post_id ) {

  $keywords = [];

  // Categories
  $categories = get_the_category( $post_id );
  if ( !empty( $categories ) ) {
    foreach ( $categories as $cat ) {
      $keywords[] = $cat->name;
    }
  }

  // Tags
  $tags = get_the_tags( $post_id );
  if ( !empty( $tags ) ) {
    foreach ( $tags as $tag ) {
      $keywords[] = $tag->name;
    }
  }

  // Unique + clean
  $keywords = array_unique( $keywords );

  return implode( ',', $keywords );
}

add_action( 'wp_head', function ()
{

  if ( !is_singular() ) return;

  global $post;
  $seo_title   = get_post_meta( $post->ID, '_seo_title', true );
  $seo_desc    = get_post_meta( $post->ID, '_seo_description', true );
  $seo_type    = get_post_meta( $post->ID, '_seo_type', true );
  $keywords  = get_post_meta( $post->ID, '_seo_keywords', true );
  $noindex   = get_post_meta( $post->ID, '_seo_noindex', true );
  $nofollow  = get_post_meta( $post->ID, '_seo_nofollow', true );
  $canonical = get_post_meta( $post->ID, '_seo_canonical', true );
  $og_image_id = get_post_meta($post->ID, '_seo_og_image', true);
  // Fallbacks
  $title = $seo_title ? $seo_title : get_the_title( $post );
  $desc  = $seo_desc ? $seo_desc : 'A leading construction and MEP contractor delivering integrated international-standard building solutions from design to operation.';
  $url   = $canonical ? $canonical : get_permalink( $post );
  if ( empty( $keywords ) ) {
    $keywords = 'tona corporate';
  }

  $site_name = get_bloginfo( 'name' );

  echo '<title>' . esc_html( $title ) . '|' . esc_html( $site_name ) . '</title>' . PHP_EOL;


  if ( $desc ) {
    echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . PHP_EOL;
  }

  if ( $keywords ) {
    echo '<meta name="keywords" content="' . esc_attr( $keywords ) . '">' . PHP_EOL;
  }

  if ( $canonical ) {
    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '">' . PHP_EOL;
  }

  if ( !$seo_type ) {
    $seo_type = 'article';
  }

  // Use the page OGP image first, then the configured company logo.
  if ($og_image_id) {
    $image = wp_get_attachment_image_url($og_image_id, 'full');
  } else {
    $image = tona_cms_default_seo_image();
  }
  
  echo PHP_EOL . '<!-- SEO Social Meta -->' . PHP_EOL;

  /* =====================
   * Facebook Open Graph
   * ===================== */
  echo '<meta property="og:title" content="' . esc_html( $title ) . ' | ' . esc_html( $site_name ) . '">' . PHP_EOL;
  echo '<meta property="og:description" content="' . esc_attr( $desc ) . '">' . PHP_EOL;
  echo '<meta property="og:type" content="' . esc_attr( $seo_type ) . '">' . PHP_EOL;
  echo '<meta property="og:url" content="' . esc_url( $url ) . '">' . PHP_EOL;

  if ( $image ) {
    echo '<meta property="og:image" content="' . esc_url( $image ) . '">' . PHP_EOL;
  }

  /* =====================
   * Twitter Card
   * ===================== */
  echo '<meta name="twitter:card" content="summary_large_image">' . PHP_EOL;
  echo '<meta name="twitter:title" content="' . esc_html( $title ) . ' | ' . esc_html( $site_name ) . '">' . PHP_EOL;
  echo '<meta name="twitter:description" content="' . esc_attr( $desc ) . '">' . PHP_EOL;

  if ( $image ) {
    echo '<meta name="twitter:image" content="' . esc_url( $image ) . '">' . PHP_EOL;
  }

  echo '<!-- /SEO Social Meta -->' . PHP_EOL;
} );
add_filter( 'wp_robots', function( $robots ) {

    global $post;

    if ( ! is_singular() || ! $post ) {
        return $robots;
    }

    $noindex  = get_post_meta( $post->ID, '_seo_noindex', true );
    $nofollow = get_post_meta( $post->ID, '_seo_nofollow', true );

    if ( $noindex || $nofollow ) {
      unset( $robots['max-image-preview'] );
    }
    if ( $noindex ) {
        $robots['noindex'] = true;
    }
    if ( $nofollow ) {
        $robots['nofollow'] = true;
    }    

    return $robots;
});
