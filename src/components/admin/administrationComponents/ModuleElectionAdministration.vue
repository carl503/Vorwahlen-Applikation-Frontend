<template>
  <Administration
    @deleteSelected="deleteModuleElection"
    :modal="modalComponent"
    :partialObject="initValues"
    id="id"
    :columns.sync="moduleElectionColumns"
    :rows.sync="moduleElectionRows"
    :checkedRows.sync="checkedModuleElectionRows"
    :isDataLoading.sync="isModuleElectionDataLoading"
  >
    <template #title>Modulvorwahlen-Verwaltung</template>
    <template #buttons-right>
      <div class="level-item">
        <b-button
          label="Exportieren"
          type="is-info"
          icon-left="file-download"
          @click="moduleElectionApi.getModuleExport"
          outlined
        />
      </div>

      <div class="level-item">
        <b-dropdown
          :triggers="['hover']"
          aria-role="list"
          position="is-bottom-left"
        >
          <template #trigger>
            <b-button
              label="Template laden"
              type="is-info"
              icon-right="chevron-down"
              icon-left="paper-plane"
              @click="notifySelectedStudents"
              outlined
            />
          </template>

          <b-dropdown-item
            aria-role="listitem"
            v-for="(mailTemplate, index) of mailTemplates"
            :key="index"
            @click="loadMailTemplate(mailTemplate.id)"
          >
            {{ mailTemplate.description }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </template>
  </Administration>
</template>

<script lang="ts">
import _Vue from "vue";
import { Component } from "vue-property-decorator";
import CreateEditModuleElection from "@/components/admin/createAddModals/CreateEditModuleElection.vue";
import Administration from "@/components/admin/administrationComponents/Administration.vue";
import ModuleElection from "@/models/moduleElection";
import StudentNotify from "@/components/admin/StudentNotify.vue";
import MailTemplate from "@/models/mailTemplate";
import StudentNotification from "@/models/studentNotification";
import ModuleElectionApi from "@/mixins/ModuleElectionApi";
import MailTemplateApi from "@/mixins/MailTemplateApi";

@Component({
  components: {
    CreateEditModuleElection,
    Administration,
    StudentNotify,
  },
})
export default class ModuleElectionAdministration extends Administration<ModuleElection> {
  isModuleElectionDataLoading = true;
  moduleElectionApi = new ModuleElectionApi();
  mailTemplateApi = new MailTemplateApi();
  moduleElectionRows: Array<ModuleElection> = [];
  checkedModuleElectionRows: Array<ModuleElection> = [];
  mailTemplates: Array<MailTemplate> = [];
  studentNotification: Partial<StudentNotification> = {};
  moduleElectionColumns = [
    {
      field: "id",
      label: "ID",
    },
    {
      field: "studentEmail",
      label: "Student",
    },
    {
      field: "electedModules",
      label: "Gewählte Module",
    },
    {
      field: "electionValid",
      label: "Wahlgültigkeit",
    },
  ];
  initValues: Partial<ModuleElection> = { id: 0, electedModules: [] };

  get modalComponent(): typeof _Vue {
    return CreateEditModuleElection;
  }

  async created(): Promise<void> {
    this.isModuleElectionDataLoading = false;
    this.moduleElectionRows = await this.moduleElectionApi.getAll();
    this.mailTemplates = await this.mailTemplateApi.getAll();
  }

  async deleteModuleElection(moduleElection: ModuleElection): Promise<void> {
    await this.moduleElectionApi.deleteById(moduleElection.id.toString());
  }

  notifySelectedUsers(): void {
    const studentMailAddresses = this.checkedModuleElectionRows.map(
      (moduleElection: ModuleElection) => moduleElection.studentEmail
    );
    this.modalOption.component = StudentNotify;
    this.modalOption.props = { studentNotification: { studentMailAddresses } };
    this.$buefy.modal.open(this.modalOption);
  }

  loadMailTemplate(id: number): void {
    const mailTemplate = this.mailTemplates.find(
      (mailTemplate: MailTemplate) => mailTemplate.id === id
    );
    if (mailTemplate && this.studentNotification) {
      this.studentNotification.subject = mailTemplate.subject;
      this.studentNotification.message = mailTemplate.message;
    }
    this.notifySelectedStudents();
  }

  notifySelectedStudents(): void {
    const studentMailAddresses = this.checkedModuleElectionRows.map(
      (moduleElection: ModuleElection) => moduleElection.studentEmail
    );
    if (this.studentNotification) {
      this.studentNotification.studentMailAddresses = studentMailAddresses;
    }

    this.modalOption.component = StudentNotify;
    this.modalOption.props = { studentNotification: this.studentNotification };
    this.$buefy.modal.open(this.modalOption);
  }
}
</script>
