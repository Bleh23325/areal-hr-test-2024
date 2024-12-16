<template>
    <div class="history-container">
      <h1>История изменений</h1>
  
      <!-- Таблица истории изменений -->
      <table v-if="histories.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата и время операции</th>
            <th>Кто изменил</th>
            <th>Объект операции</th>
            <th>Изменённые поля</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in histories" :key="history.id_histori_of_changes">
            <td>{{ history.id_histori_of_changes }}</td>
            <td>
              <input
                v-if="editingHistory && editingHistory.id_histori_of_changes === history.id_histori_of_changes"
                v-model="editingHistory.date_and_time_of_operation"
                type="date"
              />
              <span v-else>{{ history.date_and_time_of_operation }}</span>
            </td>
            <td>
              <input
                v-if="editingHistory && editingHistory.id_histori_of_changes === history.id_histori_of_changes"
                v-model="editingHistory.who_change"
                placeholder="Кто изменил"
              />
              <span v-else>{{ history.who_change }}</span>
            </td>
            <td>
              <input
                v-if="editingHistory && editingHistory.id_histori_of_changes === history.id_histori_of_changes"
                v-model="editingHistory.object_of_change"
                placeholder="Объект операции"
              />
              <span v-else>{{ history.object_of_change }}</span>
            </td>
            <td>
              <input
                v-if="editingHistory && editingHistory.id_histori_of_changes === history.id_histori_of_changes"
                v-model="editingHistory.modified_fields"
                placeholder="Изменённые поля"
              />
              <span v-else>{{ history.modified_fields }}</span>
            </td>
            <td>
              <button
                v-if="!editingHistory || editingHistory.id_histori_of_changes !== history.id_histori_of_changes"
                @click="enableEditing(history)"
              >
                Редактировать
              </button>
              <button v-else @click="saveHistoryChanges">Сохранить</button>
              <button @click="deleteHistory(history.id_histori_of_changes)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Форма для добавления новой записи -->
      <div class="add-history">
        <input v-model="newDate" type="date" placeholder="Дата и время операции" />
        <input v-model="newWhoChange" placeholder="Кто изменил" />
        <input v-model="newObject" placeholder="Объект операции" />
        <input v-model="newModifiedFields" placeholder="Изменённые поля" />
        <button @click="addHistory">Добавить запись</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        histories: [], // Список истории изменений
        newDate: "", // Новая дата операции
        newWhoChange: "", // Кто изменил
        newObject: "", // Новый объект операции
        newModifiedFields: "", // Новые изменённые поля
        editingHistory: null, // Данные для редактирования
      };
    },
    methods: {
      // Загрузка истории изменений
      async loadHistories() {
        try {
          const response = await axios.get("http://localhost:2508/api/historiOfChanges");
          this.histories = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке истории изменений:", error);
          alert("Не удалось загрузить данные.");
        }
      },
  
      // Включить режим редактирования
      enableEditing(history) {
        this.editingHistory = { ...history };
      },
  
      // Сохранить изменения
      async saveHistoryChanges() {
        if (!this.editingHistory) return;
  
        const updatedData = {
          date_and_time_of_operation: this.editingHistory.date_and_time_of_operation,
          who_change: this.editingHistory.who_change,
          object_of_change: this.editingHistory.object_of_change,
          modified_fields: this.editingHistory.modified_fields,
        };
  
        try {
          const response = await axios.put(
            `http://localhost:2508/api/historiOfChanges/${this.editingHistory.id_histori_of_changes}`,
            updatedData,
            { headers: { "Content-Type": "application/json" } }
          );
  
          if (response.status === 200) {
            this.histories = this.histories.map((h) =>
              h.id_histori_of_changes === this.editingHistory.id_histori_of_changes
                ? { ...this.editingHistory }
                : h
            );
            this.editingHistory = null;
          } else {
            console.error("Ошибка при сохранении данных", response);
            alert("Ошибка при сохранении данных.");
          }
        } catch (error) {
          console.error("Ошибка при сохранении изменений:", error);
          alert("Не удалось сохранить изменения.");
        }
      },
  
      // Удалить запись
      async deleteHistory(id) {
        try {
          const response = await axios.delete(`http://localhost:2508/api/historiOfChanges/${id}`);
          if (response.status === 200) {
            this.histories = this.histories.filter((h) => h.id_histori_of_changes !== id);
          } else {
            console.error("Ошибка при удалении записи", response);
            alert("Не удалось удалить запись.");
          }
        } catch (error) {
          console.error("Ошибка при удалении записи:", error);
          alert("Не удалось удалить запись.");
        }
      },
  
      // Добавить новую запись
      async addHistory() {
        if (!this.newDate || !this.newWhoChange || !this.newObject || !this.newModifiedFields) {
          alert("Заполните все поля.");
          return;
        }
  
        const newHistory = {
          date_and_time_of_operation: this.newDate,
          who_change: this.newWhoChange,
          object_of_change: this.newObject,
          modified_fields: this.newModifiedFields,
        };
  
        try {
          const response = await axios.post("http://localhost:2508/api/historiOfChanges", newHistory);
          if (response.status === 201) {
            this.newDate = "";
            this.newWhoChange = "";
            this.newObject = "";
            this.newModifiedFields = "";
            this.loadHistories();
          } else {
            console.error("Ошибка при добавлении записи", response);
            alert("Ошибка при добавлении записи.");
          }
        } catch (error) {
          console.error("Ошибка при добавлении записи:", error);
          alert("Не удалось добавить запись.");
        }
      },
    },
    created() {
      this.loadHistories();
    },
  };
  </script>
  
  <style scoped>
  .history-container {
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
  
  .add-history {
    margin-top: 20px;
  }
  
  input {
    margin-right: 10px;
    padding: 5px;
  }
  </style>
  