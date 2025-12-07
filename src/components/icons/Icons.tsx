import React from 'react';

export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

export const UploadIcon: React.FC<IconProps> = ({
  className,
  style,
  width = 16,
  height = 16
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <path
        fill="currentColor"
        d="M241 7c-9.4-9.4-24.6-9.4-33.9 0L71 143c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l95-95 0 246.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-246.1 95 95c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L241 7zM48 344c0-13.3-10.7-24-24-24S0 330.7 0 344l0 72c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72c0 26.5-21.5 48-48 48L96 464c-26.5 0-48-21.5-48-48l0-72z"
      />
    </svg>
  );
};

export const SearchIcon: React.FC<IconProps> = ({
  className,
  style,
  width = 16,
  height = 16,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <path d="M400 208a192 192 0 1 0 -384 0 192 192 0 1 0 384 0zM349.3 360.6C312.2 395 262.6 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208c0 54.6-21 104.2-55.4 141.3l149 149c3.1 3.1 3.1 8.2 0 11.3s-8.2 3.1-11.3 0l-149-149z" />
    </svg>
  );
};

export const CarIcon: React.FC<IconProps> = ({
  className,
  style,
  width = 16,
  height = 16
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <path
        fill="currentColor"
        d="M118.4 112.8L92 192 420 192 393.6 112.8C387.1 93.2 368.8 80 348.1 80L163.9 80c-20.7 0-39 13.2-45.5 32.8zM39.8 196.7l33-99.1C85.9 58.4 122.6 32 163.9 32l184.2 0c41.3 0 78 26.4 91.1 65.6l33 99.1c23.3 9.5 39.8 32.5 39.8 59.3l0 200c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40-416 0 0 40c0 13.3-10.7 24-24 24S0 469.3 0 456L0 256c0-26.8 16.4-49.7 39.8-59.3zM64 240c-8.8 0-16 7.2-16 16l0 112 416 0 0-112c0-8.8-7.2-16-16-16L64 240zm48 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm256 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
      />
    </svg>
  );
};

export const ArrowRightFromBracketIcon: React.FC<IconProps> = ({
  className,
  style,
  width = 16,
  height = 16,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <path
        fill="currentColor"
        d="M168 80c13.3 0 24-10.7 24-24s-10.7-24-24-24L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-72 0c-26.5 0-48-21.5-48-48l0-256c0-26.5 21.5-48 48-48l72 0zM505 273c9.4-9.4 9.4-24.6 0-33.9L369 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l95 95-246.1 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l246.1 0-95 95c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L505 273z"
      />
    </svg>
  );
};

export const UserProfileIcon: React.FC<IconProps> = ({
  className,
  style,
  width = 16,
  height = 16,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <path
        fill="currentColor"
        d="M144 128a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zm208 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM48 480c0-70.7 57.3-128 128-128l96 0c70.7 0 128 57.3 128 128l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8c0-97.2-78.8-176-176-176l-96 0C78.8 304 0 382.8 0 480l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8z"
      />
    </svg>
  );
};

export const DashboardIcon: React.FC<IconProps> = ({
  className,
  style,
  width = 16,
  height = 16,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <path d="M256 32C114.62 32 0 146.63 0 288s114.62 256 256 256 256-114.62 256-256S397.38 32 256 32zm0 452c-108.09 0-196-87.91-196-196S147.91 92 256 92s196 87.91 196 196-87.91 196-196 196z" />
      <path d="M399.22 182.78a16 16 0 0 0-22.63 0l-90.51 90.51a48 48 0 1 0 22.63 22.63l90.51-90.51a16 16 0 0 0 0-22.63z" />
    </svg>
  );
};

export const CheckIcon: React.FC<IconProps> = ({
  className,
  style,
  width = 16,
  height = 16,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <path fill="currentColor" d="M438 68.5c10.8 7.7 13.2 22.7 5.5 33.5l-264 368c-4.1 5.7-10.5 9.4-17.5 9.9S148 478 143 473L7 337c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L157 419 404.5 74c7.7-10.8 22.7-13.2 33.5-5.5z" />
    </svg>
  );
};

export const XMarkIcon: React.FC<IconProps> = ({
  className,
  style,
  width = 16,
  height = 16,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      width={width}
      height={height}
      className={className}
      style={style}
      fill="currentColor"
    >
      <path fill="currentColor" d="M7.5 105c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l151 151 151-151c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-151 151 151 151c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-151-151-151 151c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l151-151-151-151z"/>
    </svg>
  );
};

