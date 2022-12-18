export const combineClassNames = (
  ...classNames: Array<string | undefined>
): string =>
  classNames
    .filter((className): className is string => Boolean(className))
    .join(' ');
