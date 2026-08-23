// Cycles through the 6 staggered .delay-N classes defined in globals.css for
// list/grid items animating in with .fade-slide-up.
export function delayClass(index: number): string {
  return `delay-${(index % 6) + 1}`;
}
