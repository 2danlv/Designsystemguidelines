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
        <div>
            <?php the_content(); ?>
        </div>
        <?php
    endwhile;
    ?>
</main>
<?php
get_footer();
