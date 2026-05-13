const asset = () => "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80";

const projects = [
  {
    slug: "nang-cap-cai-tao-nha-may-phoenix-contact-bien-hoa-dong-nai",
    title: "Nâng cấp cải tạo nhà máy Phoenix Contact",
    category: "Industrial",
    image: "https://images.unsplash.com/photo-1650656746788-dee910f6b42b?w=1200&q=80",
    location: "Biên Hòa, Đồng Nai",
    area: "25,000 m2",
    scale: "2.5 ha",
    client: "Phoenix Contact GmbH",
    year: "2024",
    status: "Hoàn thành",
    duration: "171 ngày",
    desc: "Dự án nâng cấp toàn diện nhà máy đang vận hành, yêu cầu kiểm soát an toàn, bụi, tiếng ồn và tiến độ ở mức rất chặt chẽ.",
    items: ["Hệ thống HVAC và phòng sạch ISO 7", "Điện hạ thế và chiếu sáng LED", "Sàn epoxy kháng hóa chất", "PCCC FM200"],
  },
  {
    slug: "nang-cap-cai-tao-trung-tam-thuong-mai-go-dong-nai-bien-hoa-dong-nai",
    title: "Nâng cấp cải tạo TTTM GO! Đồng Nai",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1761333477936-56fbc7851c65?w=1200&q=80",
    location: "Biên Hòa, Đồng Nai",
    area: "46,100 m2",
    scale: "3.2 ha",
    client: "Central Retail Corporation",
    year: "2023",
    status: "Hoàn thành",
    duration: "8 tháng",
    desc: "Cải tạo mở rộng trung tâm thương mại trong khi vẫn duy trì hoạt động kinh doanh liên tục cho khách thuê và khách mua sắm.",
    items: ["Mặt tiền và hệ thống biển hiệu", "HVAC trung tâm 3,000 TR", "Sàn và trần thương mại", "PCCC và thoát hiểm"],
  },
  {
    slug: "nha-may-spartronics-viet-nam-2",
    title: "Nhà máy Spartronics Việt Nam 2",
    category: "Industrial",
    image: "https://images.unsplash.com/photo-1772442198624-4fc4d7281e89?w=1200&q=80",
    location: "Bình Dương",
    area: "40,000 m2",
    scale: "4.0 ha",
    client: "Spartronics Vietnam",
    year: "2025",
    status: "Đang thi công",
    duration: "12 tháng",
    desc: "Nhà máy điện tử công nghệ cao với môi trường phòng sạch và hệ thống MEP chính xác phục vụ dây chuyền sản xuất tinh vi.",
    items: ["Kết cấu thép tiền chế", "Phòng sạch ISO 6 và ISO 7", "Hệ thống ELV và BMS", "Khí đặc biệt N2, CO2"],
  },
  {
    slug: "sv-solar-rooftop",
    title: "SV Solar Rooftop - 15 MWp",
    category: "Solar Rooftop",
    image: "https://images.unsplash.com/photo-1635424825057-7fb6dcd651ef?w=1200&q=80",
    location: "Nhiều khu vực",
    area: "82,000 m2 mái",
    scale: "15 MWp",
    client: "SV Group",
    year: "2024",
    status: "Hoàn thành",
    duration: "6 tháng",
    desc: "Triển khai hệ thống điện mặt trời áp mái quy mô lớn, hỗ trợ mục tiêu năng lượng xanh và giảm phát thải cho chuỗi nhà máy.",
    items: ["36,000 tấm pin", "Inverter và monitoring", "Khung nhôm chịu gió", "Kết nối lưới EVN"],
  },
  {
    slug: "hoa-binh-phu-quoc-hotel-resort",
    title: "Hoa Binh Phu Quoc Hotel Resort",
    category: "Hotels",
    image: "https://images.unsplash.com/photo-1772006807170-5750a2aa3713?w=1200&q=80",
    location: "Phú Quốc, Kiên Giang",
    area: "95,000 m2",
    scale: "10 ha",
    client: "Hoa Binh Group",
    year: "2023",
    status: "Hoàn thành",
    duration: "18 tháng",
    desc: "Resort 5 sao gồm khách sạn, villa, tiện ích nghỉ dưỡng và hệ thống kỹ thuật vận hành theo tiêu chuẩn cao cấp.",
    items: ["Kết cấu bê tông cốt thép", "Điều hòa trung tâm VRF", "Hồ bơi và spa", "Cảnh quan và hạ tầng"],
  },
  {
    slug: "toa-nha-can-ho-cao-cap-sunny-plaza",
    title: "Căn hộ cao cấp Sunny Plaza",
    category: "Apartments",
    image: "https://images.unsplash.com/photo-1768807842143-d1493bde6931?w=1200&q=80",
    location: "Gò Vấp, TP.HCM",
    area: "32,500 m2",
    scale: "2.1 ha",
    client: "Sunny Plaza Corp",
    year: "2022",
    status: "Hoàn thành",
    duration: "24 tháng",
    desc: "Công trình căn hộ cao tầng với hệ móng sâu, kết cấu chịu lực và hệ thống MEP toàn nhà.",
    items: ["Cọc khoan nhồi D800", "Kết cấu thân 25 tầng", "MEP toàn nhà", "Hạ tầng tầng hầm"],
  },
];

const services = [
  ["Nâng cấp cải tạo không dừng sản xuất", "Renovation & Upgrade", "Cải tạo công trình đang vận hành với kế hoạch thi công theo ca, kiểm soát bụi, tiếng ồn, an toàn và vệ sinh công nghiệp.", "https://images.unsplash.com/photo-1748002388689-c62b45d5c28b?w=1000&q=80"],
  ["Thiết kế & xây dựng", "Design & Build EPC", "Một đầu mối từ thiết kế kỹ thuật, mua sắm vật tư, điều phối thi công đến nghiệm thu bàn giao.", "https://images.unsplash.com/photo-1645434897689-af222b85993e?w=1000&q=80"],
  ["Thi công dân dụng & công nghiệp", "Civil & Structural", "Kết cấu thép, bê tông cốt thép, hạ tầng nhà máy, kho xưởng và công trình thương mại quy mô lớn.", "https://images.unsplash.com/photo-1774979159518-7706ca7bb2e6?w=1000&q=80"],
  ["Hệ thống cơ điện MEP", "Mechanical, Electrical & Plumbing", "Triển khai hệ thống kỹ thuật cao cho phòng sạch, nhà máy điện tử, trung tâm thương mại và công trình phức hợp.", "https://images.unsplash.com/photo-1759830337357-29c472b6746c?w=1000&q=80"],
];

const leaders = [
  ["Nguyễn Trọng Khải", "Chủ tịch HĐQT", "Chairman of the Board", "Hơn 25 năm kinh nghiệm trong xây dựng công nghiệp và thương mại. Người sáng lập Tona với tầm nhìn kiến tạo chuẩn mực mới.", "https://images.unsplash.com/photo-1720501828093-c792c10e3f0b?w=800&q=80"],
  ["Trần Minh Đức", "Tổng Giám đốc", "Chief Executive Officer", "18 năm kinh nghiệm quản lý dự án EPC quy mô lớn cho các tập đoàn đa quốc gia.", "https://images.unsplash.com/photo-1774599730788-a74cd9253b56?w=800&q=80"],
  ["Lê Thị Hương", "Giám đốc Vận hành", "Chief Operating Officer", "Chuyên gia triển khai hệ thống quản lý chất lượng ISO và an toàn lao động tại công trường phức tạp.", "https://images.unsplash.com/photo-1758691737605-69a0e78bd193?w=800&q=80"],
  ["Phạm Văn Hải", "Giám đốc Dự án", "Chief Project Director", "20 năm chỉ huy các dự án nhà máy công nghệ cao và công trình công nghiệp trên toàn quốc.", "https://images.unsplash.com/photo-1758518726775-70e538b0d46e?w=800&q=80"],
];

const news = [
  ["tona-corp-khoi-cong-du-an-spartronics-viet-nam-2", "Tona Corp khởi công dự án nhà máy Spartronics Việt Nam 2", "15 Th10, 2025", "Dự án", "https://images.unsplash.com/photo-1628158088791-89567a8e84ec?w=1200&q=80", "Dự án nhà máy điện tử phòng sạch ISO 6 quy mô 40,000 m2 tại Bình Dương đánh dấu bước tiến mới trong năng lực EPC của Tona."],
  ["le-ky-ket-doi-tac-sv-group-solar-rooftop", "Lễ ký kết đối tác chiến lược với SV Group về Solar Rooftop", "28 Th09, 2025", "Đối tác", "https://images.unsplash.com/photo-1635424825057-7fb6dcd651ef?w=1200&q=80", "Hai bên hợp tác triển khai hệ thống điện mặt trời áp mái tổng công suất 15 MWp cho chuỗi nhà máy."],
  ["hoan-thanh-go-dong-nai-truoc-tien-do", "Hoàn thành dự án GO! Đồng Nai trước tiến độ 3 tuần", "05 Th07, 2025", "Dự án", "https://images.unsplash.com/photo-1761333477936-56fbc7851c65?w=1200&q=80", "Tona bàn giao thành công dự án cải tạo 46,100 m2 trong điều kiện trung tâm thương mại vẫn vận hành liên tục."],
  ["hoi-nghi-xay-dung-xanh-viet-nam-2025", "Tona Corp tham gia Hội nghị Xây dựng Xanh Việt Nam 2025", "20 Th06, 2025", "Sự kiện", "https://images.unsplash.com/photo-1774599730788-a74cd9253b56?w=1200&q=80", "Đại diện Tona chia sẻ kinh nghiệm thi công bền vững, tiết kiệm năng lượng và tích hợp công nghệ BIM."],
  ["chung-nhan-iso-45001-2018", "Chứng nhận ISO 45001:2018 - cam kết an toàn lao động", "14 Th05, 2025", "Chứng nhận", "https://images.unsplash.com/photo-1758518726775-70e538b0d46e?w=1200&q=80", "Hệ thống quản lý an toàn và sức khỏe nghề nghiệp của Tona được chứng nhận theo tiêu chuẩn quốc tế."],
];

const jobs = [
  ["Kỹ sư Giám sát Xây dựng", "Kỹ thuật Công trường", "Bình Dương / Đồng Nai", "Junior - Mid", "Thỏa thuận", "Giám sát thi công, kiểm soát chất lượng, phối hợp nhà thầu phụ và báo cáo tiến độ.", ["Tốt nghiệp ngành xây dựng", "Đọc hiểu bản vẽ kỹ thuật", "Sẵn sàng làm việc tại công trường"], ["Thưởng dự án", "Bảo hiểm tai nạn 24/7", "Đào tạo chuyên sâu"]],
  ["Kỹ sư MEP", "Kỹ thuật MEP", "TP.HCM / Bình Dương", "Mid - Senior", "18 - 35 triệu", "Thiết kế, triển khai và giám sát hệ thống điện, HVAC, nước, PCCC cho công trình công nghiệp.", ["Tối thiểu 3 năm kinh nghiệm MEP", "Ưu tiên dự án phòng sạch", "Thành thạo AutoCAD MEP hoặc Revit MEP"], ["Lương hấp dẫn", "Đào tạo tại Singapore", "Lộ trình thăng tiến rõ ràng"]],
  ["Chuyên viên QA/QC Xây dựng", "Kiểm soát Chất lượng", "Nhiều khu vực", "Mid", "15 - 25 triệu", "Kiểm tra vật liệu, nghiệm thu, hồ sơ hoàn công và kiểm soát chất lượng theo ISO.", ["Am hiểu ISO 9001, TCVN", "Kinh nghiệm lập hồ sơ nghiệm thu", "Kỹ năng báo cáo tốt"], ["Phụ cấp công trường", "Đào tạo ISO", "Bảo hiểm sức khỏe"]],
  ["Project Manager - Dự án Công nghiệp", "Quản lý Dự án", "TP.HCM / Toàn quốc", "Senior - Manager", "40 - 80 triệu", "Quản lý toàn diện dự án EPC quy mô lớn từ thiết kế, mua sắm, thi công đến quan hệ khách hàng.", ["8 năm kinh nghiệm trở lên", "Ưu tiên PMP hoặc PRINCE2", "Tiếng Anh giao tiếp tốt"], ["Gói thu nhập cao", "Xe công ty hoặc phụ cấp xe", "ESOP cho vị trí senior"]],
];

const app = document.querySelector("#app");

const esc = (str = "") => String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

function hero({ title, kicker, text, image, small = true, actions = "" }) {
  return `
    <section class="hero ${small ? "small" : ""}">
      <div class="hero-media"><img src="${image}" alt=""></div>
      <div class="shell hero-content">
        <p class="eyebrow">${kicker}</p>
        <h1>${title}</h1>
        <p>${text}</p>
        ${actions ? `<div class="hero-actions">${actions}</div>` : ""}
      </div>
    </section>
  `;
}

function stats(items) {
  return `<section class="stats">${items.map(([v,l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("")}</section>`;
}

function projectCard(p) {
  return `
    <a class="card" href="?page=project&slug=${p.slug}">
      <div class="media"><img src="${p.image}" alt="${esc(p.title)}"></div>
      <div class="card-body">
        <span class="badge">${p.category}</span>
        <h3 style="margin-top:14px">${esc(p.title)}</h3>
        <div class="meta"><span>${p.location}</span><span>${p.area}</span></div>
        <p>${p.desc}</p>
        <span class="link-more">Xem chi tiết</span>
      </div>
    </a>
  `;
}

function serviceCard(s, i) {
  return `
    <article class="card ${i === 0 ? "dark-card" : ""}">
      <div class="media wide"><img src="${s[3]}" alt="${esc(s[0])}"></div>
      <div class="card-body">
        <p class="eyebrow">${s[1]}</p>
        <h3>${s[0]}</h3>
        <p>${s[2]}</p>
      </div>
    </article>
  `;
}

function home() {
  return `
    ${hero({
      small: false,
      image: projects[0].image,
      kicker: "Industrial - Biên Hòa, Đồng Nai",
      title: "Nâng Cấp Cải Tạo<br>Nhà Máy Phoenix Contact",
      text: "171 ngày · Zero Downtime · 25,000 m2",
      actions: `<a class="btn btn-gold" href="?page=du-an-tona">Xem dự án</a><a class="btn btn-outline" href="?page=dich-vu">Dịch vụ</a>`,
    })}
    <div class="marquee"><div class="marquee-track">${["ISO 9001:2015","Zero Accident","ISO 45001:2018","500+ Dự án","ISO 14001:2015","15+ Năm kinh nghiệm","ISO 9001:2015","Zero Accident","ISO 45001:2018","500+ Dự án"].map((x) => `<span>${x}</span>`).join("")}</div></div>
    <section class="slogan">
      <img src="${asset("Artboard_2.png")}" alt="">
      <div>
        <p class="eyebrow">Tona Corporation - Build It Right</p>
        <h2>Tiên Phong Kiến Tạo<br>Chuẩn Mực Mới</h2>
        <p>Hơn 15 năm đồng hành cùng các tập đoàn đa quốc gia, bàn giao công trình đúng tiến độ và đúng cam kết.</p>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="section-head"><div><div class="rule"></div><h2>Dịch Vụ Cốt Lõi</h2></div><a class="btn btn-dark" href="?page=dich-vu">Xem tất cả</a></div>
        <div class="grid four">${services.map(serviceCard).join("")}</div>
      </div>
    </section>
    <section class="section dark">
      <div class="shell">
        <div class="section-head"><div><p class="eyebrow">Portfolio</p><h2>Dự Án Nổi Bật</h2></div><a class="btn btn-gold" href="?page=du-an-tona">Xem tất cả</a></div>
        <div class="grid three">${projects.slice(0,3).map(projectCard).join("")}</div>
      </div>
    </section>
    <section class="section alt">
      <div class="shell">
        <div class="section-head"><div><div class="rule"></div><h2>Tin Tức & Hoạt Động</h2></div><a class="btn btn-outline" href="?page=news">Xem tất cả</a></div>
        <div class="grid three">${news.slice(0,3).map(newsCard).join("")}</div>
      </div>
    </section>
  `;
}

function about() {
  const timeline = [
    ["2009","Thành lập","Tona Corporation ra đời tại TP.HCM với đội ngũ kỹ sư chuyên về thi công kết cấu công nghiệp."],
    ["2013","Mở rộng MEP","Ra mắt bộ phận cơ điện chuyên biệt, đưa Tona trở thành nhà thầu EPC toàn diện."],
    ["2017","ISO 9001","Nhận chứng nhận quản lý chất lượng, chuẩn hóa quy trình thi công và nghiệm thu."],
    ["2023","800+ nhân sự","Đội ngũ phát triển mạnh, triển khai đồng thời nhiều dự án quy mô lớn."],
    ["2025","Beyond Limits","Mở rộng sang Solar & Green Energy, BIM Technology và công trình xanh."],
  ];
  return `
    ${hero({ image: asset("Artboard_2.png"), kicker: "Giới thiệu", title: "Về Tona<br>Corporation", text: "Hơn 15 năm kiến tạo các công trình vượt chuẩn cho khách hàng công nghiệp, thương mại và năng lượng tại Việt Nam." })}
    ${stats([["500+","Dự án hoàn thành"],["800+","Nhân sự"],["15+","Năm kinh nghiệm"],["50+","Đối tác quốc tế"]])}
    <section class="section"><div class="shell grid two">
      <article class="card dark-card"><div class="card-body"><p class="eyebrow">Sứ mệnh</p><h3>Mang đến giải pháp xây dựng chất lượng cao</h3><p>Tối ưu chi phí, thời gian và phát triển bền vững cho đối tác cùng cộng đồng.</p></div></article>
      <article class="card"><div class="card-body"><p class="eyebrow">Tầm nhìn</p><h3>Tổng thầu công nghiệp hàng đầu khu vực</h3><p>Trở thành lựa chọn ưu tiên của các tập đoàn đa quốc gia tại Đông Nam Á.</p></div></article>
    </div></section>
    <section class="section alt"><div class="shell"><div class="rule"></div><h2>Hành Trình Phát Triển</h2><div class="timeline">${timeline.map(([y,t,d]) => `<div class="timeline-item"><div class="timeline-year">${y}</div><div class="timeline-dot"></div><div><h3>${t}</h3><p class="muted">${d}</p></div></div>`).join("")}</div></div></section>
    <section class="section dark"><div class="shell"><div class="rule"></div><h2>Chứng Nhận Quốc Tế</h2><div class="grid three">${["ISO 9001:2015 - Quản lý chất lượng","ISO 45001:2018 - An toàn & sức khỏe","ISO 14001:2015 - Quản lý môi trường"].map((x) => `<article class="card dark-card"><div class="card-body"><h3>${x}</h3><p>Bureau Veritas</p></div></article>`).join("")}</div></div></section>
  `;
}

function members() {
  return `
    ${hero({ image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=80", kicker: "Đội ngũ lãnh đạo", title: "Hội Đồng<br>Quản Trị", text: "Những con người dẫn dắt Tona bằng kinh nghiệm, tầm nhìn và cam kết kiến tạo chuẩn mực mới." })}
    <section class="section"><div class="shell grid four">${leaders.map((m) => `
      <article class="card"><div class="media tall"><img src="${m[4]}" alt="${m[0]}"></div><div class="card-body"><h3>${m[0]}</h3><p class="eyebrow">${m[1]}</p><p>${m[3]}</p></div></article>
    `).join("")}</div></section>
    <section class="section dark"><div class="shell"><div class="rule"></div><h2>Giá Trị Lãnh Đạo</h2><div class="grid four">${["An toàn trên hết","Chất lượng không thỏa hiệp","Hiệu quả & tiến độ","Con người là nền tảng"].map((x) => `<article class="card dark-card"><div class="card-body"><h3>${x}</h3><p>Giá trị được chuyển hóa thành hành động trong từng dự án và từng quyết định vận hành.</p></div></article>`).join("")}</div></div></section>
  `;
}

function servicesPage() {
  return `
    ${hero({ image: services[0][3], kicker: "Dịch vụ", title: "Giải Pháp<br>Xây Dựng Toàn Diện", text: "Từ tổng thầu EPC đến cải tạo không dừng sản xuất, Tona đáp ứng các yêu cầu khắt khe của công nghiệp hiện đại." })}
    <section class="section"><div class="shell grid two">${services.map(serviceCard).join("")}</div></section>
    <section class="section dark"><div class="shell"><div class="rule"></div><h2>Quy Trình Triển Khai</h2><div class="grid three">${["Khảo sát & tư vấn","Thiết kế kỹ thuật","Ký kết hợp đồng","Thi công","Nghiệm thu & bàn giao","Bảo hành"].map((x,i) => `<article class="card dark-card"><div class="card-body"><p class="eyebrow">${String(i+1).padStart(2,"0")}</p><h3>${x}</h3><p>Minh bạch phạm vi, tiến độ, chi phí và tiêu chuẩn chất lượng ở từng giai đoạn.</p></div></article>`).join("")}</div></div></section>
  `;
}

function projectsPage(filter = "Tất cả") {
  const cats = ["Tất cả", "Industrial", "Commercial", "Solar Rooftop", "Hotels", "Apartments"];
  const rows = filter === "Tất cả" ? projects : projects.filter((p) => p.category === filter);
  return `
    ${hero({ image: projects[1].image, kicker: "Dự án", title: "Dự Án<br>Nổi Bật", text: "Tổng hợp các công trình tiêu biểu Tona đã thực hiện trên nhiều loại hình và quy mô khác nhau." })}
    ${stats([["500+","Dự án hoàn thành"],["50+","Khách hàng quốc tế"],["15+","Năm kinh nghiệm"],["1M+","m2 đã thi công"]])}
    <div class="filter-row"><div class="shell">${cats.map((c) => `<button class="chip ${c === filter ? "active" : ""}" data-filter="${c}">${c}</button>`).join("")}</div></div>
    <section class="section"><div class="shell grid three">${rows.map(projectCard).join("")}</div></section>
  `;
}

function projectDetail(slug) {
  const p = projects.find((item) => item.slug === slug) || projects[0];
  return `
    ${hero({ image: p.image, kicker: p.category, title: esc(p.title), text: `${p.location} · ${p.area} · ${p.status}` })}
    <section class="section"><div class="shell detail-layout">
      <article class="rich">
        <p>${p.desc}</p>
        <h2>Phạm vi công việc</h2>
        ${list(p.items)}
        <blockquote>Dự án thể hiện năng lực điều phối thi công, kiểm soát an toàn và quản lý chất lượng theo chuẩn Tona.</blockquote>
        <h2>Kết quả</h2>
        <p>Tona kiểm soát đồng thời tiến độ, kỹ thuật, an toàn và vận hành hiện hữu, giúp khách hàng nhận bàn giao với rủi ro thấp và hiệu quả vận hành tốt hơn.</p>
      </article>
      <aside class="side-panel"><div class="kv">
        ${[["Khách hàng",p.client],["Địa điểm",p.location],["Quy mô",p.scale],["Diện tích",p.area],["Năm",p.year],["Thời gian",p.duration],["Trạng thái",p.status]].map(([k,v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}
      </div></aside>
    </div></section>
  `;
}

function newsCard(n) {
  return `<a class="card" href="?page=news-detail&slug=${n[0]}"><div class="media wide"><img src="${n[4]}" alt="${esc(n[1])}"></div><div class="card-body"><span class="badge">${n[3]}</span><h3 style="margin-top:14px">${n[1]}</h3><p class="muted">${n[2]}</p><p>${n[5]}</p><span class="link-more">Đọc tiếp</span></div></a>`;
}

function newsPage() {
  return `
    ${hero({ image: news[0][4], kicker: "Tin tức", title: "Tin Tức<br>& Hoạt Động", text: "Cập nhật dự án, đối tác, văn hóa và các cột mốc phát triển của Tona Corporation." })}
    <section class="section"><div class="shell grid three">${news.map(newsCard).join("")}</div></section>
  `;
}

function newsDetail(slug) {
  const n = news.find((item) => item[0] === slug) || news[0];
  return `
    ${hero({ image: n[4], kicker: n[3], title: n[1], text: `${n[2]} · Ban Biên Tập Tona` })}
    <section class="section"><div class="shell detail-layout">
      <article class="rich">
        <p>${n[5]}</p>
        <h2>Thông tin chính</h2>
        <p>Tona Corporation tiếp tục mở rộng năng lực triển khai dự án, kết nối với đối tác chiến lược và nâng cao chuẩn vận hành nội bộ.</p>
        <blockquote>Chúng tôi xem chất lượng, an toàn và tiến độ là ba cam kết không tách rời trong mọi công trình.</blockquote>
        <p>Các hoạt động này là nền tảng giúp Tona phục vụ tốt hơn cho khách hàng công nghiệp, thương mại, năng lượng và hạ tầng.</p>
      </article>
      <aside class="side-panel"><div class="kv"><div><span>Ngày đăng</span><b>${n[2]}</b></div><div><span>Chuyên mục</span><b>${n[3]}</b></div><div><span>Thời gian đọc</span><b>3 phút</b></div></div></aside>
    </div></section>
  `;
}

function culture() {
  const acts = [
    ["Tiệc tất niên","Year-End Gala","Vinh danh thành tích, tri ân nhân viên và kết nối cộng đồng Tona.","https://images.unsplash.com/photo-1768508948835-7dbab7ca6d58?w=900&q=80"],
    ["Ngày hội thể thao","Sports Day","Rèn luyện tinh thần đồng đội và năng lượng tích cực.","https://images.unsplash.com/photo-1678893049430-d9087867e775?w=900&q=80"],
    ["Team Building","Quarterly Retreat","Gắn kết đội ngũ qua các chuyến đi và hoạt động trải nghiệm.","https://images.unsplash.com/photo-1774599661355-327e322f53c2?w=900&q=80"],
    ["CSR & Thiện nguyện","Community Care","Đồng hành cùng cộng đồng tại các địa phương nơi Tona triển khai dự án.","https://images.unsplash.com/photo-1774599730788-a74cd9253b56?w=900&q=80"],
  ];
  return `
    ${hero({ image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80", kicker: "Cuộc sống Tona", title: "Hơn Cả<br>Một Nơi Làm Việc", text: "Mỗi thành viên được tôn trọng, gắn kết và cùng phát triển qua văn hóa nội bộ năng động." })}
    ${stats([["800+","Nhân sự"],["15+","Năm kinh nghiệm"],["100%","Đóng bảo hiểm"],["4.8/5","Đánh giá nội bộ"]])}
    <section class="section"><div class="shell"><div class="rule"></div><h2>Chủ Đề Năm</h2><div class="grid three">${["Beyond Limits","Build Forward","Together We Rise"].map((x,i) => `<article class="card ${i===0?"dark-card":""}"><div class="card-body"><p class="eyebrow">${2025-i}</p><h3>${x}</h3><p>Định hướng tinh thần và hành động cho toàn bộ tổ chức trong năm.</p></div></article>`).join("")}</div></div></section>
    <section class="section alt"><div class="shell"><div class="rule"></div><h2>Hoạt Động Văn Hóa</h2><div class="grid two">${acts.map((a) => `<article class="card"><div class="media wide"><img src="${a[3]}" alt="${a[0]}"></div><div class="card-body"><p class="eyebrow">${a[1]}</p><h3>${a[0]}</h3><p>${a[2]}</p></div></article>`).join("")}</div></div></section>
  `;
}

function jobsPage() {
  const dept = routeState.dept || "Tất cả";
  const depts = ["Tất cả", ...new Set(jobs.map((j) => j[1]))];
  const rows = dept === "Tất cả" ? jobs : jobs.filter((j) => j[1] === dept);
  return `
    ${hero({ image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80", kicker: "Tuyển dụng", title: "Gia Nhập<br>Đội Ngũ Tona", text: "Môi trường chuyên nghiệp, dự án đỉnh cao và lộ trình phát triển rõ ràng." })}
    <section class="section alt"><div class="shell"><p class="eyebrow">Tại sao chọn Tona?</p><div class="grid four">${["Lộ trình thăng tiến rõ ràng","Lương & thưởng hấp dẫn","Môi trường quốc tế","Đào tạo chuyên sâu"].map((x) => `<article class="card"><div class="card-body"><h3>${x}</h3><p>Chính sách được thiết kế để nhân sự phát triển bền vững cùng dự án.</p></div></article>`).join("")}</div></div></section>
    <div class="filter-row"><div class="shell">${depts.map((d) => `<button class="chip ${d === dept ? "active" : ""}" data-dept="${d}">${d}</button>`).join("")}</div></div>
    <section class="section"><div class="shell"><div class="section-head"><div><div class="rule"></div><h2>Vị Trí Đang Tuyển (${rows.length})</h2></div></div>${rows.map(jobCard).join("")}</div></section>
  `;
}

function jobCard(j) {
  return `
    <article class="job-card">
      <div class="job-top">
        <div>
          <p class="eyebrow">${j[1]} · ${j[3]}</p>
          <h3>${j[0]}</h3>
          <div class="meta"><span>${j[2]}</span><span>${j[4]}</span><span>Full-time</span></div>
          <p class="muted">${j[5]}</p>
        </div>
        <div class="actions"><button class="btn btn-gold" data-apply="${j[0]}">Ứng tuyển</button><button class="btn btn-outline" data-expand>Chi tiết</button></div>
      </div>
      <div class="job-detail"><div><h3>Yêu cầu</h3>${list(j[6])}</div><div><h3>Phúc lợi</h3>${list(j[7])}</div></div>
    </article>
  `;
}

let routeState = {};

function render() {
  const params = new URLSearchParams(location.search);
  const page = params.get("page") || "home";
  const slug = params.get("slug");
  let html = "";

  if (page === "home") html = home();
  else if (page === "gioi-thieu-tona") html = about();
  else if (page === "doi-ngu") html = members();
  else if (page === "cuoc-song-tona") html = culture();
  else if (page === "dich-vu") html = servicesPage();
  else if (page === "du-an-tona") html = projectsPage(routeState.projectFilter || "Tất cả");
  else if (page === "project") html = projectDetail(slug);
  else if (page === "news") html = newsPage();
  else if (page === "news-detail") html = newsDetail(slug);
  else if (page === "nghe-nghiep") html = jobsPage();
  else html = home();

  app.innerHTML = html;
  bindPage();
  updateActiveNav();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function bindPage() {
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      routeState.projectFilter = btn.dataset.filter;
      app.innerHTML = projectsPage(routeState.projectFilter);
      bindPage();
    });
  });
  document.querySelectorAll("[data-dept]").forEach((btn) => {
    btn.addEventListener("click", () => {
      routeState.dept = btn.dataset.dept;
      app.innerHTML = jobsPage();
      bindPage();
    });
  });
  document.querySelectorAll("[data-expand]").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest(".job-card").classList.toggle("open"));
  });
  document.querySelectorAll("[data-apply]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.apply));
  });
}

function openModal(title) {
  let modal = document.querySelector(".modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-head"><div><p class="eyebrow">Ứng tuyển</p><h3 data-modal-title></h3></div><button type="button" data-close>×</button></div>
        <form class="form">
          <label>Họ và tên<input type="text" placeholder="Nguyễn Văn A"></label>
          <label>Email<input type="email" placeholder="email@example.com"></label>
          <label>Số điện thoại<input type="tel" placeholder="+84 9xx xxx xxx"></label>
          <label>Thư giới thiệu<textarea rows="4" placeholder="Giới thiệu ngắn về bản thân"></textarea></label>
          <button class="btn btn-gold" type="button">Nộp hồ sơ ứng tuyển</button>
        </form>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.matches("[data-close]")) modal.classList.remove("open");
    });
  }
  modal.querySelector("[data-modal-title]").textContent = title;
  modal.classList.add("open");
}

function updateActiveNav() {
  const page = new URLSearchParams(location.search).get("page") || "home";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    const hrefPage = new URL(a.getAttribute("href"), location.href).searchParams.get("page") || "home";
    a.classList.toggle("active", hrefPage === page);
  });
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
document.querySelector("[data-menu-toggle]").addEventListener("click", () => document.querySelector("[data-nav]").classList.toggle("open"));
document.querySelector("[data-nav]").addEventListener("click", (e) => {
  if (e.target.closest("a")) document.querySelector("[data-nav]").classList.remove("open");
});
window.addEventListener("scroll", () => document.querySelector("[data-header]").classList.toggle("scrolled", scrollY > 20), { passive: true });
render();
