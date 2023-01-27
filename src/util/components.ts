export const combineClassNames = (
  ...classNames: Array<string | boolean | undefined>
): string =>
  classNames
    .filter((className): className is string => Boolean(className))
    .join(' ');
