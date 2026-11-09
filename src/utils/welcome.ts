import { title } from '@/config';
import { getRandomColor } from '@/lib/color';

// this utility is used to welcome users in the console
function welcome() {
  const [color, invertedColor] = getRandomColor();

  const styles = [
    'font-size: 40px',
    `color: ${color}`,
    `border: 1px solid ${invertedColor}`,
    `background-color: ${invertedColor}`,
    'border-radius: 5px',
    'padding: 10px',
  ].join(';');

  console.log(`%c=== ${title} ===`, styles);
}

export default welcome;
