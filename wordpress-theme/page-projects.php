<?php
/**
 * Template Name: Projects - Dự Án
 */
get_header(); ?>

<main class="main-content">
    <!-- Hero Section -->
    <section style="position: relative; width: 100%; height: 50vh; background: #002d17; display: flex; align-items: center;">
        <div class="container">
            <span style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">
                Portfolio
            </span>
            <h1 style="color: white; font-size: 4rem; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-top: 1rem;">
                DỰ ÁN<br>NỔI BẬT
            </h1>
        </div>
    </section>

    <!-- Projects Grid -->
    <section style="width: 100%; background: white; padding: 5rem 1.5rem;">
        <div class="container">
            <div class="grid md:grid-cols-3" style="gap: 2rem;">
                <?php
                // Example projects - In production, these would come from WordPress posts
                $projects = array(
                    array(
                        'title' => 'Nâng Cấp Cải Tạo Nhà Máy Phoenix Contact',
                        'category' => 'Industrial',
                        'location' => 'Biên Hòa, Đồng Nai',
                        'area' => '25,000 m²',
                        'image' => 'https://images.unsplash.com/photo-1650656746788-dee910f6b42b?w=800&q=80'
                    ),
                    array(
                        'title' => 'Nâng Cấp Cải Tạo TTTM GO! Đồng Nai',
                        'category' => 'Commercial',
                        'location' => 'Biên Hòa, Đồng Nai',
                        'area' => '46,100 m²',
                        'image' => 'https://images.unsplash.com/photo-1761333477936-56fbc7851c65?w=800&q=80'
                    ),
                    array(
                        'title' => 'Nhà máy Spartronics Việt Nam 2',
                        'category' => 'Industrial',
                        'location' => 'Bình Dương',
                        'area' => '40,000 m²',
                        'image' => 'https://images.unsplash.com/photo-1772442198624-4fc4d7281e89?w=800&q=80'
                    ),
                    array(
                        'title' => 'SV Solar Rooftop — 15 MWp',
                        'category' => 'Solar Rooftop',
                        'location' => 'Nhiều khu vực',
                        'area' => '82,000 m² mái',
                        'image' => 'https://images.unsplash.com/photo-1635424825057-7fb6dcd651ef?w=800&q=80'
                    ),
                    array(
                        'title' => 'Hoa Binh Phu Quoc Hotel Resort',
                        'category' => 'Hotels',
                        'location' => 'Phú Quốc, Kiên Giang',
                        'area' => '95,000 m²',
                        'image' => 'https://images.unsplash.com/photo-1772006807170-5750a2aa3713?w=800&q=80'
                    ),
                    array(
                        'title' => 'Căn Hộ Cao Cấp Sunny Plaza',
                        'category' => 'Apartments',
                        'location' => 'Gò Vấp, TP.HCM',
                        'area' => '32,500 m²',
                        'image' => 'https://images.unsplash.com/photo-1768807842143-d1493bde6931?w=800&q=80'
                    )
                );

                foreach ($projects as $project) :
                ?>
                    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.3s ease;">
                        <div style="position: relative; width: 100%; padding-bottom: 75%; overflow: hidden; background: #bcd8cb;">
                            <img src="<?php echo esc_url($project['image']); ?>" 
                                 alt="<?php echo esc_attr($project['title']); ?>" 
                                 style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
                            <span style="position: absolute; top: 1rem; left: 1rem; background: #f4aa1f; color: #002d17; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                                <?php echo esc_html($project['category']); ?>
                            </span>
                        </div>
                        <div style="padding: 1.5rem;">
                            <h3 style="font-weight: 800; color: #002d17; font-size: 1.125rem; margin-bottom: 0.75rem; line-height: 1.3;">
                                <?php echo esc_html($project['title']); ?>
                            </h3>
                            <p style="color: rgba(0,45,23,0.6); font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">
                                📍 <?php echo esc_html($project['location']); ?>
                            </p>
                            <p style="color: rgba(0,45,23,0.6); font-size: 0.75rem; font-weight: 700;">
                                📐 <?php echo esc_html($project['area']); ?>
                            </p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Categories Filter -->
    <section style="width: 100%; background: #f9f9f7; padding: 3rem 1.5rem;">
        <div class="container">
            <div style="text-align: center;">
                <h3 style="font-size: 1.5rem; font-weight: 800; color: #002d17; margin-bottom: 2rem;">LĨNH VỰC DỰ ÁN</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
                    <span style="padding: 0.75rem 1.5rem; background: #002d17; color: white; border-radius: 4px; font-weight: 700; font-size: 0.875rem;">Industrial</span>
                    <span style="padding: 0.75rem 1.5rem; background: white; color: #002d17; border-radius: 4px; font-weight: 700; font-size: 0.875rem;">Commercial</span>
                    <span style="padding: 0.75rem 1.5rem; background: white; color: #002d17; border-radius: 4px; font-weight: 700; font-size: 0.875rem;">Solar Rooftop</span>
                    <span style="padding: 0.75rem 1.5rem; background: white; color: #002d17; border-radius: 4px; font-weight: 700; font-size: 0.875rem;">Hotels & Resorts</span>
                    <span style="padding: 0.75rem 1.5rem; background: white; color: #002d17; border-radius: 4px; font-weight: 700; font-size: 0.875rem;">Apartments</span>
                </div>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
