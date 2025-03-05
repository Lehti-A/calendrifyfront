<template>
  <div class="personal-day-view">

    <h1 class="personal-day-header">Personal Day</h1>

    <div class="dashboard-container">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Calendar Day Button and Focus for Today (in the same row) -->
        <div class="focus-calendar-row">
          <!-- Calendar Day Button -->
          <button class="calendar-day-btn" @click="navigateToMonthView">
            {{ currentDate }}
          </button>

          <!-- Focus for Today -->
          <section class="box focus">
            <h3>Focus for Today</h3>
            <p>{{ focusForToday }}</p>
          </section>
        </div>

        <!-- Activities -->
        <section class="box activities">
          <h3>Activities</h3>
          <ul>
            <li v-for="(activity, index) in activities" :key="index">{{ activity }}</li>
          </ul>
        </section>

        <!-- Other Thoughts -->
        <section class="box thoughts">
          <h3>Other Thoughts</h3>
          <p>{{ otherThoughts }}</p>
        </section>

        <!-- Tasks -->
        <section class="box tasks">
          <h3>Tasks</h3>
          <ul>
            <li v-for="(task, index) in tasks" :key="index" :class="{ completed: task.completed }">
              <input type="checkbox" v-model="task.completed" @change="updateTask(task)" />
              {{ task.title }}
              <button @click="deleteTask(index)" class="btn-delete">&times;</button>
            </li>
          </ul>
          <form @submit.prevent="addTask">
            <input v-model="newTask" placeholder="Add new task" required />
            <button type="submit">Add Task</button>
          </form>
        </section>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <section class="box profile">

        </section>
        <!-- Meetings -->
        <section class="box meetings">
          <h3>Meetings</h3>
          <ul>
            <li v-for="(meeting, index) in meetings" :key="index">
              {{ meeting.time }} - {{ meeting.title }}
            </li>
          </ul>
        </section>

        <!-- Hydration -->
        <section class="box hydration">
          <h3>Hydration</h3>
          <p>Drank {{ glassesOfWater }} glasses of water</p>
        </section>

        <!-- Personal Mood -->
        <section class="box mood">
          <h3>Personal Mood</h3>
          <p>{{ personalMood }}</p>
        </section>

        <!-- Steps -->
        <section class="box steps">
          <h3>Steps</h3>
          <p>Did {{ steps }} steps today</p>
        </section>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "PersonalDayView",
  data() {
    return {
      currentDate: "26 February 2025", // Example date
      focusForToday: "Listening to 1 podcast episode", // Example focus
      activities: ["Read at least 15min", "Sport session", "Meditation session"],
      meetings: [
        { time: "8:00", title: "mingi meeting 1" },
        { time: "10:00", title: "mingi meeting 2" },
      ],
      tasks: [
        { title: "Buy theater tickets", completed: false },
        { title: "Call the doctor", completed: false },
        { title: "Do Bank Front", completed: false },
      ],
      newTask: "",
      personalMood: "Feeling productive!",
      otherThoughts: "Yesterday was good. Tomorrow is a personal day.",
      glassesOfWater: 8,
      steps: "12K+",
    };
  },
  methods: {
    navigateToMonthView() {
      console.log("Navigating to month view...");
      // Add navigation logic here (e.g., router.push)
    },
    addTask() {
      if (this.newTask.trim()) {
        this.tasks.push({ title: this.newTask, completed: false });
        this.newTask = ""; // Clear input field
      }
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
    updateTask(task) {
      console.log("Task updated:", task); // Simulate task update logic
    },
  },
};
</script>

<style scoped>
.personal-day-view {
  font-family: Arial, sans-serif;
  padding: 40px; /* Increased padding for more space */
  max-width: 100%; /* Wider container, adjusts based on screen size */
  margin: 0 auto; /* Center the container horizontally */
  display: flex;
  flex-direction: column;
  gap: 30px; /* Increased spacing between sections */
  background-image: url("https://via.placeholder.com/800x600"); /* Replace with your background image */
  background-size: cover;
  background-position: center;
  min-height: 100vh; /* Ensure the container spans the full viewport height */
}
.personal-day-header {
  font-size: 4rem; /* Adjust size as needed */
  font-weight: bold;
  text-align: center;
  margin: 0; /* Remove default margin */
  color: purple; /* Contrasting color for visibility */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Add shadow for depth */

}
/* Container for the entire dashboard */
.dashboard-container {
  display: flex;
  gap: 20px; /* Space between the left and right columns */
}

/* Left Column */
.left-column {
  flex: 2; /* Takes up equal space as the right column by default */
  display: flex;
  flex-direction: column;
  gap: 10px; /* Vertical spacing between elements in the left column */
}

/* Right Column */
.right-column {
  flex: 2; /* Takes up equal space as the left column by default */
  display: flex;
  flex-direction: column;
  gap: 10px; /* Vertical spacing between elements in the right column */
}

/* General box styling */
.box {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

/* Calendar Day Button Styling */
.calendar-day-btn {
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

/* Completed Task Styling */
.completed {
  text-decoration: line-through;
  color: gray;
}

/* Delete Button Styling */
.btn-delete {
  margin-left: 10px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}
/* Profile Picture Box */
.box.profile {
  text-align: center; /* Center align the image */
}

.box.profile img {
  max-width: 100%; /* Ensure the image fits within the box */
  height: auto; /* Maintain aspect ratio */
  border-radius: 5px; /* Optional: Rounded corners */
}
/* Container for the Calendar Button and Focus for Today */
.focus-calendar-row {
  display: flex;
  gap: 20px; /* Space between the button and the focus section */
  align-items: center; /* Vertically align items */
}

/* Ensure the Focus box takes up remaining space */
.box.focus {
  flex: 1; /* Allow the focus section to grow and take up available space */
}

/* Optional: Style the calendar button for better alignment */
.calendar-day-btn {
  padding: 10px 20px; /* Adjust padding for better appearance */
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

</style>