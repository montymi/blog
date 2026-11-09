function getRandomRGBNumber() {
  return Math.floor(Math.random() * 256);
}

/** A random RGB color and its inverse, as CSS `rgb(...)` strings. */
export function getRandomColor(): [string, string] {
  const r = getRandomRGBNumber();
  const g = getRandomRGBNumber();
  const b = getRandomRGBNumber();

  return [`rgb(${r}, ${g}, ${b})`, `rgb(${255 - r}, ${255 - g}, ${255 - b})`];
}
