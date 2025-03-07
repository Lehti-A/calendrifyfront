<template>
  <div class="content">
    <CalendarModal :modal-is-open="modalIsOpen"
                @event-close-modal="closeCalendarModal"
                @event-update-nav-menu="$emit('event-update-nav-menu')"
    />

    <div class="row justify-content-center mt-3">
      <div class="col-md-8 d-flex flex-column align-items-center justify-content-center text-center"> </div>
        <h2 class="fw-bold">CALENDAR</h2>
      <div class="col text-center">
        {{ quote }}
      </div>
    </div>
      <button type="button" class="btn btn-secondary mx-3" style="width: 7%;" @click="fetchData">New Quote</button>
      <button type="button" class="btn btn-secondary" style="width: 7%;" @click="">Search day</button>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle mt-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Month
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle mt-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Year
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
        <div class="row justify-content-center mt-1">
      <div class="col" style="width: 800px;" > Personal Focus
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Meditate 30min
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
              <label class="form-check-label" for="flexCheckDefault"> Done </label>
            </div>
            <button class="btn btn-sm btn-outline-danger" @click="removeTask('personal', index)">🗑️</button>
          </li>
        </ul>
        <button class="btn btn-outline-primary mt-2" @click="openCalendarModal('personal')">➕</button>
      </div>
      <div class="col-4" style="width: 800px;" > Work Focus
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Do Calendar Front
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
              <label class="form-check-label" for="flexCheckDefault"> Done </label>
            </div>
            <button class="btn btn-sm btn-outline-danger" @click="removeTask('personal', index)">🗑️</button>
          </li>
        </ul>
        <button class="btn btn-outline-primary mt-2" @click="openCalendarModal('personal')">➕</button>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import LoginModal from "@/components/modal/LoginModal.vue";
import CalendarModal from "@/components/modal/CalendarModal.vue";

export default {
  name: "CalendarView",
  components: {CalendarModal, LoginModal},

  data() {
    return {
      modalIsOpen: false,
      quote: "" //,
    };
  },

  methods: {
    async fetchData() {
      const API_KEY = "LEYV9brNOkL8XXrRckzhbQ==0eV9fA97U9SIpoyC";
      try {
        const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": API_KEY
          }
        });
        this.quote = response.data[0]?.quote || "No quote available";
      } catch (error) {
        console.error("Error fetching data:", error);
        this.quote = "Failed to load quote.";
      }
    },
    openCalendarModal() {
      this.modalIsOpen = true
    },
    closeCalendarModal() {
      this.modalIsOpen = false
    }
  }
}
</script>


