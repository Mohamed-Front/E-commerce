
<template>

  <va-card class="card">
    <div class=" flex justify-center">
      <form @submit.prevent="onSubmit" class="flex flex-col  w-3/4 py-9">
        <h2 class="pb-4 text-center va-text-bold">
          Upload file
          <Dropdown v-model="langSelected" editable :options="lang" optionLabel="name" option-value="value"
                    class=" w-36 mx-3 mx-10"/>

        </h2>

        <div class="w-full py-4">
          <InputText name="file"  ref="file" @change="uploadFile"   type="file" class="w-full" />
        </div>


        <Button type="submit" label="submit" multiple="true" class="mt-3"/>
      </form>

    </div>
    <Toast/>
  </va-card>
</template>

<script setup>
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {ref, watch} from "vue";


import vueFilePond from "vue-filepond";

// Import FilePond styles


// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

const toast = useToast()

const term = ref({
  file: '',


})


const entred = ref(0)
const file = ref('')
const url = ref('')
const urlurl = ref('')
const dataEntred = ref({})
const error = ref('')

const totalSize = ref(0);
const myFiles = ref([]);
const totalSizePercent = ref(0);
const files = ref([]);

const pond = ref(null)

const lang = ref([
  {name:'English',value:"English"},
  {name:'Arabic',value:"Arabic"},
  {name:'Azerbaijan',value:"Azerbaijan"},
  {name:'Georgia',value:"Georgia"},
  {name:'Russia',value:"Russia"},
  {name:'Turkey',value:"Turkey"},
])


const langSelected = ref('English')





const onSubmit = () => {
  // console.log(pond.value.getFiles())
  // console.log(myFiles.value)
  //
  // console.log(files.value)


  const body = new FormData();


  body.append("file", term.value.file);
  body.append("lang", langSelected.value);


  if (!entred.value) {
    console.log("wefew")




    axios.post('/api/conditions', body).then((res) => {
      error.value=[]
      entred.value = 1

      toast.add({severity: 'success', summary: 'Successful', detail: 'terms Created', life: 3000})

    }).catch((el)=>{
      error.value = el.response.data.errors

      console.log(error.value)

    })



  } else {
    axios.defaults.headers.common['local'] = langSelected.value

    axios.post(`/api/conditions`, body).then((res) => {
      error.value=[]


      toast.add({severity: 'success', summary: 'Successful', detail: 'terms create', life: 3000})

    }).catch((el)=>{
      error.value = el.response.data.errors

      console.log(error.value)

    })

  }

}
const uploadFile = (event) => {
  console.log("dasdasd")
  term.value.file = event.target.files[0];
};


watch(langSelected, async (newValue, oldQuestion) => {
  console.log(dataEntred.value)
  if (entred.value) {

    term.value.files = dataEntred.value?.files[newValue] == undefined ? '':dataEntred.value?.files[newValue];

  }
})


const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
  console.log(files.value)
};

const uploadEvent = (callback) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const onTemplatedUpload = () => {
  toast.add({severity: "info", summary: "Success", detail: "File Uploaded", life: 3000});
};


function imageUrl(file) {
  console.log(file)
  return URL.createObjectURL(file)
}

const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

</script>

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
