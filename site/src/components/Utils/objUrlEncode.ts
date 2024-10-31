
export function objUrlEncode(obj: any, allowEmpty: boolean = false): string {
  const keyValues = Object.entries(obj).flatMap(
    (kv) => (kv[1] !== undefined && kv[1] !== null && (kv[1] !== '' || allowEmpty === true)) ? `${kv[0]}=${kv[1]}` : []
  );

  return keyValues.join('&');
}
