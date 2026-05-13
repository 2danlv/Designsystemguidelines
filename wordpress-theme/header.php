<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- HEADER -->
<header class="site-header">
    <div class="header-container">
        <!-- Logo -->
        <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
            <div class="logo-box">
                <?php 
                if (has_custom_logo()) {
                    the_custom_logo();
                } else {
                    echo '<img src="' . get_template_directory_uri() . '/images/tona-logo.png" alt="' . get_bloginfo('name') . '" class="logo-img">';
                }
                ?>
            </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-desktop">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="nav-link">HOME</a>
            <div class="nav-dropdown">
                <button class="dropdown-toggle">
                    VỀ TONA
                    <span>▼</span>
                </button>
                <div class="dropdown-menu">
                    <a href="<?php echo esc_url(home_url('/gioi-thieu-tona')); ?>" class="dropdown-item">Giới Thiệu</a>
                    <a href="<?php echo esc_url(home_url('/doi-ngu')); ?>" class="dropdown-item">Đội Ngũ</a>
                    <a href="<?php echo esc_url(home_url('/cuoc-song-tona')); ?>" class="dropdown-item">Cuộc Sống Tona</a>
                </div>
            </div>
            <a href="<?php echo esc_url(home_url('/dich-vu')); ?>" class="nav-link">DỊCH VỤ</a>
            <a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="nav-link">DỰ ÁN</a>
            <a href="<?php echo esc_url(home_url('/news')); ?>" class="nav-link">TIN TỨC</a>
            <a href="<?php echo esc_url(home_url('/tuyen-dung')); ?>" class="nav-link">TUYỂN DỤNG</a>
        </nav>

        <!-- Language + Mobile Toggle -->
        <div class="flex items-center gap-3">
            <div class="lang-switcher">
                <button class="lang-btn active">VI</button>
                <button class="lang-btn">EN</button>
            </div>
            <button class="mobile-toggle">☰</button>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="mobile-nav-link">HOME</a>
        <a href="<?php echo esc_url(home_url('/gioi-thieu-tona')); ?>" class="mobile-nav-link">Giới Thiệu</a>
        <a href="<?php echo esc_url(home_url('/doi-ngu')); ?>" class="mobile-nav-link">Đội Ngũ</a>
        <a href="<?php echo esc_url(home_url('/cuoc-song-tona')); ?>" class="mobile-nav-link">Cuộc Sống Tona</a>
        <a href="<?php echo esc_url(home_url('/dich-vu')); ?>" class="mobile-nav-link">DỊCH VỤ</a>
        <a href="<?php echo esc_url(home_url('/du-an-tona')); ?>" class="mobile-nav-link">DỰ ÁN</a>
        <a href="<?php echo esc_url(home_url('/news')); ?>" class="mobile-nav-link">TIN TỨC</a>
        <a href="<?php echo esc_url(home_url('/tuyen-dung')); ?>" class="mobile-nav-link">TUYỂN DỤNG</a>
    </div>
</header>
