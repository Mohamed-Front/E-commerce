<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from "axios";
import {useRouter} from "vue-router";
const router = useRouter()
const route = useRoute()
const permissionsData = ref({});
const roleData = ref(null);
const loading = ref(true);
const selectedPermissions = ref([]);
const roleName = ref('');
const showDescriptionModal = ref(false);
const currentDescription = ref('');
const tableView = ref(false);
const isEditing = computed(() => route.params.id);

const fetchPermissions = () => {
  axios.get("api/role/get/permissions").then((res) => {
    permissionsData.value = res.data.data;
    if (isEditing.value) {
      fetchRoleData();
    } else {
      loading.value = false;
    }
  });
};

const fetchRoleData = () => {
  axios.get(`api/role/${route.params.id}`).then((res) => {
    roleData.value = res.data.data;
    roleName.value = roleData.value.name;
    selectedPermissions.value = roleData.value.permissions.map(p => p.id);
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

const toggleGroup = (groupName, event) => {
  const groupItems = permissionsData.value[groupName] || [];
  const groupIds = groupItems.map(item => item.id);

  if (event.target.checked) {
    selectedPermissions.value = [
      ...new Set([...selectedPermissions.value, ...groupIds])
    ];
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(
      id => !groupIds.includes(id)
    );
  }
};

const isGroupSelected = (groupName) => {
  const groupItems = permissionsData.value[groupName] || [];
  if (groupItems.length === 0) return false;
  return groupItems.every(item => selectedPermissions.value.includes(item.id));
};

const isGroupIndeterminate = (groupName) => {
  const groupItems = permissionsData.value[groupName] || [];
  if (groupItems.length === 0) return false;

  const hasSome = groupItems.some(item => selectedPermissions.value.includes(item.id));
  const hasAll = groupItems.every(item => selectedPermissions.value.includes(item.id));

  return hasSome && !hasAll;
};

const showDescription = (description) => {
  currentDescription.value = description || 'No description available';
  showDescriptionModal.value = true;
};

const submitForm = () => {
  if (!roleName.value) {
    alert('Please enter a role name');
    return;
  }

  const payload = {
    name: roleName.value,
    permissions: selectedPermissions.value
  };

  axios.put(`/api/role/${route.params.id}`, payload)
    .then(response => {
      router.push({name:'roles'})
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

onMounted(() => {
  fetchPermissions();
});
</script>

<template>
  <div v-can="'edit roles'" class="permission-manager">
    <h1>{{ isEditing ? $t('permissions.edit') : $t('permissions.create') }}</h1>

    <div class="controls">
      <div class="name-input">
        <label for="roleName">
         {{$t("role.role_Name")}} <span class="required">*</span>
        </label>
        <input
          type="text"
          id="roleName"
          v-model="roleName"
          :placeholder='$t("role.enter_role_name")'
          required
        />
      </div>

      <button
        @click="tableView = !tableView"
        class="view-toggle"
      >
        {{ tableView ? 'Switch to Card View' : 'Switch to Table View' }}
      </button>
    </div>

    <div v-if="loading" class="loading">
  {{ isEditing ? $t('loading.roleData') : $t('loading.permissions') }}
</div>    <template v-else>
      <!-- Table View -->
      <div v-if="tableView" class="table-view">
        <table>
          <thead>
            <tr>
              <th>Group</th>
              <th>Permission</th>
              <th>Description</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(group, groupName) in permissionsData" :key="groupName">
              <tr v-for="permission in group" :key="permission.id">
                <td v-if="group.indexOf(permission) === 0" :rowspan="group.length">
                  <input
                    type="checkbox"
                    :id="`group-${groupName}-table`"
                    :checked="isGroupSelected(groupName)"
                    :indeterminate.prop="isGroupIndeterminate(groupName)"
                    @change="toggleGroup(groupName, $event)"
                  />
                  <label :for="`group-${groupName}-table`">
                    {{ groupName.charAt(0).toUpperCase() + groupName.slice(1) }}
                  </label>
                </td>
                <td>{{ permission.name }}</td>
                <td>
                  <button
                    @click="showDescription(permission.description)"
                    class="description-btn"
                    :disabled="!permission.description"
                  >
                    {{ permission.description ? 'View' : 'None' }}
                  </button>
                </td>
                <td>
                  <input
                    type="checkbox"
                    :id="`permission-${permission.id}-table`"
                    :value="permission.id"
                    v-model="selectedPermissions"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Card View -->
      <div v-else class="card-view">
        <div class="permission-groups">
          <div v-for="(group, groupName) in permissionsData" :key="groupName" class="permission-group">
            <div class="group-header">
              <input
              class="mx-2 my-auto"
                type="checkbox"
                :id="`group-${groupName}`"
                :checked="isGroupSelected(groupName)"
                :indeterminate.prop="isGroupIndeterminate(groupName)"
                @change="toggleGroup(groupName, $event)"
              />
              <label :for="`group-${groupName}`">
                {{ groupName.charAt(0).toUpperCase() + groupName.slice(1) }}
              </label>
            </div>

            <div class="permission-items">
              <div v-for="permission in group" :key="permission.id" class="permission-item">
                <div class="permission-info">
                  <input
                    type="checkbox"
                    :id="`permission-${permission.id}`"
                    :value="permission.id"
                    v-model="selectedPermissions"
                  />
                  <label :for="`permission-${permission.id}`">
                    {{ permission.name }}
                  </label>
                </div>
                <button
                  @click="showDescription(permission.description)"
                  class="description-btn"
                  :disabled="!permission.description"
                >
                  {{ permission.description ? 'View Description' : 'No Description' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>


    <button
      @click="submitForm"
      class="submit-btn"
      :disabled="selectedPermissions.length === 0 || !roleName"
    >
    {{ isEditing ? $t('role.updateWithPermissions') : $t('role.createWithPermissions') }}
  </button>

    <!-- Description Modal -->
    <div v-if="showDescriptionModal" class="modal-overlay" @click.self="showDescriptionModal = false">
      <div class="modal-content">
        <h3>Permission Description</h3>
        <p>{{ currentDescription }}</p>
        <button @click="showDescriptionModal = false" class="close-modal">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* (Keep all the same styles from previous implementation) */
.permission-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.name-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name-input label {
  font-weight: bold;
  margin-bottom: 4px;
}

.required {
  color: #f44336;
}

.name-input input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 250px;
  font-size: 1em;
}

.view-toggle {
  padding: 8px 16px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-toggle:hover {
  background-color: #3a5a8c;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.2em;
}

/* Table View Styles */
.table-view {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}

/* Card View Styles */
.permission-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.permission-group {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.group-header {
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  font-size: 1.1em;
}

.group-header input {
  margin-right: 10px;
  transform: scale(1.2);
}

.permission-items {
  margin-left: 10px;
}

.permission-item {
  margin: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.permission-item:hover {
  background-color: #f5f5f5;
}

.permission-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.permission-info input {
  transform: scale(1.1);
}

.description-btn {
  padding: 4px 8px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
}

.description-btn:hover:not(:disabled) {
  background-color: #d0d0d0;
}

.description-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* Selection Summary */
.selection-summary {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.selection-summary h3 {
  margin-top: 0;
  color: #333;
}

.id-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.id-chip {
  background-color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

/* Submit Button */
.submit-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.close-modal {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-modal:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .permission-groups {
    grid-template-columns: 1fr;
  }

  .name-input input {
    min-width: 100%;
  }
}
</style>
