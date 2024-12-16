<template>
    <div class="users-container">
      <h1>Список пользователей</h1>
  
      <!-- Таблица пользователей -->
      <table v-if="users.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя пользователя</th>
            <th>Пароль</th>
            <th>Права доступа</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id_us">
            <td>{{ user.id_us }}</td>
            <td>
              <input
                v-if="editingUser && editingUser.id_us === user.id_us"
                v-model="editingUser.user_name"
                placeholder="Имя пользователя"
              />
              <span v-else>{{ user.user_name }}</span>
            </td>
            <td>
              <input
                v-if="editingUser && editingUser.id_us === user.id_us"
                v-model="editingUser.password"
                type="password"
                placeholder="Введите новый пароль"
              />
              <span v-else>{{ user.password ? '******' : 'Нет данных' }}</span>
            </td>
            <td>
              <select
                v-if="editingUser && editingUser.id_us === user.id_us"
                v-model="editingUser.root"
              >
                <option v-for="root in roots" :key="root.id_roots" :value="root.id_roots">
                  {{ root.name }}
                </option>
              </select>
              <span v-else>{{ getRootName(user.root) }}</span>
            </td>
            <td>
              <button v-if="!editingUser || editingUser.id_us !== user.id_us" @click="enableEditing(user)">
                Редактировать
              </button>
              <button v-else @click="saveUserChanges">
                Сохранить
              </button>
              <button @click="deleteUser(user.id_us)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Форма для добавления нового пользователя -->
      <div class="add-user">
        <input v-model="newUserName" placeholder="Введите имя пользователя" />
        <input v-model="newPassword" type="password" placeholder="Введите пароль" />
        <select v-model="newRoot">
          <option v-for="root in roots" :key="root.id_roots" :value="root.id_roots">
            {{ root.name }}
          </option>
        </select>
        <button @click="addUser">Добавить пользователя</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        users: [], 
        roots: [], 
        newUserName: "", 
        newPassword: "", 
        newRoot: null, 
        editingUser: null, 
      };
    },
    methods: {
      // Загрузка пользователей
      async loadUsers() {
        try {
          const response = await axios.get("http://localhost:2508/api/keys");
          this.users = response.data.map((user) => ({
            ...user,
            password: typeof user.password === "string" ? user.password : "",
          }));
        } catch (error) {
          console.error("Ошибка при загрузке пользователей:", error);
          alert("Не удалось загрузить пользователей.");
        }
      },
  
      // Загрузка прав доступа
      async loadRoots() {
        try {
          const response = await axios.get("http://localhost:2508/api/roots");
          this.roots = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке прав доступа:", error);
          alert("Не удалось загрузить права доступа.");
        }
      },
  
      // Включить режим редактирования
      enableEditing(user) {
        this.editingUser = {
          ...user,
          password: "", // Очистка поля пароля при редактировании
        };
      },
  
      // Сохранить изменения
      async saveUserChanges() {
        if (!this.editingUser) return;
  
        // Если пароль не введен, сохраняем старый пароль
        const updatedPassword =
          this.editingUser.password.trim() === ""
            ? this.users.find((u) => u.id_us === this.editingUser.id_us).password
            : this.editingUser.password;
  
        // Если какие-либо поля пусты, не отправляем запрос
        if (!this.editingUser.user_name || !updatedPassword || !this.editingUser.root) {
          alert("Заполните все обязательные поля!");
          return;
        }
  
        // Преобразуем root в число
        const updatedRoot = Number(this.editingUser.root);
        // Проверка корректности root
        if (isNaN(updatedRoot)) {
          alert("Некорректные данные для прав доступа.");
          return;
        }
  
        const updatedData = {
          user_name: this.editingUser.user_name.trim(),  // Убираем лишние пробелы
          password: updatedPassword.trim(), // Убираем лишние пробелы
          root: updatedRoot, // Убедимся, что это число
        };
  
        try {
          const response = await axios.put(
            `http://localhost:2508/api/keys/${this.editingUser.id_us}`,
            updatedData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
  
          if (response.status === 200) {
            const index = this.users.findIndex(
              (u) => u.id_us === this.editingUser.id_us
            );
            if (index !== -1) {
              this.users[index] = {
                ...this.editingUser,
                password: updatedPassword, // Обновляем пароль в списке пользователей
              };
            }
            this.editingUser = null; // Выключаем режим редактирования
          } else {
            console.error("Ошибка при сохранении данных", response);
            alert("Ошибка при сохранении данных. Статус: " + response.status);
          }
        } catch (error) {
          console.error("Ошибка при сохранении изменений:", error);
          alert("Не удалось сохранить изменения. Попробуйте снова.");
        }
      },
  
      // Удалить пользователя
      async deleteUser(userId) {
        try {
          const response = await axios.delete(
            `http://localhost:2508/api/keys/${userId}`
          );
          if (response.status === 200) {
            this.users = this.users.filter((user) => user.id_us !== userId);
          } else {
            console.error("Ошибка при удалении пользователя", response);
            alert("Не удалось удалить пользователя.");
          }
        } catch (error) {
          console.error("Ошибка при удалении пользователя:", error);
          alert("Не удалось удалить пользователя.");
        }
      },
  
      // Добавить пользователя
      async addUser() {
        if (!this.newUserName || !this.newPassword || !this.newRoot) {
          alert("Введите все данные пользователя");
          return;
        }
  
        const userData = {
          user_name: this.newUserName.trim(),
          password: this.newPassword.trim(),
          root: Number(this.newRoot), // Преобразуем root в число
        };
  
        if (isNaN(userData.root)) {
          alert("Некорректные данные для прав доступа.");
          return;
        }
  
        try {
          const response = await axios.post("http://localhost:2508/api/keys", userData);
  
          if (response.status === 201) {
            this.newUserName = "";
            this.newPassword = "";
            this.newRoot = null;
            this.loadUsers();
          } else {
            console.error("Ошибка при добавлении пользователя", response);
            alert("Ошибка при добавлении пользователя. Статус: " + response.status);
          }
        } catch (error) {
          console.error("Ошибка при добавлении пользователя:", error);
          alert("Не удалось добавить пользователя.");
        }
      },
  
      // Получить название прав доступа
      getRootName(rootId) {
        const root = this.roots.find((root) => root.id_roots === rootId);
        return root ? root.name : "Неизвестно";
      },
    },
    created() {
      this.loadRoots();
      this.loadUsers();
    },
  };
  </script>
  
  <style scoped>
  .users-container {
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
  
  .add-user {
    margin-top: 20px;
  }
  
  input,
  select {
    margin-right: 10px;
    padding: 5px;
  }
  </style>