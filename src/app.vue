<template>
  <div class="app">
    <h1 :class="$style.blue">
      Hello World
    </h1>
    <h2>{{ $style.blue }}</h2>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({}),
  methods: {},
};
</script>

<style module>
.blue {
  border: 1px solid blue;
}

h2 {
  color: red;
}
</style>

<style scoped>
.app {
  color: green;
}
</style>

<style lang="scss">
h1 {
  text-transform: uppercase;
  margin: 0;
}
</style>

<style lang="scss" module="b">
h1 {
  font-size: $base-font-size / 4;
}
</style>
