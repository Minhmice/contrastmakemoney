# 001 — Thay zigzag bằng reveal dọc tuần tự

- **Status**: TODO
- **Commit**: 10baaff
- **Severity**: LOW
- **Category**: Purpose & frequency; Cohesion & tokens
- **Estimated scope**: 1 file, khoảng 6 dòng thay đổi và 2 dòng xóa

## Problem

Section marketing hiếm khi được xem, nên motion giải thích theo thứ tự là phù hợp. Nhưng chuyển động hiện tại đẩy từng dòng xen kẽ trái/phải. Hướng zigzag không mang ý nghĩa, cạnh tranh với việc đọc chữ Việt cỡ lớn, và dùng biến thể role-aware không cần thiết.

`src/legacy-pages/HomePage/sections/FocusInterludeSection.tsx:18` và `:29-40` — hiện tại:

```tsx
const STEP_VARIANTS = [-1, 1, -1, 1, -1] as const

 gsap.fromTo(
  section.querySelectorAll('.focus-step'),
  { autoAlpha: 0, x: (index) => STEP_VARIANTS[index] * 28, y: 18 },
  {
    autoAlpha: 1,
    x: 0,
    y: 0,
    duration: 0.72,
    ease: 'power3.out',
    stagger: 0.07,
    clearProps: 'transform,opacity,visibility',
    scrollTrigger: { trigger: section, start: 'top 82%', once: true },
  },
)
```

## Target

Mỗi dòng reveal từ dưới lên cùng một hướng, giữ thứ tự DOM và stagger ngắn. Chỉ animate `transform` và `opacity` qua GSAP. Không thêm blur, scale, pin, scrub hoặc parallax.

```tsx
gsap.fromTo(
  section.querySelectorAll('.focus-step'),
  { autoAlpha: 0, y: 18 },
  {
    autoAlpha: 1,
    y: 0,
    duration: 0.65,
    ease: 'power3.out',
    stagger: 0.07,
    clearProps: 'transform,opacity,visibility',
    scrollTrigger: { trigger: section, start: 'top 82%', once: true },
  },
)
```

Motion chạy một lần khi section vào viewport. `650ms` hợp lệ vì đây là motion marketing/explanatory. Stagger `70ms` nằm trong ngân sách `30–80ms`. Nhánh hiện có chỉ chạy dưới `(prefers-reduced-motion: no-preference)`; người dùng reduced motion nhận nội dung tĩnh, không bị ẩn.

## Repo conventions to follow

- GSAP và ScrollTrigger đã được cài; không thêm dependency.
- Giữ `gsap.matchMedia()`, `media.revert()`, selector scope qua `section`, và `once: true` trong chính component.
- Easing CSS chuẩn nằm tại `src/app/globals.css:3092`: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);`. Code GSAP hiện dùng tương đương theo convention của component: `power3.out`.
- Mọi CSS global/route chỉ được đặt trong `src/app/globals.css`; kế hoạch này không cần sửa CSS.

## Steps

1. Trong `src/legacy-pages/HomePage/sections/FocusInterludeSection.tsx`, xóa toàn bộ khai báo `STEP_VARIANTS`.
2. Trong initial vars của `gsap.fromTo`, thay `{ autoAlpha: 0, x: (index) => STEP_VARIANTS[index] * 28, y: 18 }` bằng `{ autoAlpha: 0, y: 18 }`.
3. Trong target vars, xóa `x: 0` và đổi `duration: 0.72` thành `duration: 0.65`.
4. Giữ nguyên `y: 0`, `ease: 'power3.out'`, `stagger: 0.07`, cleanup, trigger, markup, copy, CTA và stamp.

## Boundaries

- Chỉ sửa `src/legacy-pages/HomePage/sections/FocusInterludeSection.tsx`.
- Không sửa `src/app/globals.css` hoặc stylesheet cũ.
- Không đổi markup, nội dung, layout, breakpoint, CTA, stamp hoặc section khác.
- Không thêm animation cho số, CTA hoặc stamp trong plan này.
- Không thêm dependency, helper, abstraction, test framework hoặc seed mới. Sau khi bỏ zigzag, variation không còn nên seed không áp dụng.
- Nếu đoạn code hiện tại khác excerpt tại commit `10baaff`, dừng và báo drift; không tự suy diễn.

## Verification

- **Mechanical**: chạy `npm run lint`, `npm run smoke:responsive`, và `npm run build`; cả ba phải exit code 0. Warnings cũ được chấp nhận nếu không phát sinh warning/error mới từ file sửa.
- **Responsive**: kiểm tra homepage ở rộng `320`, `375`, `768`, `1024`, và `1440px`; thêm một viewport thấp. Section không tạo horizontal scroll và dòng chữ không bị cắt dấu tiếng Việt.
- **Feel check**: cuộn từ trên xuống qua FocusInterludeSection và xác nhận:
  - Năm dòng đi lên từ cùng một hướng; không dòng nào dịch ngang.
  - Thứ tự reveal đúng `01 → 05`, khoảng cách giữa điểm bắt đầu mỗi dòng là `70ms`.
  - CTA và stamp không bị timeline mới điều khiển.
  - DevTools Animations ở playback `10%`: không có snap ngang đầu/cuối, transform kết thúc tại trạng thái layout gốc.
  - Bật `prefers-reduced-motion: reduce`: toàn bộ dòng hiển thị ngay ở vị trí gốc, không có translate hoặc trạng thái vô hình.
- **Done when**: zigzag và `STEP_VARIANTS` biến mất; reveal chỉ dùng `autoAlpha` và `y`; các kiểm tra trên đạt; không có thay đổi ngoài một component.
