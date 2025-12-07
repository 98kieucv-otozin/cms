export interface CarColor {
  code: string;
  value: string;
  color: string;
  border?: string;
}

export const CAR_COLORS: CarColor[] = [
  { code: "white", value: "Trắng", color: "#FFFFFF", border: "#d9d9d9" },
  { code: "black", value: "Đen", color: "#000000" },
  { code: "silver", value: "Bạc", color: "#C0C0C0" },
  { code: "gray", value: "Xám", color: "#808080" },
  { code: "dark_gray", value: "Xám đen", color: "#2C2C2C" },
  { code: "blue", value: "Xanh dương", color: "#0066CC" },
  { code: "navy", value: "Xanh navy", color: "#001F5C" },
  { code: "green", value: "Xanh lá", color: "#00CC66" },
  { code: "olive", value: "Xanh rêu", color: "#6B8E23" },
  { code: "turquoise", value: "Xanh ngọc", color: "#00CED1" },
  { code: "red", value: "Đỏ", color: "#CC0000" },
  { code: "dark_red", value: "Đỏ đậm", color: "#8B0000" },
  { code: "yellow", value: "Vàng", color: "#FFCC00" },
  { code: "bronze", value: "Vàng đồng", color: "#CD7F32" },
  { code: "orange", value: "Cam", color: "#FF6600" },
  { code: "brown", value: "Nâu", color: "#8B4513" },
  { code: "beige", value: "Be", color: "#F5DEB3" },
  { code: "purple", value: "Tím", color: "#6600CC" },
  { code: "pink", value: "Hồng", color: "#FF69B4" },
];

