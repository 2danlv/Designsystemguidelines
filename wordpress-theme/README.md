# TONA CORPORATION - WORDPRESS THEME

## Cài đặt

1. **Upload theme:**
   - Zip thư mục `wordpress-theme`
   - WordPress Admin → Appearance → Themes → Add New → Upload
   - Activate theme

2. **Hoặc copy trực tiếp:**
   ```bash
   cp -r wordpress-theme /path/to/wordpress/wp-content/themes/tona
   ```

## Cấu trúc theme

```
wordpress-theme/
├── style.css           # WordPress theme metadata
├── functions.php       # Theme functions & enqueue
├── header.php          # Header template
├── footer.php          # Footer template
├── index.php           # Homepage template
├── page.php            # Generic page template
├── single.php          # Single post template
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── main.js         # Main JavaScript
├── images/
│   └── tona-logo.png   # Logo
└── README.md           # This file
```

## Tính năng

✅ Responsive design (mobile, tablet, desktop)
✅ Custom logo support
✅ Navigation menus
✅ Post thumbnails
✅ Widget areas
✅ SEO friendly
✅ Fast loading

## Tạo trang

Sau khi activate theme:

1. **Tạo Homepage:**
   - Pages → Add New → Title: "Home"
   - Settings → Reading → Homepage: "Home"

2. **Tạo các trang:**
   - Giới Thiệu Tona (slug: gioi-thieu-tona)
   - Đội Ngũ (slug: doi-ngu)
   - Cuộc Sống Tona (slug: cuoc-song-tona)
   - Dịch Vụ (slug: dich-vu)
   - Dự Án Tona (slug: du-an-tona)
   - Tin Tức (slug: news)
   - Tuyển Dụng (slug: tuyen-dung)

3. **Upload logo:**
   - Appearance → Customize → Site Identity → Logo
   - Upload file: images/tona-logo.png

## Custom CSS

Nếu cần chỉnh CSS:
- Edit file: `css/style.css`

## Custom JavaScript

Nếu cần chỉnh JS:
- Edit file: `js/main.js`

## Colors

- Primary: `#002d17`
- Accent: `#f4aa1f`
- Secondary: `#46aa85`

## Hỗ trợ

Theme tương thích với:
- WordPress 5.0+
- PHP 7.4+
- Gutenberg Editor
- Classic Editor

## License

© 2026 Tona Corporation. All Rights Reserved.
