<script lang="ts" setup>
const props = defineProps({
  height: {
    type: Number,
    default: 10,
  },
  width: {
    type: Number,
    default: 10,
  },
});

const gridBorder = '#263238';
const gridHover = 'bisque';
const thinBorder = `1px solid ${gridBorder}`;
const thickBorder = `2px solid ${gridBorder}`;

const cellSize = computed(() => {
  if (props.width === 5) {
    return '25px';
  } else if (props.width === 10) {
    return '22px';
  } else if (props.width === 15) {
    return '20px';
  } else if (props.width === 20) {
    return '18px';
  }
  return '16px';
});
</script>

<template>
  <div class="puzzle-container">
    <div class="puzzle-grid">
      <PuzzleCell
        v-for="n in props.height * props.width"
        :key="`cell_${n - 1}`"
        :index="n - 1"
        :class="{
          'first-row': n <= props.width,
          'first-col': (n - 1) % props.width === 0,
          'five-row': Math.ceil(n / props.height) % 5 === 0,
          'five-col': n % 5 === 0,
          'last-row': n > (props.height * props.width) - props.width,
          'last-col': n % props.width === 0,
        }"
      />
    </div>
  </div>
</template>

<style lang="scss">
.puzzle-grid {
  box-sizing: border-box;
  grid-area: 2 / 2;
  border-collapse: collapse;
  background-color: v-bind(gridBorder);

  border: v-bind(thickBorder);

  display: grid;
  grid-template-rows: repeat(v-bind('props.height'), v-bind('cellSize'));
  grid-template-columns: repeat(v-bind('props.width'), v-bind('cellSize'));

  div {
    box-sizing: border-box;
    background-color: white;
    position: relative;

    &:not(.last-row) {
      border-bottom: v-bind(thinBorder);
    }

    &:not(.last-col) {
      border-right: v-bind(thinBorder);
    }

    &:hover {
      background-color: v-bind(gridHover);
    }
  }
}

div.five-row {
  &:not(.last-row) {
    border-bottom: v-bind(thickBorder);
  }
}

div.five-col {
  &:not(.last-col) {
    border-right: v-bind(thickBorder);
  }
}
</style>
