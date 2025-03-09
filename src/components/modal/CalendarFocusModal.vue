<template>
  <div class="modal" v-if="modalIsOpen" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Add {{ focusType === 'personal' ? 'Personal' : 'Work' }} Focus
            <span v-if="selectedDate">
              - {{ formatDate(selectedDate) }}
            </span>
          </h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="focusText" class="form-label">Focus Description</label>
            <input
                type="text"
                class="form-control"
                id="focusText"
                v-model="focusText"
                @keyup.enter="saveFocus"
                placeholder="Enter focus description"
                ref="focusInput"
            >
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="saveFocus" :disabled="!focusText.trim()">
            Add Focus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarFocusModal',
  props: {
    modalIsOpen: {
      type: Boolean,
      required: true
    },
    selectedDate: {
      type: Date,
      default: null
    },
    focusType: {
      type: String,
      default: 'personal',
      validator: function(value) {
        return ['personal', 'work'].includes(value);
      }
    }
  },
  data() {
    return {
      focusText: ''
    };
  },
  methods: {
    closeModal() {
      this.focusText = '';
      this.$emit('event-close-modal');
    },
    saveFocus() {
      if (this.focusText.trim()) {
        this.$emit('event-save', this.focusText);
        this.focusText = '';
      }
    },
    formatDate(date) {
      if (!date) return '';

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  },
  watch: {
    modalIsOpen(newValue) {
      if (newValue) {
        // Focus the input when modal opens
        this.$nextTick(() => {
          this.$refs.focusInput.focus();
        });
      }
    }
  }
};
</script>

<style scoped>
/* Modal styling - to match the app's theme */
.modal-content {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Button styling - matching the app's theme */
.btn-primary {
  background-color: #8e44ad; /* Same purple as calendar */
  border-color: #8e44ad;
}

.btn-primary:hover {
  background-color: #7d3c98; /* Slightly darker on hover */
  border-color: #7d3c98;
}

.btn-primary:active,
.btn-primary:focus {
  background-color: #6c3483; /* Even darker when active/focused */
  border-color: #6c3483;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4);
}

.modal-title {
  font-family: 'Quicksand', sans-serif !important;
  font-weight: 600 !important;
}
</style>