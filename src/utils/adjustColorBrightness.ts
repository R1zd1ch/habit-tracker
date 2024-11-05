/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

function adjustColorBrightness(colorName: any, lightness = 70, saturation = 100) {
  // Таблица цветовых имен в формате RGB
  const colorNamesToRgb = {
    red: 'rgb(255, 0, 0)',
    green: 'rgb(0, 128, 0)',
    blue: 'rgb(0, 0, 255)',
    yellow: 'rgb(255, 255, 0)',
    indigo: 'rgb(75, 0, 130)',
    pink: 'rgb(255, 192, 203)',
    purple: 'rgb(128, 0, 128)',
    teal: 'rgb(0, 128, 128)',
  } as any;

  // Получаем RGB из имени цвета
  const rgb = colorNamesToRgb[colorName.toLowerCase()];
  if (!rgb) return colorName; // Если цвет не найден, возвращаем исходное значение

  // Преобразуем RGB в HSL
  const rgbToHsl = (rgb: any) => {
    const [r, g, b] = rgb
      .match(/\d+/g)
      .map(Number)
      .map((v: any) => v / 255);
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h =
        (r === max
          ? (g - b) / d + (g < b ? 6 : 0)
          : g === max
            ? (b - r) / d + 2
            : (r - g) / d + 4) * 60;
    }

    return `hsl(${Math.round(h)}, ${saturation}%, ${lightness}%)`;
  };

  return rgbToHsl(rgb);
}

export default adjustColorBrightness;
