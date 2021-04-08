<template>
  <ValidationObserver
    ref="observer"
    tag="form"
    novalidate
    @submit.prevent="onSubmit()"
  >
    <slot></slot>
  </ValidationObserver>
</template>
<script>
import { mapActions } from "vuex";
import { ValidationObserver } from "vee-validate";

export default {
  components: {
    ValidationObserver,
  },
  props: {
    submit: {
      type: Function,
      default: () => ({}),
    },
    errorGroup: {
      type: String,
      default: null,
    },
  },
  methods: {
    ...mapActions({
      addAlert: "addAlert",
      clearAlerts: "clearAlerts",
    }),
    async onSubmit() {
      this.clearAlerts({
        group: this.errorGroup,
        clearMessages: true,
        clearErrors: true,
      });
      this.$emit("update:validating", true);

      await this.$refs.observer.handleSubmit();

      this.$emit("update:validating", false);
      await new Promise((resolve) => setTimeout(() => resolve(), 100));

      const {
        errors: fieldErrors = {},
        flags: { valid },
      } = this.$refs.observer;

      Object.keys(fieldErrors).forEach((field) => {
        const errors = fieldErrors[field];

        if (this.errorGroup) {
          errors.forEach((error) => {
            return this.addAlert({
              group: this.errorGroup,
              message: error,
            });
          });
        }
      });

      if (valid) {
        return this.submit();
      } else {
        return false;
      }
    },
    reset(clearMessages = true, clearErrors = true) {
      const { observer } = this.$refs;

      observer.reset();
      if (this.errorGroup) {
        this.clearAlerts({
          group: this.errorGroup,
          clearMessages,
          clearErrors,
        });
      }
    },
  },
};
</script>
