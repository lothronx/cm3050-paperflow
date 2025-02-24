export const PageSizes = {
  A4: {
    id: "A4",
    width: 210,
    height: 297,
  },
  Letter: {
    id: "Letter",
    width: 215.9,
    height: 279.4,
  },
  Legal: {
    id: "Legal",
    width: 215.9,
    height: 355.6,
  },
  Manual: {
    id: "Manual",
    width: NaN,
    height: NaN,
  },
} as const;

export type PageSize = keyof typeof PageSizes;

export type PageSizeDimensions = (typeof PageSizes)[PageSize];
