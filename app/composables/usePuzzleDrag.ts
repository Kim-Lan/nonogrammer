import { EMPTY_VALUE, FILLED_VALUE, MARKED_VALUE } from '~~/shared/constants/nonograms-constants';

export type UsePointerOptions = {
  puzzleGrid: Ref<HTMLElement | null>;
  getWidth: () => number;
  getCell: (index: number) => CellState;
  setCell: (index: number, state: CellState) => void;
};

export function usePuzzleDrag({ puzzleGrid, getWidth, getCell, setCell }: UsePointerOptions) {
  const pointerId = ref<number | null>(null);
  const paintState = ref<CellState | null>(null);
  const isPressed = computed(() => pointerId.value !== null);

  let buttonMask = 0;
  let previousCell: number | null = null;

  function cellAt(event: Pick<PointerEvent, 'clientX' | 'clientY'>): number | null {
    const cell = document.elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-cell-index]');

    if (!cell || !puzzleGrid.value?.contains(cell)) {
      return null;
    }

    const rawIndex = cell.dataset.cellIndex;
    if (rawIndex === undefined || rawIndex === '') {
      return null;
    }

    const index = Number(rawIndex);
    return Number.isSafeInteger(index) && index >= 0 ? index : null;
  }

  function paintAt(position: Pick<PointerEvent, 'clientX' | 'clientY'>) {
    const state = paintState.value;
    if (state === null) {
      return;
    }

    const index = cellAt(position);
    if (index === null) {
      previousCell = null;
      return;
    }

    if (previousCell === null) {
      setCell(index, state);
    } else if (previousCell !== index) {
      paintLine(previousCell, index, state);
    }

    previousCell = index;
  }

  /**
   * Interpolates between two puzzle cells using a supercover
   * line algorithm, ensuring intermediate cells are painted
   * during fast pointer movements.
   *
   * Based on Amit Patel's supercover line drawing algorithm:
   * https://www.redblobgames.com/grids/line-drawing/#supercover
   */
  function paintLine(from: number, to: number, state: CellState) {
    const width = getWidth();
    if (!Number.isSafeInteger(width) || width <= 0) {
      setCell(to, state);
      return;
    }

    let { rowIndex: y, columnIndex: x } = convertIndexTo2D(from, width);
    const { rowIndex: endY, columnIndex: endX } = convertIndexTo2D(to, width);

    const dx = endX - x;
    const dy = endY - y;
    const nx = Math.abs(dx);
    const ny = Math.abs(dy);
    const stepX = Math.sign(dx);
    const stepY = Math.sign(dy);

    let ix = 0;
    let iy = 0;
    setCell(y * width + x, state);

    while (ix < nx || iy < ny) {
      const decision = (1 + 2 * ix) * ny - (1 + 2 * iy) * nx;

      if (decision < 0) {
        x += stepX;
        ix++;
      } else if (decision > 0) {
        y += stepY;
        iy++;
      } else {
        x += stepX;
        y += stepY;
        ix++;
        iy++;
      }

      setCell(y * width + x, state);
    }
  }

  function onPointerDown(event: PointerEvent) {
    if (isPressed.value || (event.button !== 0 && event.button !== 2)) {
      return;
    }

    const index = cellAt(event);
    if (index === null) {
      return;
    }

    event.preventDefault();

    const selectedState: CellState = event.button === 2 ? MARKED_VALUE : FILLED_VALUE;
    const nextState: CellState = getCell(index) === selectedState ? EMPTY_VALUE : selectedState;

    pointerId.value = event.pointerId;
    paintState.value = nextState;
    buttonMask = event.button === 2 ? 2 : 1;
    previousCell = index;

    setCell(index, nextState);
    puzzleGrid.value?.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerId !== pointerId.value || paintState.value === null) {
      return;
    }

    if ((event.buttons & buttonMask) === 0) {
      endDrag(event);
      return;
    }

    for (const position of event.getCoalescedEvents?.() ?? []) {
      paintAt(position);
    }
    paintAt(event);
  }

  function onPointerUp(event: PointerEvent) {
    if (event.pointerId !== pointerId.value) {
      return;
    }

    paintAt(event);
    endDrag(event);
  }

  function endDrag(event: PointerEvent) {
    if (event.pointerId !== pointerId.value) {
      return;
    }

    pointerId.value = null;
    paintState.value = null;
    buttonMask = 0;
    previousCell = null;

    if (puzzleGrid.value?.hasPointerCapture(event.pointerId)) {
      puzzleGrid.value.releasePointerCapture(event.pointerId);
    }
  }

  return {
    isPressed,
    paintState,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    endDrag,
  };
}
