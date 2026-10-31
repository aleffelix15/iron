import gsap from "gsap";

/**
 * Varredura de tela usada entre seções: o véu cobre a tela da esquerda
 * para a direita, `swap` troca o conteúdo no meio, e o véu sai pela direita.
 */
export function sectionWipe(veil: HTMLElement, swap: () => void, done: () => void) {
  gsap
    .timeline({ onComplete: done })
    .set(veil, { transformOrigin: "left center" })
    .fromTo(veil, { scaleX: 0 }, { scaleX: 1, duration: 0.38, ease: "power3.inOut" })
    .add(swap)
    .set(veil, { transformOrigin: "right center" })
    .to(veil, { scaleX: 0, duration: 0.5, ease: "power3.inOut" }, "+=0.04");
}
