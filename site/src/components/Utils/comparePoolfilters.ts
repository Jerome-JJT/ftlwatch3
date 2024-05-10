
export function comparePoolfilters(a: string, b: string): number {
  const [yearA, monthA] = String(a).split('.');
  const [yearB, monthB] = String(b).split('.');

  if (String(a).toLowerCase() === 'none.none') {
    return 1;
  }
  else if (String(b).toLowerCase() === 'none.none') {
    return -1;
  }

  if (yearA !== yearB) {
    return parseInt(yearA) - parseInt(yearB);
  }

  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  return months.indexOf(monthA) - months.indexOf(monthB);
}
