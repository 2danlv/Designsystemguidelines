<?php
/**
 * Template Name: Services - Dịch Vụ
 */
get_header(); ?>

<main class="main-content">
    <!-- Hero Section -->
    <section style="position: relative; width: 100%; height: 50vh; background: #002d17; display: flex; align-items: center;">
        <div class="container">
            <span style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">
                Our Services
            </span>
            <h1 style="color: white; font-size: 4rem; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-top: 1rem;">
                DỊCH VỤ<br>CỦA CHÚNG TÔI
            </h1>
        </div>
    </section>

    <!-- Services Grid -->
    <section style="width: 100%; background: white; padding: 5rem 1.5rem;">
        <div class="container">
            <!-- Service 1 -->
            <div class="grid md:grid-cols-2" style="gap: 4rem; align-items: center; margin-bottom: 6rem;">
                <div>
                    <div style="width: 3.5rem; height: 3.5rem; border: 2px solid #f4aa1f; background: #f4aa1f; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                        🔧
                    </div>
                    <p style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">
                        Renovation & Upgrade
                    </p>
                    <h2 style="font-size: 2.5rem; font-weight: 800; color: #002d17; margin-bottom: 1rem;">
                        NÂNG CẤP CẢI TẠO
                    </h2>
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.8; margin-bottom: 1.5rem;">
                        Thi công cải tạo công trình đang vận hành với zero downtime — tiêu chuẩn an toàn & vệ sinh khắt khe nhất. 
                        Chuyên môn hóa trong lĩnh vực cải tạo nhà máy, trung tâm thương mại và văn phòng.
                    </p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Thi công không dừng sản xuất (Zero Downtime)</span>
                        </li>
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Cải tạo hệ thống HVAC & phòng sạch</span>
                        </li>
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Nâng cấp hệ thống điện & chiếu sáng</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1650656746788-dee910f6b42b?w=800&q=80" 
                         alt="Renovation" 
                         style="width: 100%; border-radius: 12px;">
                </div>
            </div>

            <!-- Service 2 -->
            <div class="grid md:grid-cols-2" style="gap: 4rem; align-items: center; margin-bottom: 6rem; direction: rtl;">
                <div style="direction: ltr;">
                    <div style="width: 3.5rem; height: 3.5rem; border: 2px solid #f4aa1f; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                        ✏️
                    </div>
                    <p style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">
                        Design & Build EPC
                    </p>
                    <h2 style="font-size: 2.5rem; font-weight: 800; color: #002d17; margin-bottom: 1rem;">
                        THIẾT KẾ & XÂY DỰNG
                    </h2>
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.8; margin-bottom: 1.5rem;">
                        Giải pháp tổng thầu EPC toàn diện từ thiết kế đến bàn giao, kiểm soát chất lượng tập trung. 
                        Chuyên thực hiện các dự án nhà máy, kho xưởng và công trình thương mại quy mô lớn.
                    </p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Thiết kế kỹ thuật chi tiết (Detail Engineering)</span>
                        </li>
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Mua sắm thiết bị & vật tư (Procurement)</span>
                        </li>
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Thi công & bàn giao (Construction)</span>
                        </li>
                    </ul>
                </div>
                <div style="direction: ltr;">
                    <img src="https://images.unsplash.com/photo-1772442198624-4fc4d7281e89?w=800&q=80" 
                         alt="EPC" 
                         style="width: 100%; border-radius: 12px;">
                </div>
            </div>

            <!-- Service 3 -->
            <div class="grid md:grid-cols-2" style="gap: 4rem; align-items: center; margin-bottom: 6rem;">
                <div>
                    <div style="width: 3.5rem; height: 3.5rem; border: 2px solid #f4aa1f; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                        🏢
                    </div>
                    <p style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">
                        Civil & Structural
                    </p>
                    <h2 style="font-size: 2.5rem; font-weight: 800; color: #002d17; margin-bottom: 1rem;">
                        THI CÔNG DÂN DỤNG
                    </h2>
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.8; margin-bottom: 1.5rem;">
                        Kết cấu thép, bê tông cốt thép cho nhà máy, kho xưởng, tòa nhà thương mại quy mô lớn. 
                        Chuyên môn sâu về móng cọc, kết cấu thép tiền chế PEB và bê tông cường độ cao.
                    </p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Kết cấu thép tiền chế PEB</span>
                        </li>
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Bê tông cốt thép B40 - B60</span>
                        </li>
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Móng cọc khoan nhồi & cọc ép</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1761333477936-56fbc7851c65?w=800&q=80" 
                         alt="Civil" 
                         style="width: 100%; border-radius: 12px;">
                </div>
            </div>

            <!-- Service 4 -->
            <div class="grid md:grid-cols-2" style="gap: 4rem; align-items: center; direction: rtl;">
                <div style="direction: ltr;">
                    <div style="width: 3.5rem; height: 3.5rem; border: 2px solid #f4aa1f; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                        ⚡
                    </div>
                    <p style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">
                        MEP Systems
                    </p>
                    <h2 style="font-size: 2.5rem; font-weight: 800; color: #002d17; margin-bottom: 1rem;">
                        CƠ ĐIỆN MEP
                    </h2>
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.8; margin-bottom: 1.5rem;">
                        Hệ thống M&E tiên tiến cho phòng sạch, nhà máy điện tử và công trình kỹ thuật cao. 
                        Đội ngũ kỹ sư MEP chuyên sâu về HVAC, điện công nghiệp và BMS.
                    </p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Hệ thống HVAC & phòng sạch ISO 5-8</span>
                        </li>
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Điện trung thế & hạ thế công nghiệp</span>
                        </li>
                        <li style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #f4aa1f;">✓</span>
                            <span style="color: rgba(0,45,23,0.7);">Hệ thống BMS & ELV tích hợp</span>
                        </li>
                    </ul>
                </div>
                <div style="direction: ltr;">
                    <img src="https://images.unsplash.com/photo-1748002388689-c62b45d5c28b?w=800&q=80" 
                         alt="MEP" 
                         style="width: 100%; border-radius: 12px;">
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section style="width: 100%; background: #f4aa1f; padding: 4rem 1.5rem; text-align: center;">
        <div class="container">
            <h2 style="font-size: 2.5rem; font-weight: 800; color: #002d17; margin-bottom: 1rem;">
                BẮT ĐẦU DỰ ÁN CỦA BẠN
            </h2>
            <p style="color: rgba(0,45,23,0.7); font-size: 1.125rem; margin-bottom: 2rem;">
                Liên hệ với chúng tôi để được tư vấn giải pháp tối ưu nhất
            </p>
            <a href="<?php echo esc_url(home_url('/lien-he')); ?>" 
               style="display: inline-block; background: #002d17; color: white; padding: 1rem 2rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; text-decoration: none;">
                Liên Hệ Ngay
            </a>
        </div>
    </section>

</main>

<?php get_footer(); ?>
