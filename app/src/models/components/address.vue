<template>
  <div class="addresses-container">
    <h1>Список адресов</h1>

    <!-- Таблица адресов -->
    <table v-if="addresses.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Регион</th>
          <th>Поселение</th>
          <th>Улица</th>
          <th>Дом</th>
          <th>Корпус</th>
          <th>Квартира</th>
          <th>Работник</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="address in addresses" :key="address.id_address">
          <td>{{ address.id_address }}</td>
          <td>
            <input
              v-if="editingAddress && editingAddress.id_address === address.id_address"
              v-model="editingAddress.region"
              placeholder="Регион"
            />
            <span v-else>{{ address.region }}</span>
          </td>
          <td>
            <input
              v-if="editingAddress && editingAddress.id_address === address.id_address"
              v-model="editingAddress.settlement"
              placeholder="Поселение"
            />
            <span v-else>{{ address.settlement }}</span> 
          </td>
          <td>
            <input
              v-if="editingAddress && editingAddress.id_address === address.id_address"
              v-model="editingAddress.street"
              placeholder="Улица"
            />
            <span v-else>{{ address.street }}</span>
          </td>
          <td>
            <input
              v-if="editingAddress && editingAddress.id_address === address.id_address"
              v-model="editingAddress.house"
              placeholder="Дом"
            />
            <span v-else>{{ address.house }}</span>
          </td>
          <td>
            <input
              v-if="editingAddress && editingAddress.id_address === address.id_address"
              v-model="editingAddress.building"
              placeholder="Корпус"
            />
            <span v-else>{{ address.building }}</span>
          </td>
          <td>
            <input
              v-if="editingAddress && editingAddress.id_address === address.id_address"
              v-model="editingAddress.apartment"
              placeholder="Квартира"
            />
            <span v-else>{{ address.apartment }}</span>
          </td>
          <td>
            <select
              v-if="editingAddress && editingAddress.id_address === address.id_address"
              v-model="editingAddress.worker"
            >
              <option v-for="worker in workers" :key="worker.id_worker" :value="worker.id_worker">
                {{ worker.lastname }} {{ worker.name }}
              </option>
            </select>
            <span v-else>{{ getWorkerName(address.worker) }}</span>
          </td>
          <td>
            <button
              v-if="!editingAddress || editingAddress.id_address !== address.id_address"
              @click="enableEditing(address)"
            >
              Редактировать
            </button>
            <button v-else @click="saveAddressChanges">Сохранить</button>
            <button @click="deleteAddress(address.id_address)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Форма для добавления нового адреса -->
    <div class="add-address">
      <input v-model="newRegion" placeholder="Введите регион" />
      <input v-model="newSettlement" placeholder="Введите поселение" />
      <input v-model="newStreet" placeholder="Введите улицу" />
      <input v-model="newHouse" placeholder="Введите дом" />
      <input v-model="newBuilding" placeholder="Введите корпус" />
      <input v-model="newApartment" placeholder="Введите квартиру" />
      <select v-model="newWorker">
        <option value="" disabled>Выберите работника</option>
        <option v-for="worker in workers" :value="worker.id_worker" :key="worker.id_worker">
          {{ worker.lastname }} {{ worker.name }}
        </option>
      </select>
      <button @click="addAddress">Добавить адрес</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      addresses: [],
      workers: [],
      newRegion: "",
      newSettlement: "", 
      newStreet: "",
      newHouse: "",
      newBuilding: "",
      newApartment: "",
      newWorker: "",
      editingAddress: null,
    };
  },
  methods: {
    async loadAddresses() {
      try {
        const response = await axios.get("http://localhost:2508/api/address");
        if (response.data && Array.isArray(response.data)) {
          this.addresses = response.data;
        } else {
          console.error("Неверный формат данных для адресов:", response.data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке адресов:", error);
        alert("Не удалось загрузить адреса.");
      }
    },

    async loadWorkers() {
      try {
        const response = await axios.get("http://localhost:2508/api/worker");
        if (response.data && Array.isArray(response.data)) {
          this.workers = response.data;
        } else {
          console.error("Неверный формат данных для работников:", response.data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке работников:", error);
        alert("Не удалось загрузить список работников.");
      }
    },
    getWorkerName(workerId) {
      const worker = this.workers.find((worker) => worker.id_worker === workerId);
      return worker ? `${worker.lastname} ${worker.name}` : "Неизвестный работник";
    },
    enableEditing(address) {
      this.editingAddress = { ...address };
    },
    async saveAddressChanges() {
      if (!this.editingAddress) return;

      const { id_address, region, settlement, street, house, building, apartment, worker } = this.editingAddress;

      // Функция для безопасного вызова trim
      const safeTrim = (value) => (typeof value === 'string' ? value.trim() : value?.toString() || '');

      // Проверка на обязательные поля
      if (!safeTrim(region) || !safeTrim(settlement) || !safeTrim(street) || !safeTrim(house) || !worker) {
        alert("Заполните все обязательные поля!");
        return;
      }

      try {
        const response = await axios.put(`http://localhost:2508/api/address/${id_address}`, {
          region: safeTrim(region),
          settlement: safeTrim(settlement),
          street: safeTrim(street),
          house: safeTrim(house),
          building: safeTrim(building),
          apartment: safeTrim(apartment),
          worker,
        });

        if (response.status === 200) {
          const index = this.addresses.findIndex((address) => address.id_address === id_address);
          if (index !== -1) this.addresses[index] = response.data.address;
          this.editingAddress = null;
        } else {
          alert(`Ошибка при сохранении данных: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Ошибка при сохранении адреса:", error.response?.data || error.message);
        alert("Не удалось сохранить изменения. Проверьте корректность введённых данных.");
      }
    },
    async deleteAddress(addressId) {
      try {
        const response = await axios.delete(`http://localhost:2508/api/address/${addressId}`);
        if (response.status === 200) {
          this.addresses = this.addresses.filter((address) => address.id_address !== addressId);
        } else {
          alert("Не удалось удалить адрес.");
        }
      } catch (error) {
        alert("Не удалось удалить адрес.");
      }
    },
    async addAddress() {
      if (!this.newWorker) {
        alert("Выберите работника!");
        return;
      }
      const addressData = {
        region: this.newRegion.trim(),
        settlement: this.newSettlement.trim(), // Используем корректное название
        street: this.newStreet.trim(),
        house: this.newHouse.trim(),
        building: this.newBuilding.trim(),
        apartment: this.newApartment.trim(),
        worker: this.newWorker,
      };
      try {
        const response = await axios.post("http://localhost:2508/api/address", addressData);
        if (response.status === 201) {
          this.addresses.push(response.data.address);
          this.resetFields();
        } else {
          alert("Ошибка при добавлении адреса.");
        }
      } catch (error) {
        alert("Не удалось добавить адрес.");
      }
    },
    resetFields() {
      this.newRegion = "";
      this.newSettlement = ""; // Обновлено название
      this.newStreet = "";
      this.newHouse = "";
      this.newBuilding = "";
      this.newApartment = "";
      this.newWorker = "";
    },
  },
  created() {
    this.loadAddresses();
    this.loadWorkers();
  },
};
</script>

<style scoped>
/* Здесь можно добавить стили для компонента */
.addresses-container {
  margin: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

.add-address {
  margin-top: 20px;
}

.add-address input,
.add-address select,
.add-address button {
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
}

button {
  cursor: pointer;
}
</style>