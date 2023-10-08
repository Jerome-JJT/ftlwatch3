
export function comparePoolfilters(a: string, b: string): number {
  const [yearA, monthA] = a.split('.');
  const [yearB, monthB] = b.split('.');

  if (a.toLowerCase() === 'none.none') {
    return 1;
  }
  else if (b.toLowerCase() === 'none.none') {
    return -1;
  }

  if (yearA !== yearB) {
    return parseInt(yearA) - parseInt(yearB);
  }

  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  return months.indexOf(monthA) - months.indexOf(monthB);
}
