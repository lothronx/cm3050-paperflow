export const PageSizes = {
  A4: {
    width: 595,
    height: 842,
  },
  Letter: {
    width: 612,
    height: 792,
  },
  Legal: {
    width: 612,
    height: 1008,
  },
  Manual: {
    width: 595,
    height: 842,
  },
} as const;

export type PageSize = keyof typeof PageSizes;

export type PageSizeDimensions = (typeof PageSizes)[PageSize];
