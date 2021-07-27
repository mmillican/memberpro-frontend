import { getField, updateField } from 'vuex-map-fields';
import { addErrorToast, addSuccessToast, CommitStateFunction } from '../common';
import Achievement from '@/models/achievements/achievement';
import AchievementComponent from '@/models/achievements/achievementComponent';
import MemberRequirementState, { UpdateMemberRequirementState } from '@/models/achievements/memberRequirementState';
import Requirement from '@/models/achievements/requirement';
import achievementComponentService from '@/services/achievementComponentService';
import achievementRequirementService from '@/services/achievementRequirementService';
import AchievementService from '@/services/achievementService';
import memberRequirementService from '@/services/memberRequirementService';

interface AchievementState {
  isLoading: boolean;
  achievements: Achievement[];
  currentAchievement: Achievement | null;
  currentComponents: AchievementComponent[];
  currentRequirements: Requirement[];
  requirementStates: MemberRequirementState[];
}

const state: AchievementState = {
  isLoading: false,
  achievements: [],
  currentAchievement: null,
  currentComponents: [],
  currentRequirements: [],
  requirementStates: [],
};

const getters = {
  getField,

  isLoading: (state: AchievementState): boolean => state.isLoading,
  achievements: (state: AchievementState): Achievement[] => state.achievements,
  currentAchievement: (state: AchievementState): Achievement | null => state.currentAchievement,
  currentComponents: (state: AchievementState): AchievementComponent[] => state.currentComponents,
  currentRequirements: (state: AchievementState): Requirement[] => state.currentRequirements,
  requirementStates: (state: AchievementState): MemberRequirementState[] => state.requirementStates,
};

const mutations = {
  updateField,

  SET_IS_LOADING(state: AchievementState, value: boolean): void {
    state.isLoading = value;
  },
  SET_ACHIEVEMENTS(state: AchievementState, value: Achievement[]): void {
    state.achievements = value;
  },
  SET_CURRENT_ACHIEVEMENT(state: AchievementState, value: Achievement | null): void {
    state.currentAchievement = value;
  },
  SET_CURRENT_COMPONENTS(state: AchievementState, value: AchievementComponent[]): void {
    state.currentComponents = value;
  },
  SET_CURRENT_REQUIREMENTS(state: AchievementState, value: Requirement[]): void {
    state.currentRequirements = value;
  },
  SET_CURRENT_REQUIREMENT_STATES(state: AchievementState, value: MemberRequirementState[]): void {
    state.requirementStates = value;
  },
  UPDATE_CURRENT_REQUIREMENT_STATES(state: AchievementState, value: MemberRequirementState): void {
    const states = state.requirementStates.filter(x => x.id !== value.id);
    state.requirementStates = [ ...states, value ];
  },
};

const actions = {
  async loadAchievements({ commit }: { commit: any }): Promise<void> {
    commit('SET_IS_LOADING', true);

    try {
      const achievements = await AchievementService.getAll();
      commit('SET_ACHIEVEMENTS', achievements);
    } catch {
      // TODO: Show error
    }

    commit('SET_IS_LOADING', false);
  },

  async loadAchievement({ commit }: { commit: any }, id: number): Promise<void> {
    commit('SET_IS_LOADING', true);

    try {
      const achievement = await AchievementService.findById(id);
      commit('SET_CURRENT_ACHIEVEMENT', achievement);

      const components = await achievementComponentService.getAllForAchievement(id);
      commit('SET_CURRENT_COMPONENTS', components);

      const requirements = await achievementRequirementService.getAllForAchievement(id);
      commit('SET_CURRENT_REQUIREMENTS', requirements);

      const requirementStates = await memberRequirementService.getUserRequirementStatesForAchievement(id);
      commit('SET_CURRENT_REQUIREMENT_STATES', requirementStates);
    } catch {
      // TODO: Show error
    }

    commit('SET_IS_LOADING', false);
  },

  async updateRequirementState({ commit, state }: CommitStateFunction<AchievementState>, { requirementId }): Promise<void> {
    try {
      const model = new UpdateMemberRequirementState();
      model.requirementId = requirementId;

      const requirement = state.currentRequirements.find(x => x.id === requirementId);

      // Map the values to a dictionary
      model.data = Object.assign({}, ...requirement?.validationParameters.map((x) => ({ [x.key]: x.value })));

      const updatedRequirementState = await memberRequirementService.updateRequirementState(model);
      commit('UPDATE_CURRENT_REQUIREMENT_STATES', updatedRequirementState);

      addSuccessToast('The requirement data has been saved.');
    } catch {
      addErrorToast('There was an error saving the requirement data. Please try again.');
    }
  },

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
