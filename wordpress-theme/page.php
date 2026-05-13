<?php get_header(); ?>

<main class="main-content">
    <div class="container" style="padding: 6rem 1.5rem;">
        <?php while (have_posts()) : the_post(); ?>
            <article>
                <h1 style="font-size: 3rem; font-weight: 800; color: #002d17; margin-bottom: 2rem;">
                    <?php the_title(); ?>
                </h1>
                
                <?php if (has_post_thumbnail()) : ?>
                    <div style="margin-bottom: 2rem;">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>
                
                <div style="line-height: 1.8; color: #002d17;">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>
