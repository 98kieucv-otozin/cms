# Icons Directory

Thư mục này chứa các file icon cho dự án.

## Cách sử dụng

### SVG Icons
```tsx
import LogoIcon from '../assets/icons/logo.svg';

<img src={LogoIcon} alt="Logo" />
```

### React Component Icons
```tsx
import { ReactComponent as LogoIcon } from '../assets/icons/logo.svg';

<LogoIcon />
```

### PNG/JPG Icons
```tsx
import LogoIcon from '../assets/icons/logo.png';

<img src={LogoIcon} alt="Logo" />
```

## Cấu trúc đề xuất

- `logo.svg` - Logo chính của ứng dụng
- `favicon.ico` - Favicon
- Các icon khác theo nhu cầu

