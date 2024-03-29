<template>
  <div>
    <ColumnsBlock v-for="semester in semesters" :key="semester">
      <template #title>{{ semester }}. Semester</template>
      <template #content>
        <div
          class="column has-text-centered is-3-desktop is-6-tablet"
          v-for="(tile, tileIndex) of getTilesForSemester(semester)"
          :key="tileIndex"
        >
          <div
            class="notification is-radiusless"
            :class="tile.moduleColor"
            style="color: black; min-height: 100px"
          >
            {{ tile.moduleName }}
          </div>
        </div>
      </template>
    </ColumnsBlock>
    <ColumnsBlock v-show="overflowedElectionTiles.length > 0">
      <template #title>Zu viel gewählte Module</template>
      <template #content>
        <div
          class="column has-text-centered is-3-desktop is-6-tablet"
          v-for="(tile, tileIndex) of overflowedElectionTiles"
          :key="tileIndex"
        >
          <div
            class="notification is-radiusless"
            :class="tile.moduleColor"
            style="color: black; min-height: 100px"
          >
            {{ tile.moduleName }}
          </div>
        </div>
      </template>
    </ColumnsBlock>
    <div class="election-status">
      <b-collapse v-model="isElectionInfoOpen" class="card">
        <template #trigger="props">
          <div class="card-header" :class="electionStatusColor" role="button">
            <p class="card-header-title">Ihr Vorwahlenstatus</p>
            <div class="card-header-icon">
              <b-icon
                :icon="props.open ? 'chevron-down' : 'chevron-right'"
                v-model="isElectionInfoOpen"
              ></b-icon>
            </div>
          </div>
        </template>
        <div
          class="card-content"
          :class="`${electionStatusColor}-light`"
          v-if="
            userStore.isStudent &&
            moduleStore.isClientConnected &&
            userStore.student.canElect
          "
        >
          <p v-for="(reason, index) of electionStatus" :key="index">
            {{ reason }}
          </p>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "vue-class-component/hooks";
import { getModule } from "vuex-module-decorators";
import UserStore from "@/store/modules/UserStore";
import ModuleStore from "@/store/modules/ModuleStore";
import ColumnsBlock from "@/components/ColumnsBlock.vue";
import ElectionStructureElement from "@/models/electionStructureElement";
import ElectionStatus from "@/models/electionStatus";
import ElectionStatusElement from "@/models/electionStatusElement";
import ModuleCategory from "@/models/moduleCategory";

interface ModuleTile {
  moduleName: string;
  moduleColor: string;
  semester: number;
}

@Component({
  components: {
    ColumnsBlock,
  },
})
export default class ModuleElection extends Vue {
  moduleStore: ModuleStore = getModule(ModuleStore);
  userStore: UserStore = getModule(UserStore);
  isElectionInfoOpen = true;

  getTilesForSemester(semester: number): Array<ModuleTile> {
    const tiles: Array<ModuleTile> = [];

    if (this.moduleStore.electedModules) {
      const sortOrder = [
        ModuleCategory.CONTEXT_MODULE,
        ModuleCategory.PROJECT_MODULE,
        ModuleCategory.BACHELOR_MODULE,
        ModuleCategory.CONTEXT_MODULE,
        ModuleCategory.SUBJECT_MODULE,
        ModuleCategory.INTERDISCIPLINARY_MODULE,
      ];
      this.moduleStore.electedModules
        .filter((element) => element.semester % semester === 0)
        .sort(
          (el1, el2) =>
            sortOrder.indexOf(el1.category) - sortOrder.indexOf(el2.category)
        )
        .map((element) => this.electionStructureElementToTile(element))
        .forEach((tile) => tiles.push(tile));
    }

    return tiles;
  }

  get overflowedElectionTiles(): Array<ModuleTile> {
    const tiles: Array<ModuleTile> = [];
    if (this.moduleStore.overflowedElectedModules) {
      this.moduleStore.overflowedElectedModules
        .map((element) => this.electionStructureElementToTile(element))
        .forEach((tile) => tiles.push(tile));
    }
    return tiles;
  }

  get semesters(): Array<number> {
    const student = this.userStore.student;
    let semesters = [6, 5];
    if (student && student.tz && student.secondElection) {
      semesters = [8, 7];
    }
    return semesters;
  }

  electionStructureElementToTile(
    element: ElectionStructureElement
  ): ModuleTile {
    const title = this.mapModuleTitle(element.id, element.name);
    return {
      semester: element.semester,
      moduleName: title,
      moduleColor: this.moduleStore.getColorForCategory(element.category),
    };
  }

  mapModuleTitle(moduleNo: string, title: string): string {
    const module = this.moduleStore.moduleArr.find(
      (module) => module.moduleNo === moduleNo && module.language === "Englisch"
    );
    if (module) {
      title = title.concat(" (E)");
    }
    return title;
  }

  get electionStatus(): Array<string> {
    const electionStatus: ElectionStatus | null =
      this.moduleStore.electionStatus;
    const reasons: Array<string> = [];
    if (electionStatus) {
      for (const value of Object.values(electionStatus)) {
        const validation = value as ElectionStatusElement;
        if (validation.reasons) {
          reasons.push(...validation.reasons);
        }
      }
    }

    if (reasons.length === 0 && this.moduleStore.isElectionValid) {
      reasons.push("Ihre Wahl ist im Moment gültig");
    }
    return reasons;
  }

  get electionStatusColor(): string {
    return this.moduleStore.isElectionValid
      ? "has-background-success"
      : "has-background-warning";
  }
}
</script>

<style>
.election-status {
  position: fixed !important;
  right: 5px;
  bottom: 5px;
  z-index: 1;
}
</style>
