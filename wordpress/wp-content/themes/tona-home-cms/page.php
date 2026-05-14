<?php
/**
 * Minimal page template for the headless CMS.
 */

get_header();
?>
<main style="max-width: 720px; margin: 80px auto; padding: 0 24px; font-family: system-ui, sans-serif;">
    <?php
    while ( have_posts() ) :
        the_post();
        ?>
        <h1><?php the_title(); ?></h1>
        <p>This content is managed in WordPress and consumed by the React frontend.</p>
        <?php
    endwhile;
    ?>
</main>
<?php
get_footer();
