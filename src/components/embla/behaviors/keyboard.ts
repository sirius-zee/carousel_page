import type { CarouselBehavior } from "../types";

export function createKeyboardBehavior(): CarouselBehavior {
  let rootNode: HTMLElement | null = null;
  let keyHandler: ((e: KeyboardEvent) => void) | null = null;

  return {
    name: "keyboard",
    init(ctx) {
      rootNode = ctx.emblaApi.rootNode();
      if (!rootNode) return;

      keyHandler = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          ctx.scrollPrev();
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          ctx.scrollNext();
        }
      };

      if (!rootNode.hasAttribute("tabindex")) {
        rootNode.setAttribute("tabindex", "0");
      }
      rootNode.addEventListener("keydown", keyHandler);
    },
    destroy() {
      if (rootNode && keyHandler) {
        rootNode.removeEventListener("keydown", keyHandler);
      }
      rootNode = null;
      keyHandler = null;
    },
  };
}

export const keyboardBehavior = createKeyboardBehavior();
