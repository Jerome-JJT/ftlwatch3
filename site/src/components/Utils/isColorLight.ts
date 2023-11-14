
export function isColorLight(hexColor: string): boolean {
  hexColor = hexColor.replace(/^#/, '');

  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  if (brightness > 0.5) {
    return true;
  }
  else {
    return false;
  }
}
