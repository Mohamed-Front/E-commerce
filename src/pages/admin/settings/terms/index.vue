<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import console from 'console';
const toast = useToast()
const router = useRouter()
const products = ref(null)
const elements = ref(null)
const element = ref(null)
const lang = ref([
{name:'English',value:"English"},
  {name:'Arabic',value:"Arabic"},
  {name:'Azerbaijan',value:"Azerbaijan"},
  {name:'Georgia',value:"Georgia"},
  {name:'Russia',value:"Russia"},
  {name:'Turkey',value:"Turkey"},
])
const data_id=ref(Number)
const langSelected = ref('English')
const loading = ref(true)
const user = ref({})
const productDialog = ref(false)
const deleteDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref({})
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const submitted = ref(false)
const deletid=ref(null)
const statuses = ref([
  {label: 'INSTOCK', value: 'instock'},
  {label: 'LOWSTOCK', value: 'lowstock'},
  {label: 'OUTOFSTOCK', value: 'outofstock'},
])
const entred = ref(0)
const term = ref({
  file: '',


})

// const productService = new ProductService();

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {


  axios.get("/api/conditions").then((res) => {
    loading.value = false
    elements.value = res.data.TermsAndCondition

  });


}

onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
  fetchData()

})
const formatCurrency = (value) => {
  return value.toLocaleString('gb-US', {style: 'currency', currency: 'USD'})
}
const koko = () => {
  console.log(langSelected.value)
}

const openNew = () => {
router.push({ name: 'terms-create' })
}

const hideDialog = () => {
  productDialog.value = false
  submitted.value = false
}

const uploadFile = (event) => {

  term.value.file = event.target.files[0];
  console.log(term.value.file)
}
const onSubmit= () =>{
 const body = new FormData();
body.append("file", term.value.file);
body.append("lang", langSelected.value);
  axios.post(`/api/condition/${data_id.value}`, body).then((res) => {

    productDialog.value=!(productDialog.value)
      fetchData()
    toast.add({severity: 'success', summary: 'Successful', detail: 'update data', life: 3000})
  });
}





const edit = (id) => {
  data_id.value=id

  productDialog.value=!(productDialog.value)
  axios.get(`/api/condition/${id}`).then((res) => {
    console.log(res)




  });
}

const confirmDelete = (id) => {
  deleteProductsDialog.value = true
 deletid.value=id
}



const deleteSelectedProducts = () => {
  axios.post(`/api/conditions/${deletid.value}`)
    .then((res) => {

      deleteProductsDialog.value = false
      fetchData()
      toast.add({severity: 'success', summary: 'Successful', detail: 'user deleted', life: 3000})
    })

}

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <va-card class="card">
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="new mr-2" @click="openNew"/>
              <!--              <Button-->
              <!--                label="Delete"-->
              <!--                icon="pi pi-trash"-->
              <!--                class="p-button-danger"-->
              <!--                :disabled="!selectedProducts || !selectedProducts.length"-->
              <!--                @click="confirmDeleteSelected"-->
              <!--              />-->
            </div>
          </template>

          <template #end>
            <!--            <FileUpload-->
            <!--              mode="basic"-->
            <!--              accept="image/*"-->
            <!--              :max-file-size="1000000"-->
            <!--              label="Import"-->
            <!--              choose-label="Import"-->
            <!--              class="mr-2 inline-block"-->
            <!--            />-->


          </template>
        </Toolbar>

        <Toast/>




        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="elements"
          :loading="loading"
          data-key="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          current-page-report-template="Showing {first} to {last} of {totalRecords} products"
          responsive-layout="scroll"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-between md:align-items-center">
              <h5 class="m-0">Manage Terms and Conditions</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" placeholder="Search..."/>
              </span>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
          <Column field="Language" header="Language" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data?.lang }}
            </template>
          </Column>
          <Column field="file" header="File" :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <a class="text-[#5b5bbc]" :href="slotProps.data.media[0]?.original_url" download>{{ slotProps.data.media[0]?.file_name }}</a>
            </template>
          </Column>







          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
              <Button
                icon="pi pi-trash"
                class="delete mt-2"
                @click="confirmDelete(slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '450px' }"
          header="users form"
          :modal="true"
          class="p-fluid"
        >
        <Dropdown v-model="langSelected" editable :options="lang" optionLabel="name" option-value="value"
                    class=" w-full "/>

        <div class="w-full py-4">
          <InputText name="file"  ref="file" @change="uploadFile"   type="file" class="w-full" />
        </div>



          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="onSubmit()"/>
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="user"
            >Are you sure you want to delete <b>{{ user.first_name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteAction"/>
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="product">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts"/>
          </template>
        </Dialog>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
<style scoped>
.p-inputtext .p-component .p-filled{
  color: red !important;
  background-color: red !important;
}
.p-inputtext{
color: rgb(0, 0, 0) !important;
background-color: #e7fbf7 !important;
cursor: pointer !important;
}

</style>
