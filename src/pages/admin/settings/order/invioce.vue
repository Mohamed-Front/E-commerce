<template>
  <div class="w-[50%] m-auto" id="app" ref="document">
   <div class="flex space-x-4 py-8">
    <Button   label="Export" :loading="hide" icon="pi pi-upload" class="new" @click="exportToPDF"/>
    <Button label="print" :loading="hide" icon="pi pi-print" class="new" @click="printDiv"/>


   </div>
    <div ref="divToPrint" class=" min-h-full  m-auto relative" id="element-to-convert">

      <div class="flex">
       <div  class="w-[50%] bg-[#098071] h-[40px]  "></div>
        <div class="w-0 h-0
  border-t-[0px] border-t-transparent
  border-l-[75px] border-l-[#098071]
  border-b-[40px] border-b-transparent">
</div>
      </div>

       <div class="text-3xl grid grid-cols-2 py-[2%]">
        <div><img src="../../../../assets/dark_mursheed.png"></div>
        <div class="text-7xl text-black font-bold">INVOICE </div>
       </div>
       <div class="text-2xl grid grid-cols-2 py-[3%] px-[2%]">
        <div>
          <div class="text-left py-2 font-bold text-black">BILLING TO :</div>
          <div class="text-left  py-2 font-bold text-black">Tourist Name</div>
         </div>
         <div>
          <div class="text-left py-2  flex">
            <p class="text-black px-2">Invoice No : {{all.userType?.id}}</p>

          </div>
          <div class="text-left py-2  flex">
            <p class="text-black px-2">Invoice Date :</p>

            <p>{{ moment(data).format('DD-MM-YYYY') }}</p>
          </div>
         </div>





       </div>
       <div class="w-[99%] px-2 m-auto" v-for="(use,index) in user" >
          <div class="py-2 text-left px-2 flex bg-[#098071] ">
            <p class="text-lg text-white font-bold">DAY </p>
            <P class="text-lg text-white  font-bold px-2">{{ index+1 }}</P>
            <p class="text-lg text-white  font-bold px-4">{{ use.date }} </p>

          </div>
          <div class="flex p-[2%] justify-between">
                    <div class="flex ">
                      <h2 class="text-lg my-auto">city</h2>
                      <p class="my-auto text-[black] text-xl px-1">:</p>
                      <p class="my-auto">{{ use.state }}</p></div>
                    <div class="flex">
                      <h2 class="text-lg">price</h2>
                      <svg width="34px" height="34px" viewBox="0 0 24 24" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <rect width="24" height="24" fill="white"></rect>
                          <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                      </svg>
                      <p class="my-auto">{{ use.price_city }} $</p></div>
                    <div class="flex" v-if="use.routing !=0">
                      <h2 class="text-lg">routing</h2>
                      <svg width="34px" height="34px" viewBox="0 0 24 24" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <rect width="24" height="24" fill="white"></rect>
                          <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                      </svg>
                      <p class="my-auto">{{ use.routing }} $</p></div>
                  </div>



         </div>





       <div class=" w-[95%] m-auto">

            <div class="flex ">
              <h2 class="text-xl">Fees </h2>
              <svg width="54px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <rect width="24" height="24" fill="white"></rect>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <p class="my-auto ">{{ country?.fees }} %</p>
            </div>
            <div class="flex">
              <h2 class="text-xl">Tax </h2>
              <svg width="54px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <rect width="24" height="24" fill="white"></rect>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <p class="my-auto ">{{ country?.tax }} %</p>
            </div>
            <div class="flex">
              <h2 class="text-xl">Total price </h2>
              <svg width="54px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <rect width="24" height="24" fill="white"></rect>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <p class="my-auto ">{{ country?.price }} $</p>
            </div>
            <div class="flex">
              <h2 class="text-xl ">Total cost </h2>
              <svg width="54px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <rect width="24" height="24" fill="white"></rect>
                  <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <p class="my-auto ">{{ cost }} $</p>
            </div>
          </div>
          <div>
          </div>
          <div class=" m-auto w-[95%] pt-[4%]" >
           <div class=" py-3 flex">
            <p class="font-bold text-lg text-black">TOURIST NAME:</p>
            <p class="font-bold text-lg px-3 ">{{ all.userType?.tourist_name }}</p>
           </div>

           <div class=" flex">
            <p class="font-bold text-lg text-black">Vendor NAME:</p>
            <p class="font-bold text-lg px-3">{{ all.userType?.vendor }}</p>
           </div>


          </div>
        <div class="flex   w-[99%] m-auto pt-[5%]">
      <div class="bg-black flex py-2 w-[70%] text-white ">
      <div class="flex text-center m-auto">
        <div class="bg-[#098071] rounded-full m-auto mx-1"> <svg class="my-auto" width="24px" height="24px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.5 16.5H19.5M5.5 8.5H19.5M4.5 12.5H20.5M12.5 20.5C12.5 20.5 8 18.5 8 12.5C8 6.5 12.5 4.5 12.5 4.5M12.5 4.5C12.5 4.5 17 6.5 17 12.5C17 18.5 12.5 20.5 12.5 20.5M12.5 4.5V20.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z" stroke="#eceff3" stroke-width="1.2"></path> </g></svg></div>
        <p class="text-left m-auto"><a class="text-left m-auto text-lg" href="invioce@mursheed.com">{{ setting.email }}</a></p>
      </div>
      <div class="flex text-center m-auto">
        <div class="bg-[#098071] rounded-full m-auto mx-1 p-1"><svg class="m-auto" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.11596 12.7268L8.15456 9.08666C8.46255 8.69067 8.61655 8.49267 8.69726 8.27061C8.76867 8.07411 8.79821 7.86486 8.784 7.65628C8.76793 7.42055 8.67477 7.18766 8.48846 6.72187L7.77776 4.94513C7.50204 4.25581 7.36417 3.91116 7.12635 3.68525C6.91678 3.48618 6.65417 3.3519 6.37009 3.29856C6.0477 3.23803 5.68758 3.32806 4.96733 3.50812L3 4.00002C3 14 9.99969 21 20 21L20.4916 19.0324C20.6717 18.3122 20.7617 17.952 20.7012 17.6297C20.6478 17.3456 20.5136 17.083 20.3145 16.8734C20.0886 16.6356 19.7439 16.4977 19.0546 16.222L17.4691 15.5878C16.9377 15.3752 16.672 15.2689 16.4071 15.2608C16.1729 15.2536 15.9404 15.3013 15.728 15.4002C15.4877 15.512 15.2854 15.7144 14.8807 16.1191L11.7943 19.1569" stroke="#e6dbdb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></div>
        <p class="text-left m-auto">{{ setting.phone_number }}</p>
      </div>
      </div>
      <div class="bg-[#098071] py-3 w-[30%] text-white"></div>
    </div>
    </div>

  </div>
</template>


<script setup>
import {useToast} from 'primevue/usetoast'
import moment from 'moment'
import { ref, onMounted } from 'vue'
import html2pdf from "html2pdf.js";
import axios from "axios";
const divToPrint = ref(null);
import {useRoute} from "vue-router";
const cost=ref('')
const route = useRoute();
const user = ref({})
const setting =ref({})
const all = ref({})
const country =ref('')
const data =ref('')
const hide =ref(true)
const printDiv = () => {
      const printContent = divToPrint.value;

      if (printContent) {
        const originalContents = document.body.innerHTML;
        const newContents = printContent.innerHTML;

        document.body.innerHTML = newContents;

        window.print();

        document.body.innerHTML = originalContents;
      } else {
        console.error("Element with ref 'divToPrint' not found");
      }
    };

const exportToPDF = () => {
  html2pdf(document.getElementById("element-to-convert"), {
				margin: 1,
  			filename: "i-was-html.pdf",
			});
}
onMounted(() => {
  axios.get(`/api/orders/${route.params.id}`).then((res) => {
    data.value=res.data.start_date
    user.value = res.data.order
    country.value = res.data.country_price
    all.value=res.data
    cost.value = res.data.total_cost
    console.log(cost.value)
  });
  axios.get(`/api/settings`).then((res) => {
    setting.value=res.data.setting
    hide.value=false
  });

})











</script>

<style>
#app {
  margin-top: 60px;
  text-align: center;
}
</style>
