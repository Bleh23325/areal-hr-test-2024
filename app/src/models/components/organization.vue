<template>
    <div class="organization">
      <h1>Список организаций</h1>
      <!-- Вывод данных из базы в таблице -->
      <table v-if="organizations.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Комментарии</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="org in organizations" :key="org.id_organization">
            <td>{{ org.id_organization }}</td>
            <td>
              <span v-if="editOrganizationId !== org.id_organization">{{ org.name }}</span>
              <input 
                v-else 
                v-model="editOrganizationData.name" 
                placeholder="Введите название" 
              />
            </td>
            <td>
              <span v-if="editOrganizationId !== org.id_organization">{{ org.comments }}</span>
              <input 
                v-else 
                v-model="editOrganizationData.comments" 
                placeholder="Введите комментарий" 
              />
            </td>
            <td>
              <button 
                v-if="editOrganizationId !== org.id_organization" 
                @click="startEditOrganization(org)"
              >
                Редактировать
              </button>
              <button 
                v-else 
                @click="saveEditOrganization"
              >
                Сохранить
              </button>
              <button 
                v-if="editOrganizationId === org.id_organization" 
                @click="cancelEditOrganization"
              >
                Отмена
              </button>
              <button @click="deleteOrganization(org.id_organization)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Форма для добавления новой организации -->
      <div class="add-org">
        <input v-model="newOrganization.name" placeholder="Введите название организации" />
        <input v-model="newOrganization.comments" placeholder="Введите комментарий" />
        <button @click="addOrganization">Добавить организацию</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        organizations: [],
        newOrganization: {
          name: "",
          comments: "",
        },
        editOrganizationId: null,
        editOrganizationData: {
          id: null,
          name: "",
          comments: "",
        },
      };
    },
    methods: {
      async loadOrganizations() {
        try {
          const response = await axios.get(
            "http://localhost:2508/api/export-organization"
          );
          this.organizations = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке организаций:", error.message);
        }
      },
  
      async addOrganization() {
        const { name, comments } = this.newOrganization;
        if (!name.trim()) {
          alert("Введите название организации");
          return;
        }
        try {
          await axios.post("http://localhost:2508/api/organization", {
            name: name.trim(),
            comments: comments.trim(),
          });
          this.newOrganization = { name: "", comments: "" };
          this.loadOrganizations();
        } catch (error) {
          console.error("Ошибка при добавлении организации:", error.message);
        }
      },
  
      async deleteOrganization(id) {
        try {
          await axios.delete(`http://localhost:2508/api/organization/${id}`);
          this.loadOrganizations();
        } catch (error) {
          console.error("Ошибка при удалении организации:", error.message);
        }
      },
  
      startEditOrganization(org) {
        this.editOrganizationId = org.id_organization;
        this.editOrganizationData = {
          id: org.id_organization,
          name: org.name,
          comments: org.comments,
        };
      },
  
      cancelEditOrganization() {
        this.editOrganizationId = null;
        this.editOrganizationData = { id: null, name: "", comments: "" };
      },
  
      async saveEditOrganization() {
        const { id, name, comments } = this.editOrganizationData;
        if (!name.trim()) {
          alert("Введите название организации");
          return;
        }
        try {
          await axios.put(`http://localhost:2508/api/organization/${id}`, {
            name: name.trim(),
            comments: comments.trim(),
          });
          this.editOrganizationId = null;
          this.editOrganizationData = { id: null, name: "", comments: "" };
          this.loadOrganizations();
        } catch (error) {
          console.error("Ошибка при сохранении изменений:", error.message);
        }
      },
    },
    created() {
      this.loadOrganizations();
    },
  };
  </script>
  
  <style scoped>
  .organization {
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
  
  .add-org {
    margin-top: 20px;
  }
  
  input {
    margin-right: 10px;
    padding: 5px;
  }
  </style>  