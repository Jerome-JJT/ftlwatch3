


const keyTypes = ['number', 'string'];

export function createKey(value: any, index: number): string {

  if (keyTypes.includes(typeof value.id)) {
    return value.id.toString();
  }
  else if (keyTypes.includes(typeof value.user_id)) {
    return value.user_id.toString();
  }
  else if (keyTypes.includes(typeof value.login)) {
    return value.login.toString();
  }

  return index.toString();
}



