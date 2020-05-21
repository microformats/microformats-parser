export const isLocalLink = (link: string): boolean =>
  !link.includes("://") && !link.startsWith("#");

export const applyBaseUrl = (link: string, baseUrl: string): string =>
  new URL(link, baseUrl).toString();
