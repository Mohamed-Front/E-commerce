<script setup>
import { ref, onMounted } from 'vue'
import axios from "axios";

const permissionsData = ref({});
const loading = ref(true);
const activeTab = ref(0);
const visibleDialog = ref(false);
const currentPermission = ref({
  id: '',
  name: '',
  description: ''
});

const fetchData = () => {
  axios.get("api/role/get/permissions").then((res) => {
    permissionsData.value = res.data.data;
    loading.value = false;
  });
};

const openEditDialog = (permission) => {
  visibleDialog.value = true;
  console.log(permission)
  currentPermission.value = {
    id: permission?.id,
    name: permission?.name,
    description: permission?.description || ''
  };

};

const updateDescription = () => {
  loading.value = true;
  axios.put(`/api/role/permission/${currentPermission.value.id}`, {
    description: currentPermission.value.description
  })
  .then(() => {
    fetchData();
    visibleDialog.value = false;
    // Show success toast
  })
  .catch(error => {
    console.error("Update failed:", error);
    // Show error toast
  })
  .finally(() => {
    loading.value = false;
  });
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="permissions-container">
    <div class="card">
      <h1>Permissions Management</h1>
      <p class="subtitle">View and manage all system permissions</p>

      <TabView v-model:activeIndex="activeTab">
        <!-- Permissions Tab -->
        <TabPanel header="Permissions">
          <DataTable :value="permissionsData.permissions" stripedRows class="p-datatable-sm"
                     :loading="loading" dataKey="id">
            <Column field="id" header="ID" sortable></Column>
            <Column field="name" header="Name" sortable>
              <template #body="{data}">
                <Tag :value="data.name" severity="info" />
              </template>
            </Column>
            <Column field="description" header="Description">
              <template #body="{data}">
                <div class="description-cell">
                  {{ data.description || 'No description' }}
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"
                          @click="openEditDialog(data)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <!-- Users Permissions Tab -->
        <TabPanel header="User Permissions">
          <DataTable :value="permissionsData.users" stripedRows class="p-datatable-sm"
                     :loading="loading" dataKey="id">
            <Column field="id" header="ID" sortable></Column>
            <Column field="name" header="Name" sortable>
              <template #body="{data}">
                <Tag :value="data.name" :severity="data.name.includes('delete') ? 'danger' :
                     data.name.includes('edit') ? 'warning' : 'success'" />
              </template>
            </Column>
            <Column field="description" header="Description">
              <template #body="{data}">
                <div class="description-cell">
                  {{ data.description || 'No description' }}
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"
                          @click="openEditDialog(data)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <!-- Roles Permissions Tab -->
        <TabPanel header="Role Permissions">
          <DataTable :value="permissionsData.roles" stripedRows class="p-datatable-sm"
                     :loading="loading" dataKey="id">
            <Column field="id" header="ID" sortable></Column>
            <Column field="name" header="Name" sortable>
              <template #body="{data}">
                <Tag :value="data.name" :severity="data.name.includes('delete') ? 'danger' :
                     data.name.includes('edit') ? 'warning' : 'info'" />
              </template>
            </Column>
            <Column field="description" header="Description">
              <template #body="{data}">
                <div class="description-cell">
                  {{ data.description || 'No description' }}
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"
                          @click="openEditDialog(data)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabView>

      <!-- Update Description Dialog -->
      <Dialog v-model:visible="visibleDialog" modal header="Update Description"
              :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '640px': '90vw' }">
        <div class="p-fluid">
          <div class="p-field">
            <label for="permissionName">Permission Name</label>
            <InputText id="permissionName" v-model="currentPermission.name" disabled />
          </div>
          <div class="p-field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="currentPermission.description" rows="5" autoResize />
          </div>
        </div>
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" @click="visibleDialog = false"
                  class="p-button-text" />
          <Button label="Save" icon="pi pi-check" @click="updateDescription"
                  :loading="loading" autofocus />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
.permissions-container {
  padding: 2rem;
}

.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.stats-container {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.stat-card {
  flex: 1;
  text-align: center;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h2 {
  color: #3498db;
  margin: 0.5rem 0 0;
}

.description-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

:deep(.p-tabview-nav) {
  border-bottom: 2px solid #e9ecef;
}

:deep(.p-tabview-nav-link) {
  padding: 1rem 1.5rem;
}

:deep(.p-tag) {
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
}

.p-field {
  margin-bottom: 1.5rem;
}
</style>
