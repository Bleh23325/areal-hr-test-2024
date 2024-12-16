<template>
    <div class="roots_look">
      <h1>Список отделов</h1>
      <!-- Таблица с отделами -->
      <table v-if="departments.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Организация</th>
            <th>Название отдела</th>
            <th>Комментарии</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dept in departments" :key="dept.id_department">
            <td>{{ dept.id_department }}</td>
            <td>
              <select
                v-if="editDepartmentId === dept.id_department"
                v-model="editDepartmentData.organization"
              >
                <option 
                  v-for="org in organizations" 
                  :key="org.id_organization" 
                  :value="org.id_organization"
                >
                  {{ org.name }}
                </option>
              </select>
              <span v-else>{{ getOrganizationName(dept.organization) }}</span>
            </td>
            <td>
              <input
                v-if="editDepartmentId === dept.id_department"
                v-model="editDepartmentData.name"
                placeholder="Введите название отдела"
              />
              <span v-else>{{ dept.name }}</span>
            </td>
            <td>
              <input
                v-if="editDepartmentId === dept.id_department"
                v-model="editDepartmentData.comments"
                placeholder="Введите комментарий"
              />
              <span v-else>{{ dept.comments }}</span>
            </td>
            <td>
              <button
                v-if="editDepartmentId !== dept.id_department"
                @click="startEditDepartment(dept)"
              >
                Редактировать
              </button>
              <button v-else @click="saveEditDepartment">Сохранить</button>
              <button
                v-if="editDepartmentId === dept.id_department"
                @click="cancelEditDepartment"
              >
                Отмена
              </button>
              <button @click="deleteDepartment(dept.id_department)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Форма для добавления нового отдела -->
      <div class="add_root">
        <select v-model="newDepartment.organization">
          <option value="" disabled>Выберите организацию</option>
          <option 
            v-for="org in organizations" 
            :key="org.id_organization" 
            :value="org.id_organization"
          >
            {{ org.name }}
          </option>
        </select>
        <input v-model="newDepartment.name" placeholder="Введите название отдела" />
        <input v-model="newDepartment.comments" placeholder="Введите комментарий" />
        <button @click="addDepartment">Добавить отдел</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        organizations: [],
        departments: [],
        newDepartment: {
          organization: null,
          name: "",
          comments: "",
        },
        editDepartmentId: null,
        editDepartmentData: {
          id: null,
          organization: null,
          name: "",
          comments: "",
        },
      };
    },
    methods: {
      async loadOrganizations() {
        try {
          const response = await axios.get("http://localhost:2508/api/export-organization");
          this.organizations = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке организаций:", error.message);
        }
      },
      async loadDepartments() {
        try {
          const response = await axios.get("http://localhost:2508/api/export-department");
          this.departments = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке отделов:", error.message);
        }
      },
      getOrganizationName(orgId) {
        const org = this.organizations.find(o => o.id_organization === orgId);
        return org ? org.name : "Неизвестно";
      },
      async addDepartment() {
        const { organization, name, comments } = this.newDepartment;
        if (!organization || !name.trim()) {
          alert("Укажите организацию и название отдела");
          return;
        }
        try {
          await axios.post("http://localhost:2508/api/department", {
            organization,
            name: name.trim(),
            comments: comments.trim(),
          });
          this.newDepartment = { organization: null, name: "", comments: "" };
          this.loadDepartments();
        } catch (error) {
          console.error("Ошибка при добавлении отдела:", error.message);
        }
      },
      async deleteDepartment(id) {
        try {
          await axios.delete(`http://localhost:2508/api/department/${id}`);
          this.loadDepartments();
        } catch (error) {
          console.error("Ошибка при удалении отдела:", error.message);
        }
      },
      startEditDepartment(dept) {
        this.editDepartmentId = dept.id_department;
        this.editDepartmentData = {
          id: dept.id_department,
          organization: dept.organization,
          name: dept.name,
          comments: dept.comments,
        };
      },
      cancelEditDepartment() {
        this.editDepartmentId = null;
        this.editDepartmentData = { id: null, organization: null, name: "", comments: "" };
      },
      async saveEditDepartment() {
        const { id, organization, name, comments } = this.editDepartmentData;
        if (!organization || !name.trim()) {
          alert("Укажите организацию и название отдела");
          return;
        }
        try {
          await axios.put(`http://localhost:2508/api/department/${id}`, {
            organization,
            name: name.trim(),
            comments: comments.trim(),
          });
          this.editDepartmentId = null;
          this.editDepartmentData = { id: null, organization: null, name: "", comments: "" };
          this.loadDepartments();
        } catch (error) {
          console.error("Ошибка при сохранении изменений отдела:", error.message);
        }
      },
    },
    created() {
      this.loadOrganizations();
      this.loadDepartments();
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
  
  input,
  select {
    margin-right: 10px;
    padding: 5px;
  }
  </style>  