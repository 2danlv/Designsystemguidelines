<?php
/**
 * Minimal headless theme entry.
 *
 * This WordPress install is used as a CMS only. The public website is rendered
 * by the React frontend.
 */

get_header();
?>
<main style="max-width: 720px; margin: 80px auto; font-family: system-ui, sans-serif;">
    <h1><?php bloginfo( 'name' ); ?></h1>
    <p>This WordPress site provides content for the React frontend.</p>
</main>
<?php
get_footer();
