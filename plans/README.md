# Animation plans

| # | Plan | Severity | Status |
|---|---|---|---|
| 001 | [Thay zigzag bằng reveal dọc tuần tự](001-focus-interlude-vertical-reveal.md) | LOW | TODO |
| 002 | [Đẩy chữ bước sang trái khi hover](002-focus-interlude-hover-shift.md) | LOW | TODO |
| 003 | [Animate space location tab accordion and map label swap](003-space-location-tab-motion.md) | MEDIUM | DONE |

## Thứ tự thực thi

1. **Plan 003** (khuyến nghị làm trước) — `/space` location tabs; không dependency; leverage cao nhất cho tương tác người dùng.
2. Thực thi plan 001. Không có dependency.
3. Thực thi plan 002 sau plan 001. Không có dependency kỹ thuật; kiểm tra hover sau khi xác nhận reveal.
