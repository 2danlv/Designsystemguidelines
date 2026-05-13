<?php get_header(); ?>

<main class="main-content">
    <div class="container" style="padding: 6rem 1.5rem; max-width: 50rem;">
        <?php while (have_posts()) : the_post(); ?>
            <article>
                <header style="margin-bottom: 2rem;">
                    <div style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 1rem;">
                        <?php the_category(', '); ?> • <?php echo get_the_date(); ?>
                    </div>
                    
                    <h1 style="font-size: 3rem; font-weight: 800; color: #002d17; line-height: 1.2; margin-bottom: 1rem;">
                        <?php the_title(); ?>
                    </h1>
                    
                    <div style="color: rgba(0,45,23,0.6); font-size: 0.875rem;">
                        Bởi <?php the_author(); ?> • <?php echo get_the_date(); ?>
                    </div>
                </header>
                
                <?php if (has_post_thumbnail()) : ?>
                    <div style="margin-bottom: 2rem; border-radius: 12px; overflow: hidden;">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>
                
                <div style="line-height: 1.8; color: #002d17; font-size: 1.125rem;">
                    <?php the_content(); ?>
                </div>
                
                <?php if (has_tag()) : ?>
                    <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(0,45,23,0.1);">
                        <strong style="color: #f4aa1f; text-transform: uppercase; font-size: 0.75rem;">Tags:</strong>
                        <?php the_tags('<span style="margin-left: 0.5rem;">', ', ', '</span>'); ?>
                    </div>
                <?php endif; ?>
            </article>
            
            <!-- Navigation -->
            <div style="margin-top: 4rem; display: flex; justify-content: space-between; gap: 2rem;">
                <div>
                    <?php previous_post_link('%link', '← %title'); ?>
                </div>
                <div style="text-align: right;">
                    <?php next_post_link('%link', '%title →'); ?>
                </div>
            </div>
            
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>
