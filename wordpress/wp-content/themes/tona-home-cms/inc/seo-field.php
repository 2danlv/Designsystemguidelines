<?php
/**
 * Plugin Name: Simple SEO Meta Box
 * Description: Lightweight SEO meta box for posts, pages, and custom post types.
 * Version: 1.0.0
 * Author: Your Name
 */

if ( !defined( 'ABSPATH' ) ) exit;

class Simple_SEO_Meta_Box
{

  public function __construct() {
    add_action( 'add_meta_boxes', [ $this, 'register_meta_box' ] );
    add_action( 'save_post', [ $this, 'save_meta_box' ] );
    // add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
  }

  /**
   * Register meta box
   */
  public function register_meta_box() {

    $post_types = [
      'post','page'
    ];

    foreach ( $post_types as $post_type ) {
      add_meta_box(
        'simple_seo_meta_box',
        __( 'SEO', 'simple-seo' ),
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
    $og_image_url = $og_image_id ? wp_get_attachment_image_url($og_image_id, 'medium') : '';
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
      <textarea name="_seo_description" rows="3" class="widefat seo-desc"><?php echo esc_textarea( $description ); ?></textarea>
    </p>
    <p class="howto">Enter a description for the article. The meta description you enter here will also be used as a snippet for blog cards. If left blank, the text entered for "Excerpt" is used as the meta description.</p>
    <p>
      <label><strong><?php _e( 'Meta keywords', 'simple-seo' ); ?></strong></label>
      <input type="text" name="_seo_keywords" value="<?php echo esc_attr( $keywords ); ?>" class="widefat">
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
        $('#seo_og_preview').attr('src', '');
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
    !wp_verify_nonce( $_POST[ 'simple_seo_nonce_field' ], 'simple_seo_nonce' )
    ) return;

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;

    if ( !current_user_can( 'edit_post', $post_id ) ) return;

    $fields = [
      '_seo_title',
      '_seo_description',
      '_seo_keywords',
      '_seo_canonical',
      '_seo_og_image',
    ];

    foreach ( $fields as $field ) {
      if ( isset( $_POST[ $field ] ) ) {
        update_post_meta(
          $post_id,
          $field,
          sanitize_text_field( $_POST[ $field ] )
        );
      }
    }

    update_post_meta( $post_id, '_seo_noindex', isset( $_POST[ '_seo_noindex' ] ) ? '1' : '' );
    update_post_meta( $post_id, '_seo_nofollow', isset( $_POST[ '_seo_nofollow' ] ) ? '1' : '' );
    if ( isset( $_POST[ '_seo_type' ] ) ) {
      $allowed = [ 'article', 'website' ];

      $value = in_array( $_POST[ '_seo_type' ], $allowed, true )
        ? $_POST[ '_seo_type' ]
        : 'article';

      update_post_meta( $post_id, '_seo_type', $value );
    }

  }

  /**
   * Assets
   */
  public function enqueue_assets( $hook ) {

    if ( !in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) return;

    wp_enqueue_script(
      'simple-seo-admin',
      plugin_dir_url( __FILE__ ) . 'assets/seo-admin.js',
      [],
      '1.0',
      true
    );
  }
}

new Simple_SEO_Meta_Box();
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
  $desc  = $seo_desc ? $seo_desc : wp_strip_all_tags( get_the_excerpt( $post ) );
  $url   = $canonical ? $canonical : get_permalink( $post );
  if ( empty( $desc ) ) {
    $desc = get_the_excerpt( $post );
  }

  if ( empty( $keywords ) ) {
    $keywords = simple_seo_generate_keywords( $post->ID );
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

  // Image (featured image)

  if ($og_image_id) {
    $image = wp_get_attachment_image_url($og_image_id, 'full');
  } elseif (has_post_thumbnail($post)) {
    $image = get_the_post_thumbnail_url($post, 'large');
  } else {
    $image = get_template_directory_uri() . '/assets/img/common/ogp.png';
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