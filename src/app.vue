<template>
  <div class="app">
    <h1 :class="$style.blue">
      Hello World
    </h1>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
  methods: {}
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