<template>
   <div class="grid">
    <div class="col-12 h-full ">
      <va-card class="card m-auto">

        <Toast/>
          <div class="lg:w-[80%] w-[95%] mx-auto py-8" >
            <div><h2 class="text-2xl font-bold py-5">Reminding Users</h2></div>
            <div class="card w-full mx-auto py-4">
              <p class="text-xl font-bold">Subject</p>
              <InputText v-model="user.subject" type="text" class="w-full py-4 "  />
              <div class="mt-1 mb-1 text-red-500" v-if="error?.subject">{{ error.subject[0] }}</div>
            </div>
            <div class="card w-full mx-auto py-4">
              <p class="text-xl font-bold">User Type</p>
              <div class="card flex justify-content-center">
                 <Dropdown v-model="user.type" :options="types"     option-value="code" optionLabel="name" placeholder="user type" class="w-full py-1 " />
              </div>
              <div class="mt-1 mb-1 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
            </div>
            <div class="card w-full mx-auto py-4">
              <p class="text-xl font-bold">Content</p>

              <Editor v-model="user.body"  editorStyle="height: 150px"  class="my-2"/>
              <div class="mt-1 mb-1 text-red-500" v-if="error?.body">{{ error.body[0] }}</div>
            </div>
             <div class="card w-full mx-auto py-4">
              <p class="text-xl font-bold">Attachment</p>

               <div class="w-full py-4">
          <InputText name="file"  ref="file" @change="uploadFile"  :maxFileSize="1" type="file" class="w-full" />
        </div>

            </div>


            <div class="w-full text-center">  <Button @click="Reminding()"  label="Send" class="mt-3 mx-auto lg:w-[10%]" /></div>
          </div>
          <Dialog v-model:visible="visible" modal header="Limitation" :style="{ width: '20rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p>
              The file must be less than 100 MB
            </p>
        </Dialog>
        <Dialog v-model:visible="deleteDialog" class="w-[90%] lg:w-[50%]" header="Select users" :modal="true">
           <div class="card flex justify-content-center">
              <MultiSelect v-model="user.selected" option-value="id" filter  :options="cities"  optionLabel="name" placeholder="Select users"
               class="w-full md:w-20rem" />
           </div>

        </Dialog>
      </va-card>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import axios from 'axios'
import Editor from 'primevue/editor';
import {useToast} from 'primevue/usetoast'
const toast = useToast()
const cities = ref([]);
const deleteDialog =ref(false)

const visible =ref(false)

const user= ref({
  body:'',
  subject:[],
  type:'',
  selected:[],
  attachment:''
})




 const error = ref('')

const selectedCity = ref();
const types = ref([
    { name: 'tourist', code: '2' },
    { name: 'drivers', code: '0' },
    { name: 'guides', code: '1' },


]);
watch(() => user.value.type, (newValue, oldValue) => {
  if(newValue == 0){
      user.value.selected=''
    deleteDialog.value=!(deleteDialog.value)
    axios.get('/api/drivers').then((res) => {
      cities.value=res.data.drivers
})
  }
  if(newValue == 1){
    user.value.selected=''
    deleteDialog.value=!(deleteDialog.value)
    axios.get('/api/guides').then((res) => {
      cities.value=res.data.guides
})
  }

      // Do something when the attribute changes
    });

const uploadFile = (event) => {
  console.log(event.target.files[0].size)
  if(event.target.files[0].size /1000 < 100){
    user.value.attachment = event.target.files[0];
  }else{
    visible.value=true
  }

console.log(user.value.attachment)
};
const Reminding =()=>{

 const body = new FormData();


  body.append("body",user.value.body);
  if(user.value.selected != ''){
  body.append("selected",user.value.selected);
  }
  body.append("subject",user.value.subject);
  body.append("type",user.value.type);

  if(user.value.attachment){
    body.append("attachment",user.value.attachment);
  }
  axios
    .post('/api/reminderEmail',body )
    .then((res) => {
       console.log("asdasda")
      toast.add({severity: 'success', summary: 'Successful', detail: ' Created  Successful', life: 3000})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
</script>
<style >
.ql-image{
  visibility: hidden !important;
}

</style>
