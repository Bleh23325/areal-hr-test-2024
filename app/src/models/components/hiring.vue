<template>
    <div class="roots_look">
      <h1>Список Найма</h1>
  
      <!-- Таблица с наймом -->
      <table v-if="hiringData.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Отдел</th>
            <th>Должность</th>
            <th>Зарплата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hire in hiringData" :key="hire.id_hiring">
            <td>{{ hire.id_hiring }}</td>
            <td>
              <select
                v-if="editHiringId === hire.id_hiring"
                v-model="editHiringData.department"
              >
                <option
                  v-for="dept in departments"
                  :key="dept.id_department"
                  :value="dept.id_department"
                >
                  {{ dept.name }}
                </option>
              </select>
              <span v-else>{{ getDepartmentName(hire.department) }}</span>
            </td>
            <td>
              <select
                v-if="editHiringId === hire.id_hiring"
                v-model="editHiringData.job_title"
              >
                <option
                  v-for="job in jobTitles"
                  :key="job.id_job_title"
                  :value="job.id_job_title"
                >
                  {{ job.name }}
                </option>
              </select>
              <span v-else>{{ getJobTitleName(hire.job_title) }}</span>
            </td>
            <td>
              <input
                v-if="editHiringId === hire.id_hiring"
                v-model="editHiringData.salary"
                type="number"
                placeholder="Введите зарплату"
              />
              <span v-else>{{ hire.salary }}</span>
            </td>
            <td>
              <button
                v-if="editHiringId !== hire.id_hiring"
                @click="startEditHiring(hire)"
              >
                Редактировать
              </button>
              <button v-else @click="saveEditHiring">Сохранить</button>
              <button
                v-if="editHiringId === hire.id_hiring"
                @click="cancelEditHiring"
              >
                Отмена
              </button>
              <button @click="deleteHiring(hire.id_hiring)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Форма для добавления нового найма -->
      <div class="add_root">
        <select v-model="newHiring.department">
          <option value="" disabled>Выберите отдел</option>
          <option
            v-for="dept in departments"
            :key="dept.id_department"
            :value="dept.id_department"
          >
            {{ dept.name }}
          </option>
        </select>
        <select v-model="newHiring.job_title">
          <option value="" disabled>Выберите должность</option>
          <option
            v-for="job in jobTitles"
            :key="job.id_job_title"
            :value="job.id_job_title"
          >
            {{ job.name }}
          </option>
        </select>
        <input
          v-model="newHiring.salary"
          type="number"
          placeholder="Введите зарплату"
        />
        <button @click="addHiring">Добавить найм</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        departments: [],
        jobTitles: [],
        hiringData: [],
        newHiring: {
          department: null,
          job_title: null,
          salary: null,
        },
        editHiringId: null,
        editHiringData: {
          id_hiring: null,
          department: null,
          job_title: null,
          salary: null,
        },
      };
    },
    methods: {
      async loadDepartments() {
        try {
          const response = await axios.get("http://localhost:2508/api/export-department");
          this.departments = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке отделов:", error.message);
        }
      },
      async loadJobTitles() {
        try {
          const response = await axios.get("http://localhost:2508/api/export-job-titles");
          this.jobTitles = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке должностей:", error.message);
        }
      },
      async loadHiringData() {
        try {
          const response = await axios.get("http://localhost:2508/api/export-hiring");
          this.hiringData = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке данных о найме:", error.message);
        }
      },
      getDepartmentName(deptId) {
        const dept = this.departments.find(d => d.id_department === deptId);
        return dept ? dept.name : "Неизвестно";
      },
      getJobTitleName(jobId) {
        const job = this.jobTitles.find(j => j.id_job_title === jobId);
        return job ? job.name : "Неизвестно";
      },
      async addHiring() {
        const { department, job_title, salary } = this.newHiring;
        if (!department || !job_title || !salary) {
          alert("Заполните все поля");
          return;
        }
        try {
          await axios.post("http://localhost:2508/api/hiring", {
            department,
            job_title,
            salary,
          });
          this.newHiring = { department: null, job_title: null, salary: null };
          this.loadHiringData();
        } catch (error) {
          console.error("Ошибка при добавлении найма:", error.message);
        }
      },
      async deleteHiring(id) {
        try {
          await axios.delete(`http://localhost:2508/api/hiring/${id}`);
          this.loadHiringData();
        } catch (error) {
          console.error("Ошибка при удалении найма:", error.message);
        }
      },
      startEditHiring(hire) {
        this.editHiringId = hire.id_hiring;
        this.editHiringData = { ...hire };
      },
      cancelEditHiring() {
        this.editHiringId = null;
        this.editHiringData = { id_hiring: null, department: null, job_title: null, salary: null };
      },
      async saveEditHiring() {
        const { id_hiring, department, job_title, salary } = this.editHiringData;
        if (!department || !job_title || !salary) {
          alert("Заполните все поля");
          return;
        }
        try {
          await axios.put(`http://localhost:2508/api/hiring/${id_hiring}`, {
            department,
            job_title,
            salary,
          });
          this.cancelEditHiring();
          this.loadHiringData();
        } catch (error) {
          console.error("Ошибка при сохранении данных о найме:", error.message);
        }
      },
    },
    created() {
      this.loadDepartments();
      this.loadJobTitles();
      this.loadHiringData();
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