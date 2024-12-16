<template>
<form class="main_search" @submit.prevent>
    <input
      v-model="title"
      class="input"
      type="text"
      placeholder="Поиск:"
    />
    <button @click="search_value">Найти</button>
</form>

</template>

<script>
export default {
  data() {
    return {
      title: "", 
    };
  },
  methods: {
    search_value() {
      this.title = ""; 
    },
  },
};
</script>

<style>
.main_search{
    padding: 10px;
    display: flex;
    flex-direction: row;
    background-color: silver;
    border-radius: 10px;
    width: 1000px;
    justify-content: space-between;
}
input{
    width: 85%;
}

</style>