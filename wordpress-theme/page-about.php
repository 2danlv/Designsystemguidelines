<?php
/**
 * Template Name: About - Giới Thiệu
 */
get_header(); ?>

<main class="main-content">
    <!-- Hero Section -->
    <section style="position: relative; width: 100%; height: 60vh; min-height: 400px; background: #002d17; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1748002388689-c62b45d5c28b?w=1920&q=85" 
             alt="About Tona" 
             style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,45,23,0.9), rgba(0,45,23,0.3));"></div>
        
        <div class="container" style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 2rem;">
            <span style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem;">
                About Us
            </span>
            <h1 style="color: white; font-size: 4rem; font-weight: 800; text-transform: uppercase; line-height: 1.05;">
                GIỚI THIỆU<br>TONA CORPORATION
            </h1>
            <p style="color: rgba(255,255,255,0.7); font-size: 1.125rem; max-width: 40rem; margin-top: 1rem;">
                Nhà thầu xây dựng và MEP hàng đầu Việt Nam
            </p>
        </div>
    </section>

    <!-- Company Overview -->
    <section style="width: 100%; background: white; padding: 5rem 1.5rem;">
        <div class="container">
            <div class="grid md:grid-cols-2" style="gap: 4rem; align-items: center;">
                <div>
                    <div style="width: 4rem; height: 0.25rem; background: #f4aa1f; margin-bottom: 1.5rem;"></div>
                    <h2 style="font-size: 2.5rem; font-weight: 800; color: #002d17; margin-bottom: 1.5rem;">
                        VỀ TONA CORPORATION
                    </h2>
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.8; margin-bottom: 1rem;">
                        Được thành lập từ năm 2009, Tona Corporation đã khẳng định vị thế là một trong những nhà thầu xây dựng 
                        và MEP (Cơ - Điện - Lạnh) hàng đầu tại Việt Nam, chuyên cung cấp các giải pháp xây dựng toàn diện 
                        cho các dự án công nghiệp, thương mại và dân dụng.
                    </p>
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.8;">
                        Với hơn 15 năm kinh nghiệm và đội ngũ 800+ chuyên gia, kỹ sư giàu kinh nghiệm, chúng tôi đã hoàn thành 
                        hơn 500 dự án cho các tập đoàn đa quốc gia hàng đầu, luôn đảm bảo chất lượng vượt chuẩn, tiến độ đúng 
                        cam kết và an toàn tuyệt đối.
                    </p>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1650656746788-dee910f6b42b?w=800&q=80" 
                         alt="Tona Project" 
                         style="width: 100%; border-radius: 12px;">
                </div>
            </div>
        </div>
    </section>

    <!-- Stats -->
    <section style="width: 100%; background: #002d17; padding: 4rem 1.5rem;">
        <div class="container">
            <div class="grid md:grid-cols-4" style="gap: 3rem; text-align: center;">
                <div>
                    <div style="color: #f4aa1f; font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem;">15+</div>
                    <div style="color: white; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em;">Năm Kinh Nghiệm</div>
                </div>
                <div>
                    <div style="color: #f4aa1f; font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem;">500+</div>
                    <div style="color: white; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em;">Dự Án Hoàn Thành</div>
                </div>
                <div>
                    <div style="color: #f4aa1f; font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem;">800+</div>
                    <div style="color: white; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em;">Nhân Sự</div>
                </div>
                <div>
                    <div style="color: #f4aa1f; font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem;">100%</div>
                    <div style="color: white; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em;">Khách Hàng Hài Lòng</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mission & Vision -->
    <section style="width: 100%; background: #f9f9f7; padding: 5rem 1.5rem;">
        <div class="container">
            <div class="grid md:grid-cols-2" style="gap: 3rem;">
                <div style="background: white; padding: 3rem; border-radius: 12px;">
                    <div style="width: 3.5rem; height: 3.5rem; background: #f4aa1f; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                        <span style="font-size: 1.5rem;">🎯</span>
                    </div>
                    <h3 style="font-size: 1.5rem; font-weight: 800; color: #002d17; margin-bottom: 1rem;">SỨ MỆNH</h3>
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.8;">
                        Mang đến các giải pháp xây dựng chất lượng cao, an toàn và bền vững, góp phần phát triển cơ sở hạ tầng 
                        công nghiệp và thương mại của Việt Nam, đồng hành cùng sự thành công của khách hàng.
                    </p>
                </div>
                <div style="background: white; padding: 3rem; border-radius: 12px;">
                    <div style="width: 3.5rem; height: 3.5rem; background: #46aa85; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                        <span style="font-size: 1.5rem;">👁️</span>
                    </div>
                    <h3 style="font-size: 1.5rem; font-weight: 800; color: #002d17; margin-bottom: 1rem;">TẦM NHÌN</h3>
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.8;">
                        Trở thành nhà thầu xây dựng và MEP hàng đầu khu vực Đông Nam Á, được công nhận về năng lực thi công 
                        chuyên nghiệp, tiêu chuẩn quốc tế và cam kết phát triển bền vững.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Certifications -->
    <section style="width: 100%; background: white; padding: 5rem 1.5rem;">
        <div class="container">
            <div style="text-align: center; margin-bottom: 3rem;">
                <div style="width: 4rem; height: 0.25rem; background: #f4aa1f; margin: 0 auto 1.5rem;"></div>
                <h2 style="font-size: 2.5rem; font-weight: 800; color: #002d17;">CHỨNG NHẬN & GIẢI THƯỞNG</h2>
            </div>
            <div class="grid md:grid-cols-3" style="gap: 2rem;">
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
                    <h4 style="font-weight: 800; color: #002d17; margin-bottom: 0.5rem;">ISO 9001:2015</h4>
                    <p style="color: rgba(0,45,23,0.6); font-size: 0.875rem;">Hệ thống Quản lý Chất lượng</p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                    <h4 style="font-weight: 800; color: #002d17; margin-bottom: 0.5rem;">ISO 45001:2018</h4>
                    <p style="color: rgba(0,45,23,0.6); font-size: 0.875rem;">An toàn & Sức khỏe Nghề nghiệp</p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🌱</div>
                    <h4 style="font-weight: 800; color: #002d17; margin-bottom: 0.5rem;">ISO 14001:2015</h4>
                    <p style="color: rgba(0,45,23,0.6); font-size: 0.875rem;">Quản lý Môi trường</p>
                </div>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
