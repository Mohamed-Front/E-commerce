<script setup>
import { ref, onMounted } from 'vue'
import axios from "axios";

const permissionsData = ref({});
const groupedPermissions = ref([]);
const loading = ref(true);
const activeTab = ref(0);
const visibleDialog = ref(false);
const currentPermission = ref({
  id: '',
  name: '',
  description: ''
});

// Group permissions by their module
const groupPermissions = (data) => {
  const groups = [];

  for (const [module, permissions] of Object.entries(data)) {
    groups.push({
      name: module.charAt(0).toUpperCase() + module.slice(1),
      value: module,
      permissions: permissions
    });
  }

  // Sort groups alphabetically
  groups.sort((a, b) => a.name.localeCompare(b.name));

  return groups;
};

const fetchData = () => {
  loading.value = true;
  axios.get("api/role/get/permissions").then((res) => {
    permissionsData.value = res.data.data;
    groupedPermissions.value = groupPermissions(res.data.data);
    loading.value = false;
  }).catch(error => {
    console.error("Error fetching permissions:", error);
    loading.value = false;
  });
};

const openEditDialog = (permission) => {
  visibleDialog.value = true;
  currentPermission.value = {
    id: permission.id,
    name: permission.name,
    description: permission.description || ''
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
  <div v-can="'list permissions'" class="permissions-container">
    <div class="card">
    <div class="flex justify-between">
        <div class="header">
        <h1>{{ $t('permissions_management.title') }}</h1>
        <p class="subtitle">{{ $t('permissions_management.subtitle') }}</p>
      </div>

      <div class="toolbar">
        <Button icon="pi pi-refresh" :label="$t('permissions_management.refresh_button')" @click="fetchData" :loading="loading" />
      </div>
    </div>

      <TabView v-model:activeIndex="activeTab" class="grouped-tabs">
        <TabPanel v-for="group in groupedPermissions" :key="group.value" :header="group.name">
          <DataTable :value="group.permissions" stripedRows class="p-datatable-sm"
                    :loading="loading" dataKey="id" scrollable scrollHeight="flex">
            <Column field="id" :header="$t('permissions_management.table.id')" sortable style="width: 80px"></Column>
            <Column field="name" :header="$t('permissions_management.table.name')" sortable>
              <template #body="{data}">
                <Tag :value="data.name"
                     :severity="data.name.includes('delete') ? 'danger' :
                               data.name.includes('edit') ? 'warning' :
                               data.name.includes('create') ? 'success' : 'info'" />
              </template>
            </Column>
            <Column field="description" :header="$t('permissions_management.table.description')">
              <template #body="{data}">
                <div class="description-cell">
                  {{ data.description || $t('permissions_management.table.no_permissions') }}
                  <Button v-can="'edit permissions'" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"
                          @click="openEditDialog(data)" />
                </div>
              </template>
            </Column>
            <Column :header="$t('permissions_management.table.actions')" style="width: 100px">
              <template #body="{data}">
                <Button icon="pi pi-cog" class="p-button-rounded p-button-text p-button-sm"
                        @click="openEditDialog(data)" />
              </template>
            </Column>
            <template #empty>
              <div class="empty-message">
                <i class="pi pi-database" style="font-size: 2rem"></i>
                <p>{{ $t('permissions_management.table.no_permissions') }}</p>
              </div>
            </template>
          </DataTable>
        </TabPanel>
      </TabView>

      <!-- Update Description Dialog -->
      <Dialog v-model:visible="visibleDialog" modal :header="$t('permissions_management.dialog.header')"
              :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '640px': '90vw' }">
        <div class="p-fluid">
          <div class="p-field">
            <label for="permissionName">{{ $t('permissions_management.dialog.permission_name_label') }}</label>
            <InputText id="permissionName" v-model="currentPermission.name" disabled />
          </div>
          <div class="p-field">
            <label for="description">{{ $t('permissions_management.dialog.description_label') }}</label>
            <Textarea id="description" v-model="currentPermission.description"
                     rows="5" autoResize :placeholder="$t('permissions_management.dialog.description_placeholder')" />
          </div>
        </div>
        <template #footer>
          <Button :label="$t('permissions_management.dialog.cancel_button')" icon="pi pi-times" @click="visibleDialog = false"
                  class="p-button-text" />
          <Button :label="$t('permissions_management.dialog.save_button')" icon="pi pi-check" @click="updateDescription"
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  margin-bottom: 1rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 0;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.description-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #7f8c8d;
}

:deep(.grouped-tabs .p-tabview-nav) {
  flex-wrap: wrap;
}

:deep(.grouped-tabs .p-tabview-nav-link) {
  padding: 0.75rem 1.25rem;
}

:deep(.grouped-tabs .p-tabview-panels) {
  padding: 1rem 0;
}

:deep(.p-tag) {
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
}

.p-field {
  margin-bottom: 1.5rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .permissions-container {
    padding: 1rem;
  }

  .card {
    padding: 1rem;
  }

  :deep(.grouped-tabs .p-tabview-nav-link) {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>
