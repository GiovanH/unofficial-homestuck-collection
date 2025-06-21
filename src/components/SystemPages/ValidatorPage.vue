<template>
  <GenericCardPage>
    <div class="mousewrap" :class="{'busy': ($refs.wizard && $refs.wizard.busy>0)}">
      <div class="card dialog">
        <div class="cardContent">
          <ValidatorWizard ref="wizard"/>
        </div>
      </div>
    </div>
  </GenericCardPage>
</template>

<script>

import GenericCardPage from '@/components/Template/GenericCardPage.vue'
import ValidatorWizard from '@/components/UIElements/Validator.vue'

export default {
  name: 'ValidatorPage',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    GenericCardPage, ValidatorWizard
  },
  title(ctx){
    return "Validation Tools"
  }
}
</script>

<style scoped lang="scss">
.busy {
  cursor: progress;
}

.pageContent {
  max-width: 650px !important;
  margin: 1em;
}

.card.dialog {
  width: auto;
  max-width: 720px;
  transition: height 300ms, width 300ms;
  .cardContent {
    max-width: 544px;
  }
}

</style>
