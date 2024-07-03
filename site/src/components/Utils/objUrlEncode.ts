
export function objUrlEncode(obj: any): string {
  const keyValues = Object.entries(obj).flatMap(
      (kv) => (kv[1] !== undefined && kv[1] !== null && kv[1] !== '') ? `${kv[0]}=${kv[1]}` : []
    );

  return keyValues.join('&');
}
