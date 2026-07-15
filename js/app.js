const { createApp } = Vue

const QUESTION_BANK = [
  { key: 'q.0', typeKey: 'qt.choice', maxChoices: 3 },
  { key: 'q.1', typeKey: 'qt.rejection', maxChoices: 3 },
  { key: 'q.2', typeKey: 'qt.perception', maxChoices: 1 },
  { key: 'q.3', typeKey: 'qt.affinity', maxChoices: 3 },
  { key: 'q.4', typeKey: 'qt.trust', maxChoices: 2 },
  { key: 'q.5', typeKey: 'qt.affinity', maxChoices: 3 },
  { key: 'q.6', typeKey: 'qt.affinity', maxChoices: 3 },
  { key: 'q.7', typeKey: 'qt.perception', maxChoices: 2 },
  { key: 'q.8', typeKey: 'qt.trust', maxChoices: 2 },
  { key: 'q.9', typeKey: 'qt.perception', maxChoices: 2 },
  { key: 'q.10', typeKey: 'qt.trust', maxChoices: 2 },
  { key: 'q.11', typeKey: 'qt.affinity', maxChoices: 3 },
  { key: 'q.12', typeKey: 'qt.academic', maxChoices: 1 },
  { key: 'q.13', typeKey: 'qt.representation', maxChoices: 1 },
  { key: 'q.14', typeKey: 'qt.rejection', maxChoices: 3 },
]

const QUESTION_PRESETS = {
  general:     { nameKey: 'preset.general', active: [0, 1, 2] },
  primary:     { nameKey: 'preset.primary', active: [0, 1, 3, 6, 8, 11] },
  secondary:   { nameKey: 'preset.secondary', active: [0, 1, 2, 4, 7, 12] },
  highschool:  { nameKey: 'preset.highschool', active: [0, 1, 4, 7, 10, 13] },
  coexistence: { nameKey: 'preset.coexistence', active: [1, 3, 5, 9, 11, 14] },
  inclusion:   { nameKey: 'preset.inclusion', active: [0, 3, 4, 6, 8, 11] },
}

const app = createApp({
  data() {
    return {
      step: 1,
      groups: [],
      selectedGroupId: null,
      lang: localStorage.getItem('sociograma-lang') || 'es',
      showOnboarding: false,
      onboardingStep: 0,
      showMobileMenu: false,
      loading: true,
      maxChoices: 3,
      responses: {},
      isDark: document.documentElement.classList.contains('dark'),
      showImportInput: false,
      showPrivacy: false,
      toast: { show: false, message: '', type: 'success' },
      confirmDialog: { show: false, message: '', onOk: null },
      promptDialog: { show: false, message: '', onOk: null, value: '' },
      questionActive: [],
      currentPreset: 'general',
      questions: [],
    }
  },
  computed: {
    selectedGroup() { return this.groups.find(g => g.id === this.selectedGroupId) || null },
    presetList() {
      const names = Object.keys(QUESTION_PRESETS)
      return names.map(n => ({ id: n, name: this.t(QUESTION_PRESETS[n].nameKey) }))
    },
    onboardingSteps() { return Array(6) },
    steps() {
      return [this.t('step.groups'), this.t('step.questionnaire'), this.t('step.results'), this.t('step.teams'), this.t('step.dist')]
    },
    stepDesc() {
      return [this.t('step.groupsDesc'), this.t('step.questionnaireDesc'), this.t('step.resultsDesc'), this.t('step.teamsDesc'), this.t('step.distDesc')]
    },
  },
  watch: {
    lang(l) {
      localStorage.setItem('sociograma-lang', l)
      this.buildQuestions()
      document.title = this.t('app.title')
    },
    questionActive: { deep: true, handler() { this.buildQuestions() } },
  },
  methods: {
    t(key) { return t(key, this.lang) },
    setLang(l) { this.lang = l },
    onboardNext() { if (this.onboardingStep < 5) this.onboardingStep++ },
    onboardPrev() { if (this.onboardingStep > 0) this.onboardingStep-- },
    onboardGoTo(s) { this.onboardingStep = s },
    onboardClose() {
      this.showOnboarding = false
      localStorage.setItem('sociograma-onboarding', '1')
    },
    toggleDark() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
      localStorage.setItem('sociograma-dark', this.isDark)
    },
    buildQuestions() {
      this.questions = QUESTION_BANK.map((qb, i) => ({
        text: this.t(qb.key),
        type: this.t(qb.typeKey),
        maxChoices: qb.maxChoices,
        active: this.questionActive.includes(i),
      }))
    },
    handleGroupDelete(groupId) {
      const g = this.groups.find(g => g.id === groupId)
      if (!g) return
      const msg = this.t('group.confirmDelete').replace('{name}', g.name)
      this.showConfirm(msg, () => this.deleteGroup(groupId))
    },
    async deleteGroup(id) {
      this.groups = this.groups.filter(g => g.id !== id)
      if (this.selectedGroupId === id) this.selectedGroupId = null
      await saveGroups(this.groups)
    },
    showConfirm(msg, onOk) { this.confirmDialog = { show: true, message: msg, onOk } },
    showPrompt(msg, onOk) { this.promptDialog = { show: true, message: msg, onOk, value: '' } },
    cancelConfirm() { this.confirmDialog.show = false; this.confirmDialog.onOk = null },
    cancelPrompt() { this.promptDialog.show = false; this.promptDialog.onOk = null },
    okConfirm() { const cb = this.confirmDialog.onOk; this.confirmDialog.show = false; this.confirmDialog.onOk = null; if (cb) { const r = cb(); if (r && r.catch) r.catch(()=>{}) } },
    okPrompt(val) { const cb = this.promptDialog.onOk; this.promptDialog.show = false; this.promptDialog.onOk = null; if (cb) cb(val) },
    toggleQuestion(qi) {
      const idx = this.questionActive.indexOf(qi)
      if (idx >= 0) this.questionActive.splice(idx, 1)
      else this.questionActive.push(qi)
    },
    applyPreset(name) {
      const preset = QUESTION_PRESETS[name]
      if (!preset) return
      this.currentPreset = name
      this.questionActive = [...preset.active]
    },
    async initApp() {
      this.lang = localStorage.getItem('sociograma-lang') || 'es'
      window.__lang = this.lang
      this.groups = await loadGroups()
      if (!localStorage.getItem('sociograma-onboarding')) {
        this.showOnboarding = true
        this.onboardingStep = 0
      }
      this.applyPreset('general')
      document.title = this.t('app.title')
      this.loading = false
    },
    async goStep(s) {
      if (s >= 3 && s <= 5 && this.selectedGroup) {
        const loaded = await loadResponses(this.selectedGroupId)
        if (loaded && Object.keys(loaded).length) this.responses = loaded
      }
      this.showMobileMenu = false
      this.step = s
    },
    async startSurvey() { this.showMobileMenu = false; this.responses = await loadResponses(this.selectedGroupId); this.step = 2 },
    async loadGroupsData() { this.groups = await loadGroups() },
    async loadTestData() {
      this.showConfirm(this.t('confirm.testData'), async () => {
        await generateTestData()
        await this.loadGroupsData()
        this.showToast('toast.testData', 'success')
      })
    },
    async exportAll() { await exportAllData(); this.showToast('toast.exported', 'success') },
    async importJSON(e) {
      const file = e.target.files[0]
      if (!file) return
      try {
        await importFromFile(file)
        await this.loadGroupsData()
        this.showToast('toast.imported', 'success')
      } catch (err) { this.showToast('toast.error', 'error') }
      e.target.value = ''
    },
    showToast(key, type = 'success') {
      this.toast = { show: true, message: this.t(key), type }
      setTimeout(() => { this.toast.show = false }, 3500)
    },
  },
  mounted() { this.initApp() },
})

// Register components from js/components/
for (const [name, comp] of Object.entries(window.components || {})) {
  app.component(name, comp)
}
app.mount('#app')
