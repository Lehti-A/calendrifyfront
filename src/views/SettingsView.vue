<template>

  <div>

    <div class="background-image">
      <img :src="backgroundImage" alt="Background Image" />
    </div>




      <div class="row-10">
            <div class="card mb-3 transparent-card">
              <div class="card-header bg-transparent border-bottom"></div>
        <h2 class="text-center mb-4">Edit Personal Goals</h2>
              <ul class="list-group list-group-flush transparent-list">
                <li v-for="(task, index) in tasks" :key="index" class="list-group-item transparent-item d-flex align-items-center justify-content-between">
                  <span :class="{ 'completed-task': task.completed }">{{ task.text }}</span>
                  <div class="task-actions">

                    <button
                        class="btn btn-sm btn-link text-danger p-0"
                        @click="removeTask(index)"
                        title="Remove task"
                    >
                      <i class="fas fa-eraser"></i>
                      <!-- If Font Awesome is not available, use text instead -->
                      <span v-if="!hasFontAwesome">🗑️</span>
                    </button>
                  </div>
                </li>
                <!-- Add new task input -->
                <li class="list-group-item transparent-item">
                  <div class="input-group">
                    <input
                        type="text"
                        class="form-control form-control-sm transparent-input"
                        placeholder="Add new task..."
                        v-model="newTask"
                        @keyup.enter="addTask"
                    >
                    <button class="btn btn-outline-secondary btn-sm" type="button" @click="addTask">Add</button>
                  </div>
                </li>
              </ul>
            </div>

        </div>



        <div class="card p-4 rounded shadow-sm" style="" >
          <h2 class="text-center mb-4">Edit Profile</h2>


          <form>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                  type="email"
                  class="form-control"
                  v-model="newUser.email"
                  placeholder="Enter your email"
                  required
              />
            </div>

            <div class="mb-3">
              <label for="address" class="form-label">Address</label>
              <input
                  type="text"
                  class="form-control"
                  v-model="newUser.address"
                  placeholder="Enter your address"
                  required
              />
            </div>

            <div class="mb-3">
              <label for="phone" class="form-label">Phone</label>
              <input
                  type="tel"
                  class="form-control"
                  v-model="newUser.phone"
                  placeholder="Enter your phone number"
                  required
              />
            </div>

            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary flex-grow-1 me-2" @click="">Delete</button>
              <button type="button" class="btn btn-secondary flex-grow-1 me-2" @click="">Update</button>
              <button type="button" class="btn btn-secondary flex-grow-1 me-2" @click="">Change password</button>
            </div>
          </form>
        </div>

  </div>


</template>

<script>
import UserService from "@/services/UserService";
import NavigationServices from "@/services/NavigationServices";

export default {
  name: "SettingsView",
  data() {
    return {
      backgroundImage: require('@/assets/calendrifynew.gif'),
      passwordRetype: '',
      errorMessage: '',
      newUser: {
        email: '',
        password: '',
        address: '',
        phone: '',
        termsAgreed: false,
      },
      tasks: [
        {text: "Play tennis", completed: false},
        {text: "Uurida, et kuidas me linnukeste asjaga süsteemi update-ime", completed: false}
      ],
      newTask: "",
      hasFontAwesome: false // Set to true if you have Font Awesome included
    };
  },
  methods: {
    addNewUser() {
      if (this.passwordNoMatch()) {
        this.errorMessage = "Paroolid ei kattu"
      } else {
        UserService.sendPostNewUserRequest(this.newUser)
            .then(() => NavigationServices.navigateToHomeView())
            .catch(() => NavigationServices.navigateToErrorView())

      }
    },

    passwordNoMatch() {
      return this.passwordRetype !== this.newUser.password
    },
    toggleTaskCompletion(index) {
      this.tasks[index].completed = !this.tasks[index].completed;
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
    },
    addTask() {
      if (this.newTask.trim()) {
        this.tasks.push({
          text: this.newTask.trim(),
          completed: false
        });
        this.newTask = "";
      }
    }
  }
}

</script>

<style >
.transparent-card {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.transparent-list {
  background-color: transparent;
}

.transparent-item {
  background-color: transparent;
  border-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.transparent-input {
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.completed-task {
  text-decoration: line-through;
  color: #6c757d;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>



