import { fabric } from "fabric";

export const getColorFilter = (color: string) => {
  // @ts-ignore
  return new fabric.Image.filters.RemoveColor({
    threshold: 0.2,
    color,
  });
};
