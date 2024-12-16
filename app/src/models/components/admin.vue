<template>
    <div class="main">
      <navigation />
      <div class="sub">
        <search />
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  import navigation from './navigation.vue';
  import search from './search.vue';
  
  export default {
    components: {
      navigation,
      search,
    },
  };
  </script>
  
  <style>
  * {
    padding: 0px;
    margin: 0px;
  }
  .main {
    display: flex;
    flex-direction: row;
    margin: 80px 100px 0px 100px;
    gap: 40px;
  }
  .sub {
    gap: 20px;
    display: flex;
    flex-direction: column;
  }
  </style>
  