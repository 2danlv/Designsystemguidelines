<?php
/**
 * Template Name: Jobs - Tuyển Dụng
 */
get_header(); ?>

<main class="main-content">
    <!-- Hero Section -->
    <section style="position: relative; width: 100%; height: 50vh; background: #002d17; display: flex; align-items: center;">
        <div class="container">
            <span style="color: #f4aa1f; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">
                Join Our Team
            </span>
            <h1 style="color: white; font-size: 4rem; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-top: 1rem;">
                TUYỂN DỤNG<br>TONA CORPORATION
            </h1>
            <p style="color: rgba(255,255,255,0.7); font-size: 1.125rem; max-width: 40rem; margin-top: 1rem;">
                Cơ hội phát triển sự nghiệp cùng đội ngũ chuyên nghiệp hàng đầu
            </p>
        </div>
    </section>

    <!-- Job Listings -->
    <section style="width: 100%; background: white; padding: 5rem 1.5rem;">
        <div class="container">
            <?php
            $jobs = array(
                array(
                    'title' => 'Kỹ sư Giám sát Xây dựng (Site Engineer)',
                    'department' => 'Kỹ Thuật Công Trường',
                    'location' => 'Bình Dương / Đồng Nai',
                    'type' => 'Full-time',
                    'level' => 'Junior — Mid',
                    'salary' => 'Thỏa thuận',
                    'description' => 'Chịu trách nhiệm giám sát thi công tại hiện trường, kiểm soát chất lượng công trình, phối hợp với các nhà thầu phụ.',
                    'requirements' => array(
                        'Tốt nghiệp ĐH ngành Xây dựng Dân dụng',
                        'Kinh nghiệm tối thiểu 1 năm',
                        'Đọc hiểu bản vẽ kỹ thuật',
                        'Sức khỏe tốt, sẵn sàng làm việc tại công trường'
                    )
                ),
                array(
                    'title' => 'Kỹ sư MEP (Cơ Điện Lạnh)',
                    'department' => 'Kỹ Thuật MEP',
                    'location' => 'TP.HCM / Bình Dương',
                    'type' => 'Full-time',
                    'level' => 'Mid — Senior',
                    'salary' => '18 — 35 triệu',
                    'description' => 'Thiết kế, triển khai và giám sát hệ thống cơ điện (M&E) cho các dự án nhà máy công nghệ cao.',
                    'requirements' => array(
                        'Tốt nghiệp ĐH ngành Điện, Điện lạnh, Cơ khí',
                        'Tối thiểu 3 năm kinh nghiệm MEP công nghiệp',
                        'Ưu tiên có kinh nghiệm phòng sạch',
                        'Thành thạo Autocad MEP, Revit MEP'
                    )
                ),
                array(
                    'title' => 'Chuyên viên QA/QC Xây dựng',
                    'department' => 'Kiểm Soát Chất Lượng',
                    'location' => 'Nhiều khu vực',
                    'type' => 'Full-time',
                    'level' => 'Mid',
                    'salary' => '15 — 25 triệu',
                    'description' => 'Thực hiện kiểm tra, kiểm soát chất lượng vật liệu và thi công, lập hồ sơ nghiệm thu.',
                    'requirements' => array(
                        'Tốt nghiệp ĐH ngành Xây dựng',
                        'Am hiểu tiêu chuẩn ISO 9001, TCVN',
                        'Kinh nghiệm lập hồ sơ hoàn công',
                        'Kỹ năng viết báo cáo tốt'
                    )
                ),
                array(
                    'title' => 'Project Manager — Dự Án Công Nghiệp',
                    'department' => 'Quản Lý Dự Án',
                    'location' => 'TP.HCM / Toàn quốc',
                    'type' => 'Full-time',
                    'level' => 'Senior — Manager',
                    'salary' => '40 — 80 triệu',
                    'description' => 'Quản lý toàn diện các dự án EPC quy mô lớn từ 50 tỷ đến 500 tỷ đồng.',
                    'requirements' => array(
                        'Tốt nghiệp ĐH ngành Xây dựng, Quản lý Dự án; MBA là lợi thế',
                        'Tối thiểu 8 năm kinh nghiệm, 3 năm ở vị trí PM',
                        'Chứng chỉ PMP hoặc PRINCE2 ưu tiên',
                        'Tiếng Anh tốt, thành thạo MS Project'
                    )
                )
            );

            foreach ($jobs as $index => $job) :
            ?>
                <div style="background: <?php echo ($index % 2 == 0) ? 'white' : '#f9f9f7'; ?>; padding: 2.5rem; margin-bottom: 2rem; border-radius: 12px; border: 1px solid rgba(0,45,23,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="flex: 1;">
                            <h3 style="font-size: 1.5rem; font-weight: 800; color: #002d17; margin-bottom: 0.5rem;">
                                <?php echo esc_html($job['title']); ?>
                            </h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 1rem; color: rgba(0,45,23,0.6); font-size: 0.875rem;">
                                <span>📍 <?php echo esc_html($job['location']); ?></span>
                                <span>💼 <?php echo esc_html($job['type']); ?></span>
                                <span>📊 <?php echo esc_html($job['level']); ?></span>
                                <span>💰 <?php echo esc_html($job['salary']); ?></span>
                            </div>
                        </div>
                        <span style="background: #f4aa1f; color: #002d17; padding: 0.5rem 1rem; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; border-radius: 4px;">
                            Đang Tuyển
                        </span>
                    </div>
                    
                    <p style="color: rgba(0,45,23,0.7); line-height: 1.6; margin-bottom: 1.5rem;">
                        <?php echo esc_html($job['description']); ?>
                    </p>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <strong style="color: #002d17; display: block; margin-bottom: 0.75rem;">Yêu cầu:</strong>
                        <ul style="list-style: none; padding: 0;">
                            <?php foreach ($job['requirements'] as $req) : ?>
                                <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: rgba(0,45,23,0.7);">
                                    <span style="color: #f4aa1f;">✓</span>
                                    <span><?php echo esc_html($req); ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    
                    <a href="<?php echo esc_url(home_url('/lien-he')); ?>" 
                       style="display: inline-block; background: #002d17; color: white; padding: 0.75rem 1.5rem; font-weight: 700; text-transform: uppercase; font-size: 0.875rem; border-radius: 4px; text-decoration: none; transition: background 0.3s ease;">
                        Ứng Tuyển Ngay
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Benefits -->
    <section style="width: 100%; background: #002d17; padding: 5rem 1.5rem;">
        <div class="container">
            <div style="text-align: center; margin-bottom: 3rem;">
                <h2 style="color: white; font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">QUYỀN LỢI KHI LÀM VIỆC TẠI TONA</h2>
            </div>
            <div class="grid md:grid-cols-3" style="gap: 2rem;">
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">💰</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.75rem;">THU NHẬP HẤP DẪN</h4>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.875rem;">
                        Lương cạnh tranh + Thưởng dự án + Phụ cấp
                    </p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.75rem;">THĂNG TIẾN RÕ RÀNG</h4>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.875rem;">
                        Xét thăng chức 6 tháng/lần
                    </p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎓</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.75rem;">ĐÀO TẠO CHUYÊN SÂU</h4>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.875rem;">
                        Đào tạo nội bộ + Khóa học quốc tế
                    </p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🏥</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.75rem;">BẢO HIỂM ĐẦY ĐỦ</h4>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.875rem;">
                        BHXH + Bảo hiểm tai nạn 24/7
                    </p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🚗</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.75rem;">HỖ TRỢ DI CHUYỂN</h4>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.875rem;">
                        Xe đưa đón công trường hoặc phụ cấp xe
                    </p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                    <h4 style="color: #f4aa1f; font-weight: 800; margin-bottom: 0.75rem;">MÔI TRƯỜNG NĂNG ĐỘNG</h4>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.875rem;">
                        Team building + Du lịch hàng năm
                    </p>
                </div>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
