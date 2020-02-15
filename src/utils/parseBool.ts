export const parseBool = (arg: string) =>
  typeof arg === 'string' ? arg.toLowerCase() === 'true' : false;
