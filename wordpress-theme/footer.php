<!-- FOOTER -->
<footer class="site-footer">
    <!-- CTA Band -->
    <div class="footer-cta">
        <div class="footer-cta-container">
            <div>
                <p class="footer-cta-title">Bắt đầu dự án của bạn</p>
                <h3 class="footer-cta-heading">Hãy kết nối với Tona Corporation</h3>
            </div>
            <a href="<?php echo esc_url(home_url('/lien-he')); ?>" class="btn-primary">Liên Hệ Ngay</a>
        </div>
    </div>

    <!-- Main Footer -->
    <div class="footer-main">
        <!-- Brand -->
        <div class="footer-brand">
            <div class="footer-logo">
                <div class="footer-logo-box">
                    <?php 
                    if (has_custom_logo()) {
                        the_custom_logo();
                    } else {
                        echo '<img src="' . get_template_directory_uri() . '/images/tona-logo.png" alt="' . get_bloginfo('name') . '" class="footer-logo-img">';
                    }
                    ?>
                </div>
            </div>
            <p class="footer-description">
                <?php echo get_bloginfo('description'); ?>
            </p>
            <div class="footer-certifications">
                <span class="cert-badge">ISO 9001</span>
                <span class="cert-badge">ISO 45001</span>
                <span class="cert-badge">ISO 14001</span>
            </div>
        </div>

        <!-- About -->
        <div class="footer-col">
            <h4 class="footer-heading">About Tona</h4>
            <ul class="footer-links">
                <li><a href="<?php echo esc_url(home_url('/gioi-thieu-tona')); ?>" class="footer-link">Giới Thiệu</a></li>
                <li><a href="<?php echo esc_url(home_url('/doi-ngu')); ?>" class="footer-link">Đội Ngũ Lãnh Đạo</a></li>
                <li><a href="<?php echo esc_url(home_url('/cuoc-song-tona')); ?>" class="footer-link">Cuộc Sống Tona</a></li>
                <li><a href="<?php echo esc_url(home_url('/dich-vu')); ?>" class="footer-link">Dịch Vụ</a></li>
                <li><a href="<?php echo esc_url(home_url('/tuyen-dung')); ?>" class="footer-link">Tuyển Dụng</a></li>
            </ul>
        </div>

        <!-- Projects -->
        <div class="footer-col">
            <h4 class="footer-heading">Dự Án</h4>
            <ul class="footer-links">
                <li><a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="footer-link">Industrial</a></li>
                <li><a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="footer-link">Commercial</a></li>
                <li><a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="footer-link">Solar Rooftop</a></li>
                <li><a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="footer-link">Hotels & Resorts</a></li>
                <li><a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="footer-link">Apartments</a></li>
            </ul>
        </div>

        <!-- Contact -->
        <div class="footer-col wide">
            <h4 class="footer-heading">Contact</h4>
            <ul class="contact-list">
                <li class="contact-item">
                    <span class="contact-icon">📍</span>
                    <span class="contact-text">
                        Toa nhà Tona, 123 Đường Xây Dựng<br>
                        Quận 1, TP. Hồ Chí Minh, Việt Nam
                    </span>
                </li>
                <li class="contact-item">
                    <span class="contact-icon">📞</span>
                    <a href="tel:+84901234567" class="contact-link">+84 (0)90 123 4567</a>
                </li>
                <li class="contact-item">
                    <span class="contact-icon">✉️</span>
                    <a href="mailto:info@tonacorp.vn" class="contact-link">info@tonacorp.vn</a>
                </li>
            </ul>
            
            <div class="social-links">
                <a href="#" class="social-link">f</a>
                <a href="#" class="social-link">in</a>
                <a href="#" class="social-link">yt</a>
            </div>
        </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
        <div class="footer-bottom-container">
            <span>© <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All Rights Reserved.</span>
            <div class="footer-legal">
                <a href="<?php echo esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a>
                <a href="<?php echo esc_url(home_url('/terms-of-service')); ?>">Terms of Service</a>
                <a href="<?php echo esc_url(home_url('/sitemap')); ?>">Sitemap</a>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

<style>
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
</style>

</body>
</html>
