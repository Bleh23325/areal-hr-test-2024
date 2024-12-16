<template>
  <div class="job-title">
    <h1>Список долностей</h1>
    <!-- Вывод данных из базы в таблице -->
    <table v-if="jobTitles.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobTitles" :key="job.id_job_title">
          <td>{{ job.id_job_title }}</td>
          <td>{{ job.name }}</td>
          <td>
            <button @click="editJobTitle(job.id_job_title)">Редактировать</button>
            <button @click="deleteJobTitle(job.id_job_title)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Форма для добавления новой должности -->
    <div class="add-job">
      <input v-model="newJobTitle" placeholder="Введите название должности" />
      <button @click="addJobTitle">Добавить должность</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      jobTitles: [],
      newJobTitle: "",
    };
  },
  methods: {
    async loadJobTitles() {
      try {
        const response = await axios.get(
          "http://localhost:2508/api/export-job-titles"
        );
        this.jobTitles = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке должностей:", error);
      }
    },

    async addJobTitle() {
      if (!this.newJobTitle) {
        alert("Введите название должности");
        return;
      }
      try {
        await axios.post("http://localhost:2508/api/jobTitle", {
          name: this.newJobTitle,
        });
        this.newJobTitle = "";
        this.loadJobTitles();
      } catch (error) {
        console.error("Ошибка при добавлении должности:", error);
      }
    },

    async deleteJobTitle(id) {
      try {
        await axios.delete(`http://localhost:2508/api/jobTitle/${id}`);
        this.loadJobTitles();
      } catch (error) {
        console.error("Ошибка при удалении должности:", error);
      }
    },

    async editJobTitle(id) {
      const newName = prompt("Введите новое имя должности");
      if (!newName) return;

      try {
        await axios.put(`http://localhost:2508/api/jobTitle/${id}`, {
          name: newName,
        });
        this.loadJobTitles();
      } catch (error) {
        console.error("Ошибка при редактировании должности:", error);
      }
    },
  },
  created() {
    this.loadJobTitles();
  },
};
</script>

<style scoped>
.job-title {
  font-family: Arial, sans-serif;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
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

.add-job {
  margin-top: 20px;
}

input {
  margin-right: 10px;
  padding: 5px;
}
</style>
