# TONA CORPORATION WEBSITE - HTML Export cho WordPress

## Tổng quan
Website Tona Corporation đã được convert từ React + Tailwind sang HTML thuần + CSS để sử dụng với WordPress.

## Cấu trúc thư mục
```
html-export/
├── index.html              # Trang chủ
├── css/
│   └── style.css          # CSS chính (tất cả styles)
├── js/
│   └── main.js            # JavaScript cho mobile menu và tương tác
├── images/                # Thư mục chứa hình ảnh
└── README.md              # File này
```

## Font sizes & Colors được sử dụng

### COLORS
- **Primary Green**: `#002d17` - Màu xanh đậm chính
- **Secondary Green**: `#46aa85` - Màu xanh lá
- **Accent Yellow**: `#f4aa1f` - Màu vàng nhấn
- **White**: `#ffffff`
- **Text**: `#002d17` (chính), `rgba(0,45,23,0.6)` (phụ)

### FONT SIZES
- **Extra small**: 0.75rem (12px)
- **Small**: 0.875rem (14px) 
- **Base**: 1rem (16px)
- **Large**: 1.125rem (18px)
- **XL**: 1.25rem (20px)
- **2XL**: 1.5rem (24px)
- **3XL**: 1.875rem (30px)
- **4XL**: 2.25rem (36px)
- **5XL**: 3rem (48px)

### TYPOGRAPHY
- **Font family**: System fonts (Arial, Helvetica, sans-serif)
- **Headings**: Font-weight 800 (Extra Bold)
- **Body**: Font-weight 400 (Normal)
- **Bold**: Font-weight 700

## Hướng dẫn sử dụng với WordPress

### Cách 1: Tích hợp vào theme hiện tại

1. **Upload CSS và JS:**
   - Copy file `css/style.css` vào thư mục theme: `wp-content/themes/your-theme/css/`
   - Copy file `js/main.js` vào: `wp-content/themes/your-theme/js/`

2. **Enqueue trong functions.php:**
```php
function tona_enqueue_scripts() {
    wp_enqueue_style('tona-style', get_template_directory_uri() . '/css/style.css');
    wp_enqueue_script('tona-main', get_template_directory_uri() . '/js/main.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'tona_enqueue_scripts');
```

3. **Tạo page template:**
   - Copy nội dung từ `index.html` 
   - Tạo file `page-home.php` trong theme
   - Paste HTML vào giữa `get_header()` và `get_footer()`

### Cách 2: Tạo Custom HTML blocks trong Gutenberg

1. Upload CSS và JS như Cách 1
2. Trong WordPress Editor, tạo Custom HTML block
3. Copy paste từng section HTML từ file index.html
4. Dễ dàng chỉnh sửa nội dung trực tiếp

### Cách 3: Dùng Elementor/WPBakery

1. Install plugin Elementor hoặc WPBakery
2. Tạo page mới
3. Thêm HTML Widget
4. Paste code HTML từng section
5. CSS và JS upload như Cách 1

## Lưu ý quan trọng

### Hình ảnh
- Hiện tại website dùng Unsplash images (URLs bắt đầu với https://images.unsplash.com)
- Để dùng cho production:
  1. Download các hình về
  2. Upload vào WordPress Media Library  
  3. Replace URLs trong HTML

### Logo
- File logo cần đặt tại: `images/tona-logo.png`
- Upload vào WordPress Media và update đường dẫn

### Responsive
- Website đã responsive cho mobile, tablet, desktop
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)

### Links/URLs
- Tất cả links hiện tại dùng format: `/vi/trang-nao-do.html`
- Cần update thành WordPress permalinks
- Ví dụ: `/vi/gioi-thieu-tona.html` → `/gioi-thieu-tona/`

## Các trang cần tạo

Website gồm các trang sau (chưa convert hết):

✅ **index.html** - Trang chủ (ĐÃ TẠO)
⬜ gioi-thieu-tona.html - Giới thiệu
⬜ doi-ngu.html - Đội ngũ lãnh đạo  
⬜ cuoc-song-tona.html - Văn hóa công ty
⬜ dich-vu.html - Dịch vụ
⬜ du-an-tona.html - Danh sách dự án
⬜ project/[slug].html - Chi tiết dự án
⬜ news.html - Tin tức
⬜ news/[slug].html - Chi tiết tin
⬜ nghe-nghiep.html - Tuyển dụng

## Lấy thông tin design từ code

### Trong CSS (style.css):
```css
:root {
  --color-primary: #002d17;
  --font-size-base: 1rem;
  /* ... các biến khác */
}
```

### Classes hữu ích:
- `.container` - Wrapper 80rem max-width
- `.btn-primary` - Button vàng chính
- `.btn-secondary` - Button phụ
- `.site-header` - Header cố định
- `.site-footer` - Footer

## Hỗ trợ

Nếu cần convert các trang còn lại hoặc có câu hỏi về code, vui lòng liên hệ dev team.

## License
© 2026 Tona Corporation. All Rights Reserved.
