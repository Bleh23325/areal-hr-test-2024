<template>
    <div class="roots_look">
      <h1>Список прав доступа</h1>
      <!-- Вывод данных из базы в таблице -->
      <table v-if="roots.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="root in roots" :key="root.id_root">
            <td>{{ root.id_root }}</td>
            <td>{{ root.name }}</td>
            <td>
              <button @click="editRoot(root.id_root)">Редактировать</button>
              <button @click="deleteRoot(root.id_root)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Форма для добавления новых прав доступа -->
      <div class="add_root">
        <input v-model="newRoot" placeholder="Введите название прав доступа" />
        <button @click="addRoot">Добавить права</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        roots: [], // Список прав доступа
        newRoot: "", // Новое право доступа
      };
    },
    methods: {
      async loadRoots() {
        try {
          const response = await axios.get("http://localhost:2508/api/export-roots");
          this.roots = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке прав доступа:", error);
        }
      },
  
      async addRoot() {
        if (!this.newRoot) {
          alert("Введите название прав");
          return;
        }
        try {
          await axios.post("http://localhost:2508/api/roots", {
            name: this.newRoot,
          });
          this.newRoot = "";
          this.loadRoots();
        } catch (error) {
          console.error("Ошибка при добавлении прав доступа:", error);
        }
      },
  
      async deleteRoot(id) {
        try {
          await axios.delete(`http://localhost:2508/api/roots/${id}`);
          this.loadRoots();
        } catch (error) {
          console.error("Ошибка при удалении прав доступа:", error);
        }
      },
  
      async editRoot(id) {
        const newName = prompt("Введите новое имя прав");
        if (!newName) return;
  
        try {
          await axios.put(`http://localhost:2508/api/roots/${id}`, {
            name: newName,
          });
          this.loadRoots();
        } catch (error) {
          console.error("Ошибка при редактировании прав доступа:", error);
        }
      },
    },
    created() {
      this.loadRoots();
    },
  };
  </script>
  
  <style scoped>
  .roots_look {
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  button {
    margin-right: 5px;
  }
  
  .add_root {
    margin-top: 20px;
  }
  
  input {
    margin-right: 10px;
    padding: 5px;
  }
  </style>  