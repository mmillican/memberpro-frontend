<template>
  <div class="achievement-details">
    <b-skeleton-wrapper :loading="isLoading">
      <template #loading>
        <b-skeleton width="55%"></b-skeleton>
        <b-skeleton width="85%"></b-skeleton>
        <b-skeleton width="70%"></b-skeleton>
        <b-skeleton width="70%"></b-skeleton>
      </template>

      <template v-if="achievement">
        <div class="d-flex justify-content-between align-items-baseline">
          <h1>
            {{ achievement.name }}
          </h1>

          <favorite-achievement-toggle :achievementId="achievement.id" />
        </div>

        <div class="description my-2">
          {{ achievement.description }}
        </div>

        <div class="requirements my-2">
          <h3>Steps/Requirements</h3>

          <ol class="requirement-list">
            <li v-for="step in achievementSteps" :key="step.id">
              {{ step.name }}
            </li>
          </ol>
        </div>
      </template>
    </b-skeleton-wrapper>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import Vue from 'vue';
import FavoriteAchievementToggle from '@/components/achievements/FavoriteAchievementToggle.vue';

export default Vue.extend({
  components: { FavoriteAchievementToggle },
  props: {
    achievementId: {
      required: true,
    },
  },
  computed: {
    ...mapGetters('achievements', [
      'isLoading',
      'achievement',
      'achievementSteps',
    ]),
  },
  async created() {
    await this.refreshView();
    await this.loadFavoriteAchievements();
  },
  watch: {
    achievementId: 'refreshView',
  },
  methods: {
    ...mapActions('achievements', [
      'loadAchievement',
    ]),
    ...mapActions('memberAchievements', [
      'loadFavoriteAchievements',
    ]),

    async refreshView() {
      this.loadAchievement(this.achievementId);
    },
  },
});
</script>
