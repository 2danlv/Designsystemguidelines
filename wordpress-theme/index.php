<?php get_header(); ?>

<!-- MAIN CONTENT -->
<main class="main-content">
    <!-- Hero Section -->
    <section style="position: relative; width: 100%; height: 100vh; min-height: 600px; background: #002d17; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1650656746788-dee910f6b42b?w=1920&q=85" 
             alt="Nâng Cấp Cải Tạo Nhà Máy Phoenix Contact" 
             style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,45,23,0.9), rgba(0,45,23,0.3), transparent);"></div>
        <div style="position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,45,23,0.6), transparent, transparent);"></div>
        
        <div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem 4rem; max-width: 80rem; margin: 0 auto;">
            <span style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">
                Industrial • Biên Hòa, Đồng Nai
            </span>
            <h1 style="color: white; font-size: 4rem; font-weight: 800; text-transform: uppercase; line-height: 1.05; margin: 1rem 0;">
                NÂNG CẤP CẢI TẠO<br>NHÀ MÁY PHOENIX CONTACT
            </h1>
            <p style="color: rgba(255,255,255,0.7); font-weight: 700; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.15em;">
                171 ngày · Zero Downtime · 25,000 m²
            </p>
            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem;">
                <a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="btn-primary">Xem Dự Án</a>
                <a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="btn-secondary">Portfolio →</a>
            </div>
        </div>
    </section>

    <!-- Marquee Strip -->
    <div style="width: 100%; background: #f4aa1f; overflow: hidden; padding: 0.625rem 0;">
        <div style="display: flex; white-space: nowrap; animation: marquee 26s linear infinite;">
            <span style="padding: 0 1.5rem; color: #002d17; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;">ISO 9001:2015 • Zero Accident • ISO 45001:2018 • 500+ Dự Án • ISO 14001:2015 • 15+ Năm Kinh Nghiệm •</span>
            <span style="padding: 0 1.5rem; color: #002d17; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;">ISO 9001:2015 • Zero Accident • ISO 45001:2018 • 500+ Dự Án • ISO 14001:2015 • 15+ Năm Kinh Nghiệm •</span>
        </div>
    </div>

    <!-- Slogan Section -->
    <section style="position: relative; width: 100%; background: #002d17; padding: 8rem 2rem; text-align: center;">
        <span style="color: #f4aa1f; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.25em; display: block; margin-bottom: 1rem;">
            <?php bloginfo('name'); ?> — Build It Right
        </span>
        <h2 style="color: white; font-size: 3.5rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1.5rem;">
            TIÊN PHONG KIẾN TẠO<br>CHUẨN MỰC MỚI
        </h2>
        <p style="color: rgba(255,255,255,0.7); font-size: 1.125rem; max-width: 40rem; margin: 0 auto;">
            Hơn 15 năm đồng hành cùng các tập đoàn đa quốc gia — mang lại công trình vượt tiêu chuẩn, đúng tiến độ, đúng cam kết.
        </p>
    </section>

    <!-- WordPress Loop for Posts (if any) -->
    <?php if (have_posts()) : ?>
        <section class="container" style="padding: 4rem 1.5rem;">
            <h2>Tin Tức Mới Nhất</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <?php while (have_posts()) : the_post(); ?>
                    <article>
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('large'); ?>
                            </a>
                        <?php endif; ?>
                        <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                        <p><?php the_excerpt(); ?></p>
                        <a href="<?php the_permalink(); ?>">Đọc thêm →</a>
                    </article>
                <?php endwhile; ?>
            </div>
        </section>
    <?php endif; ?>

</main>

<?php get_footer(); ?>
