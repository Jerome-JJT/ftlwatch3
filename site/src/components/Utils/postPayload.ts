


export function postPayload(obj: any): string {
  const keyValues = Object.entries(obj).map((kv) => `${kv[0]}=${kv[1]}`);

  return keyValues.join('&');
}
