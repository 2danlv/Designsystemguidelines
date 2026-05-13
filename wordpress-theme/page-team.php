<?php
/**
 * Template Name: Team - Đội Ngũ
 */
get_header(); ?>

<main class="main-content">
    <!-- Hero Section -->
    <section style="position: relative; width: 100%; height: 50vh; min-height: 400px; background: #002d17; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1774599730788-a74cd9253b56?w=1920&q=85" 
             alt="Team Tona" 
             style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: rgba(0,45,23,0.75);"></div>
        
        <div class="container" style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center;">
            <span style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">
                Leadership Team
            </span>
            <h1 style="color: white; font-size: 4rem; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-top: 1rem;">
                ĐỘI NGŨ LÃNH ĐẠO
            </h1>
        </div>
    </section>

    <!-- Leadership Team -->
    <section style="width: 100%; background: white; padding: 5rem 1.5rem;">
        <div class="container">
            <div class="grid md:grid-cols-2" style="gap: 3rem;">
                <!-- Member 1 - Chairman -->
                <div style="display: flex; gap: 2rem; background: #f9f9f7; padding: 2rem; border-radius: 12px;">
                    <div style="position: relative; width: 150px; height: 150px; flex-shrink: 0; overflow: hidden; border-radius: 12px;">
                        <img src="https://images.unsplash.com/photo-1720501828093-c792c10e3f0b?w=400&q=80" 
                             alt="Nguyễn Trọng Khải" 
                             style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="flex: 1;">
                        <h3 style="font-size: 1.5rem; font-weight: 800; color: #002d17; margin-bottom: 0.25rem;">Nguyễn Trọng Khải</h3>
                        <p style="color: #f4aa1f; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 1rem;">
                            Chủ Tịch HĐQT
                        </p>
                        <p style="color: rgba(0,45,23,0.7); font-size: 0.875rem; line-height: 1.6;">
                            Hơn 25 năm kinh nghiệm trong lĩnh vực xây dựng công nghiệp và thương mại. Người sáng lập Tona Corporation 
                            với tầm nhìn kiến tạo chuẩn mực mới trong ngành xây dựng Việt Nam.
                        </p>
                    </div>
                </div>

                <!-- Member 2 - CEO -->
                <div style="display: flex; gap: 2rem; background: #f9f9f7; padding: 2rem; border-radius: 12px;">
                    <div style="position: relative; width: 150px; height: 150px; flex-shrink: 0; overflow: hidden; border-radius: 12px;">
                        <img src="https://images.unsplash.com/photo-1774599730788-a74cd9253b56?w=400&q=80" 
                             alt="Trần Minh Đức" 
                             style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="flex: 1;">
                        <h3 style="font-size: 1.5rem; font-weight: 800; color: #002d17; margin-bottom: 0.25rem;">Trần Minh Đức</h3>
                        <p style="color: #f4aa1f; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 1rem;">
                            Tổng Giám Đốc
                        </p>
                        <p style="color: rgba(0,45,23,0.7); font-size: 0.875rem; line-height: 1.6;">
                            MBA tại Singapore, 18 năm kinh nghiệm quản lý dự án EPC quy mô lớn cho các tập đoàn đa quốc gia. 
                            Chuyên gia về quản trị rủi ro và tối ưu chuỗi cung ứng xây dựng.
                        </p>
                    </div>
                </div>

                <!-- Member 3 - COO -->
                <div style="display: flex; gap: 2rem; background: #f9f9f7; padding: 2rem; border-radius: 12px;">
                    <div style="position: relative; width: 150px; height: 150px; flex-shrink: 0; overflow: hidden; border-radius: 12px;">
                        <img src="https://images.unsplash.com/photo-1758691737605-69a0e78bd193?w=400&q=80" 
                             alt="Lê Thị Hương" 
                             style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="flex: 1;">
                        <h3 style="font-size: 1.5rem; font-weight: 800; color: #002d17; margin-bottom: 0.25rem;">Lê Thị Hương</h3>
                        <p style="color: #f4aa1f; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 1rem;">
                            Giám Đốc Vận Hành
                        </p>
                        <p style="color: rgba(0,45,23,0.7); font-size: 0.875rem; line-height: 1.6;">
                            15 năm kinh nghiệm điều hành vận hành đa dự án đồng thời. Chuyên gia triển khai hệ thống quản lý chất lượng 
                            ISO và an toàn lao động trong môi trường công trường phức tạp.
                        </p>
                    </div>
                </div>

                <!-- Member 4 - Project Director -->
                <div style="display: flex; gap: 2rem; background: #f9f9f7; padding: 2rem; border-radius: 12px;">
                    <div style="position: relative; width: 150px; height: 150px; flex-shrink: 0; overflow: hidden; border-radius: 12px;">
                        <img src="https://images.unsplash.com/photo-1758518726775-70e538b0d46e?w=400&q=80" 
                             alt="Phạm Văn Hải" 
                             style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="flex: 1;">
                        <h3 style="font-size: 1.5rem; font-weight: 800; color: #002d17; margin-bottom: 0.25rem;">Phạm Văn Hải</h3>
                        <p style="color: #f4aa1f; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 1rem;">
                            Giám Đốc Dự Án
                        </p>
                        <p style="color: rgba(0,45,23,0.7); font-size: 0.875rem; line-height: 1.6;">
                            Kỹ sư xây dựng ĐH Bách Khoa TP.HCM, 20 năm chỉ huy các dự án nhà máy công nghệ cao. Người dẫn dắt thành công 
                            hơn 200 dự án công nghiệp trên khắp cả nước.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Values -->
    <section style="width: 100%; background: #002d17; padding: 5rem 1.5rem;">
        <div class="container">
            <div style="text-align: center; margin-bottom: 3rem;">
                <h2 style="color: white; font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">GIÁ TRỊ CỐT LÕI</h2>
                <p style="color: rgba(255,255,255,0.7); max-width: 40rem; margin: 0 auto;">
                    Những giá trị định hướng mọi hành động của đội ngũ Tona
                </p>
            </div>
            <div class="grid md:grid-cols-4" style="gap: 2rem;">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">💎</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.5rem;">CHẤT LƯỢNG</h4>
                    <p style="color: rgba(255,255,255,0.6); font-size: 0.875rem;">Cam kết vượt chuẩn trong mọi dự án</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.5rem;">AN TOÀN</h4>
                    <p style="color: rgba(255,255,255,0.6); font-size: 0.875rem;">Zero accident - Ưu tiên số 1</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.5rem;">TIẾN ĐỘ</h4>
                    <p style="color: rgba(255,255,255,0.6); font-size: 0.875rem;">Đúng hạn, đúng cam kết</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🤝</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.5rem;">ĐỒNG HÀNH</h4>
                    <p style="color: rgba(255,255,255,0.6); font-size: 0.875rem;">Đối tác lâu dài với khách hàng</p>
                </div>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
