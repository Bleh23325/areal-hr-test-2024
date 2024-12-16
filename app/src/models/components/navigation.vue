<template>
  <div class="main_navigation">
    <div class="navigation_panel" v-for="panel in navigation_panel" :key="panel.id">
      <router-link :to="panel.path">
        <button>{{ panel.title }}</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navigation_panel: [
        { id: 1, title: "Отделы", path: "/departments" },
        { id: 2, title: "Должности", path: "/job-titles" },
        { id: 3, title: "Найм", path: "/hiring" },
        { id: 4, title: "Персональные операции", path: "/personal-operations" },
        { id: 5, title: "Работники", path: "/employees" },
        { id: 6, title: "Паспорта", path: "/passports" },
        { id: 7, title: "Адреса", path: "/addresses" },
        { id: 8, title: "Фото паспортов", path: "/passport-photos" },
        { id: 9, title: "Права доступа", path: "/access-rights" },
        { id: 10, title: "Пользователи", path: "/users" },
        { id: 11, title: "История изменений", path: "/change-history" },
        { id: 12, title: "Организации", path: "/organization" },
      ],
    };
  },
};
</script>

<style>
* {
  padding: 0px;
  margin: 0px;
}
.main_navigation {
  padding: 20px;
  background-color: silver;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-wrap: wrap;
}
button {
  width: 120px;
  font-size: 15px;
}
</style>
