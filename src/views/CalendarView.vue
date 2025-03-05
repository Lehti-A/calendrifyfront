<template>
  <div class="content">
    <input type="date" name="" id="">
    <div class="row justify-content-center mt-1">
      <div class="col-md-8 d-flex flex-column align-items-center justify-content-center text-center">
        <h2 class="fw-bold">CALENDAR</h2>
      </div>
    </div>

    <div class="row justify-content-center mt-1" style="max-width: 800px; margin: 0 auto;">
      <div class="col text-center">
        {{ quote }}
      </div>
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
        <button class="btn btn-outline-primary mt-2" @click="addTask('personal')">➕</button>
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
        <button class="btn btn-outline-primary mt-2" @click="addTask('personal')">➕</button>
      </div>
    </div>
    <button type="button" class="btn btn-secondary" @click="fetchData">New Quote</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "CalendarView",

  data() {
    return {
      quote: '',
    }
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
    }
  }
}
</script>


