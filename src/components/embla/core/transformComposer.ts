import type { CSSProperties } from "react";
import type { AxisManager } from "../types/axis";
import type { SlideTransform } from "../types/transform";
import { mergeSlideTransforms } from "../utils/mergeTransforms";

export function composeSlideStyle(
  axisManager: AxisManager,
  transforms: SlideTransform[],
): CSSProperties {
  const merged = mergeSlideTransforms(transforms);
  const style: CSSProperties = {};
  const transformParts: string[] = [];
  const filterParts: string[] = [];

  if (merged.translate) {
    transformParts.push(
      axisManager.translate(
        merged.translate.primary ?? 0,
        merged.translate.cross ?? 0,
        merged.translate.depth ?? 0,
      ),
    );
  }

  if (merged.rotate) {
    if (merged.rotate.x !== undefined)
      transformParts.push(`rotateX(${merged.rotate.x}deg)`);
    if (merged.rotate.y !== undefined)
      transformParts.push(`rotateY(${merged.rotate.y}deg)`);
    if (merged.rotate.z !== undefined)
      transformParts.push(`rotateZ(${merged.rotate.z}deg)`);
  }

  if (merged.scale) {
    const x = merged.scale.x ?? 1;
    const y = merged.scale.y ?? 1;
    const z = merged.scale.z ?? 1;
    transformParts.push(`scale3d(${x}, ${y}, ${z})`);
  }

  if (transformParts.length > 0) {
    style.transform = transformParts.join(" ");
  }

  if (merged.opacity !== undefined) {
    style.opacity = merged.opacity;
  }

  if (merged.blur !== undefined) {
    filterParts.push(`blur(${merged.blur}px)`);
  }
  if (merged.brightness !== undefined) {
    filterParts.push(`brightness(${merged.brightness})`);
  }
  if (merged.contrast !== undefined) {
    filterParts.push(`contrast(${merged.contrast})`);
  }
  if (merged.saturate !== undefined) {
    filterParts.push(`saturate(${merged.saturate})`);
  }
  if (merged.grayscale !== undefined) {
    filterParts.push(`grayscale(${merged.grayscale})`);
  }

  if (filterParts.length > 0) {
    style.filter = filterParts.join(" ");
  }

  if (merged.zIndex !== undefined) {
    style.zIndex = merged.zIndex;
  }

  if (merged.pointerEvents !== undefined) {
    style.pointerEvents = merged.pointerEvents;
  }

  if (merged.visibility !== undefined) {
    style.visibility = merged.visibility;
  }

  if (merged.transformOrigin) {
    style.transformOrigin = merged.transformOrigin;
  }

  if (merged.perspective !== undefined) {
    style.perspective = merged.perspective;
  }

  return style;
}
