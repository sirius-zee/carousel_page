import type { SlideTransform } from "../types/transform";

export function mergeSlideTransforms(
  transforms: SlideTransform[],
): SlideTransform {
  return transforms.reduce<SlideTransform>((acc, transform) => {
    if (!transform) return acc;

    if (transform.translate) {
      acc.translate = acc.translate ?? {};
      if (typeof transform.translate.primary === "string") {
        acc.translate.primary = transform.translate.primary;
      } else if (typeof transform.translate.primary === "number") {
        acc.translate.primary =
          typeof acc.translate.primary === "number"
            ? acc.translate.primary + transform.translate.primary
            : transform.translate.primary;
      }

      if (typeof transform.translate.cross === "string") {
        acc.translate.cross = transform.translate.cross;
      } else if (typeof transform.translate.cross === "number") {
        acc.translate.cross =
          typeof acc.translate.cross === "number"
            ? acc.translate.cross + transform.translate.cross
            : transform.translate.cross;
      }

      acc.translate.depth =
        (acc.translate.depth ?? 0) + (transform.translate.depth ?? 0);
    }


    if (transform.rotate) {
      acc.rotate = acc.rotate ?? {};
      acc.rotate.x = (acc.rotate.x ?? 0) + (transform.rotate.x ?? 0);
      acc.rotate.y = (acc.rotate.y ?? 0) + (transform.rotate.y ?? 0);
      acc.rotate.z = (acc.rotate.z ?? 0) + (transform.rotate.z ?? 0);
    }

    if (transform.scale) {
      acc.scale = acc.scale ?? {};
      acc.scale.x = (acc.scale.x ?? 1) * (transform.scale.x ?? 1);
      acc.scale.y = (acc.scale.y ?? 1) * (transform.scale.y ?? 1);
      acc.scale.z = (acc.scale.z ?? 1) * (transform.scale.z ?? 1);
    }

    if (transform.opacity !== undefined) {
      acc.opacity = transform.opacity;
    }

    if (transform.blur !== undefined) {
      acc.blur = (acc.blur ?? 0) + transform.blur;
    }

    if (transform.brightness !== undefined) {
      acc.brightness = (acc.brightness ?? 1) * transform.brightness;
    }

    if (transform.contrast !== undefined) {
      acc.contrast = (acc.contrast ?? 1) * transform.contrast;
    }

    if (transform.saturate !== undefined) {
      acc.saturate = (acc.saturate ?? 1) * transform.saturate;
    }

    if (transform.grayscale !== undefined) {
      acc.grayscale = transform.grayscale;
    }

    if (transform.zIndex !== undefined) {
      acc.zIndex =
        acc.zIndex !== undefined
          ? Math.max(acc.zIndex, transform.zIndex)
          : transform.zIndex;
    }

    if (transform.pointerEvents !== undefined) {
      acc.pointerEvents = transform.pointerEvents;
    }

    if (transform.visibility !== undefined) {
      acc.visibility = transform.visibility;
    }

    if (transform.transformOrigin !== undefined) {
      acc.transformOrigin = transform.transformOrigin;
    }

    if (transform.perspective !== undefined) {
      acc.perspective = transform.perspective;
    }

    return acc;
  }, {});
}
