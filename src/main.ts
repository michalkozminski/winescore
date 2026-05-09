import "./styles.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error: unknown) => {
      console.warn("Service worker registration failed", error);
    });
  });
}

type FieldOption = {
  label: string;
  value: string;
};

type Field = {
  id: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "aroma" | "score";
  placeholder?: string;
  options?: FieldOption[];
};

type Section = {
  title: string;
  subtitle: string;
  fields: Field[];
};

type AromaGroup = {
  title: string;
  notes: string[];
};

type AromaCategory = {
  id: "primary" | "secondary" | "tertiary";
  label: string;
  groups: AromaGroup[];
};

const storageKey = "wset-wine-note-draft";

const appearanceOptions = ["Clear", "Pale", "Medium", "Deep"].map((value) => ({
  label: value,
  value
}));

const intensityOptions = ["Light", "Medium(-)", "Medium", "Medium(+)", "Pronounced"].map((value) => ({
  label: value,
  value
}));

const acidTanninBodyOptions = ["Low", "Medium(-)", "Medium", "Medium(+)", "High"].map((value) => ({
  label: value,
  value
}));

const wineTypeOptions = ["White", "Red", "Rose"].map((value) => ({
  label: value === "Rose" ? "Rose" : value,
  value: value.toLowerCase()
}));

const wineColorOptions: Record<string, FieldOption[]> = {
  white: ["Lemon-green", "Lemon", "Gold", "Amber", "Brown"].map((value) => ({ label: value, value })),
  red: ["Purple", "Ruby", "Garnet", "Tawny", "Brown"].map((value) => ({ label: value, value })),
  rose: ["Pink", "Salmon", "Orange", "Onion skin"].map((value) => ({ label: value, value }))
};

const scoreOptions: FieldOption[] = [
  { label: "Low", value: "1" },
  { label: "Medium(-)", value: "2" },
  { label: "Medium", value: "3" },
  { label: "Medium(+)", value: "4" },
  { label: "High", value: "5" }
];

const aromaCategories: AromaCategory[] = [
  {
    id: "primary",
    label: "Primary",
    groups: [
      {
        title: "Floral",
        notes: ["Blossom", "Elderflower", "Honeysuckle", "Jasmine", "Rose", "Violet"]
      },
      {
        title: "Green Fruit",
        notes: ["Apple", "Green apple", "Pear", "Gooseberry", "Quince", "Grape"]
      },
      {
        title: "Citrus Fruit",
        notes: ["Grapefruit", "Lemon", "Lime", "Orange", "Lemon peel", "Orange peel"]
      },
      {
        title: "Stone & Tropical",
        notes: ["Peach", "Apricot", "Nectarine", "Banana", "Lychee", "Mango", "Melon", "Passion fruit", "Pineapple"]
      },
      {
        title: "Red Fruit",
        notes: ["Redcurrant", "Cranberry", "Raspberry", "Strawberry", "Red cherry", "Red plum"]
      },
      {
        title: "Black Fruit",
        notes: ["Blackcurrant", "Blackberry", "Bramble", "Blueberry", "Black cherry", "Black plum"]
      },
      {
        title: "Fruit Condition",
        notes: ["Unripe fruit", "Ripe fruit", "Cooked fruit", "Baked fruit", "Dried fruit", "Jamminess"]
      },
      {
        title: "Herbal & Herbaceous",
        notes: ["Green bell pepper", "Grass", "Tomato leaf", "Asparagus", "Blackcurrant leaf", "Eucalyptus", "Mint", "Fennel", "Dill", "Dried herbs"]
      },
      {
        title: "Spice & Other",
        notes: ["Black pepper", "White pepper", "Liquorice", "Cinnamon", "Wet stones", "Flint", "Candy"]
      }
    ]
  },
  {
    id: "secondary",
    label: "Secondary",
    groups: [
      {
        title: "Yeast & Lees",
        notes: ["Biscuit", "Bread", "Toast", "Pastry", "Brioche", "Bread dough", "Cheese", "Yogurt"]
      },
      {
        title: "Malolactic",
        notes: ["Butter", "Cream", "Cheese", "Yogurt"]
      },
      {
        title: "Oak",
        notes: ["Vanilla", "Clove", "Nutmeg", "Coconut", "Butterscotch", "Cedar", "Charred wood", "Smoke", "Chocolate", "Coffee"]
      },
      {
        title: "Fermentation Markers",
        notes: ["Banana", "Pear drop", "Bubblegum", "Kirsch", "Candied fruit"]
      }
    ]
  },
  {
    id: "tertiary",
    label: "Tertiary",
    groups: [
      {
        title: "White Wine Development",
        notes: ["Dried apricot", "Dried apple", "Marmalade", "Petrol", "Kerosene", "Honey", "Hay", "Mushroom"]
      },
      {
        title: "Red Wine Development",
        notes: ["Fig", "Prune", "Raisin", "Dried cranberry", "Cooked plum", "Leather", "Earth", "Meat", "Tobacco", "Wet leaves", "Forest floor"]
      },
      {
        title: "Bottle Spice & Savoury",
        notes: ["Cinnamon", "Ginger", "Nutmeg", "Toast", "Nutty", "Truffle", "Game", "Tar"]
      },
      {
        title: "Oxidative",
        notes: ["Almond", "Marzipan", "Hazelnut", "Walnut", "Chocolate", "Coffee", "Toffee", "Caramel"]
      }
    ]
  }
];

const sections: Section[] = [
  {
    title: "Wine",
    subtitle: "Set the sample context before assessing it.",
    fields: [
      { id: "wineName", label: "Wine", placeholder: "Producer, cuvee, vintage" },
      { id: "wineType", label: "Type", type: "select", options: wineTypeOptions },
      { id: "region", label: "Region", placeholder: "Country, region, appellation" },
      { id: "grape", label: "Grape", placeholder: "Variety or blend" }
    ]
  },
  {
    title: "Appearance",
    subtitle: "Clarity, intensity, colour, and observable development.",
    fields: [
      { id: "clarity", label: "Clarity", type: "select", options: appearanceOptions },
      { id: "appearanceIntensity", label: "Intensity", type: "select", options: appearanceOptions },
      { id: "colour", label: "Colour", type: "select" },
      { id: "appearanceNotes", label: "Notes", type: "textarea", placeholder: "Rim variation, legs, deposits" }
    ]
  },
  {
    title: "Nose",
    subtitle: "Condition, intensity, aroma characteristics, and development.",
    fields: [
      { id: "condition", label: "Condition", placeholder: "Clean, unclean" },
      { id: "noseIntensity", label: "Intensity", type: "select", options: intensityOptions },
      { id: "aromas", label: "Aromas", type: "aroma", placeholder: "Fruit, floral, spice, oak, earth, tertiary" }
    ]
  },
  {
    title: "Palate",
    subtitle: "Structure, flavour intensity, finish, and balance.",
    fields: [
      { id: "sweetness", label: "Sweetness", type: "select", options: acidTanninBodyOptions },
      { id: "acidity", label: "Acidity", type: "select", options: acidTanninBodyOptions },
      { id: "tannin", label: "Tannin", type: "select", options: acidTanninBodyOptions },
      { id: "body", label: "Body", type: "select", options: acidTanninBodyOptions },
      { id: "alcohol", label: "Alcohol", type: "select", options: acidTanninBodyOptions },
      { id: "flavours", label: "Flavours", type: "textarea", placeholder: "Confirm aromas and note palate-specific flavours" },
      { id: "finish", label: "Finish", placeholder: "Short, medium, long" }
    ]
  },
  {
    title: "Conclusion",
    subtitle: "Score is calculated from balance, length, intensity, and complexity.",
    fields: [
      { id: "balanceScore", label: "Balance", type: "select", options: scoreOptions },
      { id: "lengthScore", label: "Length", type: "select", options: scoreOptions },
      { id: "intensityScore", label: "Intensity", type: "select", options: scoreOptions },
      { id: "complexityScore", label: "Complexity", type: "select", options: scoreOptions },
      { id: "score", label: "Score", type: "score" },
      { id: "quality", label: "Quality", placeholder: "Acceptable, good, very good, outstanding" },
      { id: "readiness", label: "Readiness", placeholder: "Drink now, suitable for ageing" },
      { id: "conclusionNotes", label: "Notes", type: "textarea", placeholder: "Balance, length, intensity, complexity" }
    ]
  }
];

function aromaGroupTemplate(group: AromaGroup): string {
  return `
    <div class="aroma-group">
      <h3>${group.title}</h3>
      <div class="aroma-chip-grid">
        ${group.notes
          .map(
            (note) => `
              <button class="aroma-chip" type="button" data-aroma-chip="${note}" aria-pressed="false">
                ${note}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function aromaSelectorTemplate(field: Field): string {
  return `
    <div class="glass-field field-wide aroma-builder">
      <div class="aroma-label-row">
        <span>${field.label}</span>
        <span class="aroma-count" id="aromaCount">No aromas selected</span>
      </div>

      <div class="aroma-tabs" role="tablist" aria-label="Aroma categories">
        ${aromaCategories
          .map(
            (category, index) => `
              <button
                class="aroma-tab ${index === 0 ? "is-active" : ""}"
                type="button"
                role="tab"
                aria-selected="${index === 0 ? "true" : "false"}"
                aria-controls="aroma-panel-${category.id}"
                data-aroma-tab="${category.id}"
              >
                ${category.label}
              </button>
            `
          )
          .join("")}
      </div>

      <div class="aroma-panels">
        ${aromaCategories
          .map(
            (category, index) => `
              <div
                class="aroma-panel ${index === 0 ? "is-active" : ""}"
                id="aroma-panel-${category.id}"
                role="tabpanel"
                data-aroma-panel="${category.id}"
                ${index === 0 ? "" : "hidden"}
              >
                ${category.groups.map(aromaGroupTemplate).join("")}
              </div>
            `
          )
          .join("")}
      </div>

      <input id="aromaChips" name="aromaChips" type="hidden" />
      <div class="selected-aromas" id="selectedAromas" aria-live="polite">
        <span class="selected-empty">Selected aromas will appear here</span>
      </div>

      <label class="aroma-notes" for="${field.id}">
        <span>Notes</span>
        <textarea class="glass-control" id="${field.id}" name="${field.id}" rows="4" placeholder="${field.placeholder ?? ""}"></textarea>
      </label>
    </div>
  `;
}

function fieldTemplate(field: Field): string {
  if (field.type === "score") {
    return `
      <div class="glass-field score-field" data-field-id="${field.id}">
        <span>${field.label}</span>
        <div class="score-display" aria-live="polite">
          <strong id="scoreValue">--</strong>
          <span id="scoreLabel">Select BLIC criteria</span>
        </div>
        <input id="${field.id}" name="${field.id}" type="hidden" />
      </div>
    `;
  }

  if (field.type === "aroma") {
    return aromaSelectorTemplate(field);
  }

  if (field.type === "textarea") {
    return `
      <label class="glass-field field-wide" for="${field.id}" data-field-id="${field.id}">
        <span>${field.label}</span>
        <textarea class="glass-control" id="${field.id}" name="${field.id}" rows="4" placeholder="${field.placeholder ?? ""}"></textarea>
      </label>
    `;
  }

  if (field.type === "select") {
    const options = field.options
      ?.map((option) => `<option value="${option.value}">${option.label}</option>`)
      .join("");

    return `
      <label class="glass-field" for="${field.id}" data-field-id="${field.id}">
        <span>${field.label}</span>
        <select class="glass-control" id="${field.id}" name="${field.id}">
          <option value="">${field.id === "colour" ? "Select type first" : "Select"}</option>
          ${options ?? ""}
        </select>
      </label>
    `;
  }

  return `
    <label class="glass-field" for="${field.id}" data-field-id="${field.id}">
      <span>${field.label}</span>
      <input class="glass-control" id="${field.id}" name="${field.id}" type="${field.type ?? "text"}" placeholder="${field.placeholder ?? ""}" />
    </label>
  `;
}

function sectionTemplate(section: Section): string {
  return `
    <section class="glass-card">
      <div class="section-heading">
        <h2>${section.title}</h2>
        <p>${section.subtitle}</p>
      </div>
      <div class="field-grid">
        ${section.fields.map(fieldTemplate).join("")}
      </div>
    </section>
  `;
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="app-shell">
    <header class="glass-header">
      <div>
        <p class="eyebrow">WSET tasting note</p>
        <h1>Wine Notes</h1>
      </div>
      <button class="glass-icon-button" id="newNote" type="button" aria-label="Start a fresh note" title="Start a fresh note">
        +
      </button>
    </header>

    <form class="notes-form" id="notesForm">
      ${sections.map(sectionTemplate).join("")}
      <div class="glass-action-bar">
        <p class="save-status" id="saveStatus" aria-live="polite">Ready to save in Apple Notes</p>
        <button class="glass-button glass-button-secondary" type="reset">Clear</button>
        <button class="glass-button glass-button-primary" id="saveNote" type="button">Save to Apple Notes</button>
      </div>
    </form>
  </main>
`;

const form = document.querySelector<HTMLFormElement>("#notesForm")!;
const saveStatus = document.querySelector<HTMLParagraphElement>("#saveStatus")!;
const saveButton = document.querySelector<HTMLButtonElement>("#saveNote")!;
const aromaChipsInput = document.querySelector<HTMLInputElement>("#aromaChips")!;
const aromaCount = document.querySelector<HTMLSpanElement>("#aromaCount")!;
const selectedAromas = document.querySelector<HTMLDivElement>("#selectedAromas")!;
const wineTypeSelect = document.querySelector<HTMLSelectElement>("#wineType")!;
const colourSelect = document.querySelector<HTMLSelectElement>("#colour")!;
const tanninField = document.querySelector<HTMLElement>('[data-field-id="tannin"]')!;
const tanninSelect = document.querySelector<HTMLSelectElement>("#tannin")!;
const scoreInput = document.querySelector<HTMLInputElement>("#score")!;
const scoreValue = document.querySelector<HTMLElement>("#scoreValue")!;
const scoreLabel = document.querySelector<HTMLSpanElement>("#scoreLabel")!;
const scoreCriteria = ["balanceScore", "lengthScore", "intensityScore", "complexityScore"];
const fieldLabels = new Map(
  sections.flatMap((section) => section.fields.map((field) => [field.id, field.label]))
);
const selectLabels = new Map(
  [
    ...appearanceOptions,
    ...intensityOptions,
    ...acidTanninBodyOptions,
    ...wineTypeOptions,
    ...Object.values(wineColorOptions).flat(),
    ...scoreOptions
  ].map((option) => [option.value, option.label])
);

function updateStatus(message: string): void {
  saveStatus.textContent = message;
}

function appleNotesReadyMessage(): string {
  return canOpenAppleNotesShare()
    ? "Ready to save in Apple Notes"
    : "Open on an Apple device with sharing to save in Notes.";
}

function configureAppleNotesSaveButton(): void {
  const canShareToNotes = canOpenAppleNotesShare();
  saveButton.disabled = !canShareToNotes;
  saveButton.title = canShareToNotes
    ? "Open the Apple share sheet and choose Notes"
    : "Apple Notes saving requires an Apple device with Web Share support";
  updateStatus(appleNotesReadyMessage());
}

function readForm(): Record<string, string> {
  const data = new FormData(form);
  return Object.fromEntries(
    Array.from(data.entries()).map(([key, value]) => [key, String(value)])
  );
}

function isAppleDevice(): boolean {
  return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) || navigator.platform === "MacIntel";
}

function canOpenAppleNotesShare(): boolean {
  return isAppleDevice() && typeof navigator.share === "function";
}

function slugifyFileName(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "wine-note";
}

function noteTitle(note: Record<string, string>): string {
  return note.wineName?.trim() || "Wine Note";
}

function formatFieldValue(id: string, value: string): string {
  if (id === "aromaChips") {
    return value.split("|").filter(Boolean).join(", ");
  }

  return selectLabels.get(value) ?? value;
}

function buildNoteExportText(note: Record<string, string>): string {
  const exportedAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date());
  const lines = [noteTitle(note), `Exported ${exportedAt}`, ""];

  sections.forEach((section) => {
    const sectionLines: string[] = [];

    section.fields.forEach((field) => {
      const value = note[field.id]?.trim();

      if (value) {
        sectionLines.push(`${fieldLabels.get(field.id) ?? field.label}: ${formatFieldValue(field.id, value)}`);
      }

      if (field.id === "aromas") {
        const selectedAromas = note.aromaChips?.trim();

        if (selectedAromas) {
          sectionLines.push(`Selected aromas: ${formatFieldValue("aromaChips", selectedAromas)}`);
        }
      }
    });

    if (sectionLines.length > 0) {
      lines.push(section.title, ...sectionLines, "");
    }
  });

  return lines.join("\n").trimEnd();
}

async function saveToAppleNotes(note: Record<string, string>): Promise<void> {
  if (!canOpenAppleNotesShare()) {
    updateStatus("Open on an Apple device with sharing to save in Notes.");
    return;
  }

  const text = buildNoteExportText(note);
  const title = noteTitle(note);
  const file = new File([text], `${slugifyFileName(title)}.txt`, { type: "text/plain" });

  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title,
        text,
        files: [file]
      });
    } else {
      await navigator.share({
        title,
        text
      });
    }

    updateStatus("Choose Notes in the share sheet to save.");
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      updateStatus("Not saved. Choose Notes to save the note.");
      return;
    }

    updateStatus("Apple Notes export is unavailable in this browser.");
  }
}

function writeForm(note: Record<string, string>): void {
  Object.entries(note).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);

    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      field.value = value;
    }
  });
}

function updateColourOptions(keepCurrent = false): void {
  const wineType = wineTypeSelect.value;
  const currentColour = colourSelect.value;
  const options = wineColorOptions[wineType] ?? [];

  colourSelect.innerHTML = `
    <option value="">${wineType ? "Select colour" : "Select type first"}</option>
    ${options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
  `;

  const canKeepCurrent = keepCurrent && options.some((option) => option.value === currentColour);
  colourSelect.value = canKeepCurrent ? currentColour : "";
  colourSelect.disabled = options.length === 0;
}

function updateTanninAvailability(): void {
  const isRedWine = wineTypeSelect.value === "red";
  tanninField.classList.toggle("is-hidden", !isRedWine);
  tanninSelect.disabled = !isRedWine;

  if (!isRedWine) {
    tanninSelect.value = "";
  }
}

function scoreQualityLabel(score: number): string {
  if (score >= 85) {
    return "Outstanding";
  }

  if (score >= 70) {
    return "Very good";
  }

  if (score >= 55) {
    return "Good";
  }

  if (score >= 40) {
    return "Acceptable";
  }

  return "Poor";
}

function updateScore(): void {
  const values = scoreCriteria.map((id) => {
    const field = document.querySelector<HTMLSelectElement>(`#${id}`);
    return Number(field?.value ?? 0);
  });
  const assessedValues = values.filter((value) => value > 0);

  if (assessedValues.length < scoreCriteria.length) {
    scoreInput.value = "";
    scoreValue.textContent = "--";
    scoreLabel.textContent = `${assessedValues.length}/${scoreCriteria.length} criteria selected`;
    return;
  }

  const total = assessedValues.reduce((sum, value) => sum + value, 0);
  const score = Math.round((total / (scoreCriteria.length * 5)) * 100);
  scoreInput.value = String(score);
  scoreValue.textContent = String(score);
  scoreLabel.textContent = scoreQualityLabel(score);
}

function updateWineTypeDependentFields(keepColour = false): void {
  updateColourOptions(keepColour);
  updateTanninAvailability();
}

function getSelectedAromas(): string[] {
  return Array.from(document.querySelectorAll<HTMLButtonElement>(".aroma-chip.is-selected")).map(
    (chip) => chip.dataset.aromaChip ?? ""
  ).filter(Boolean);
}

function updateAromaSummary(): void {
  const selected = getSelectedAromas();
  aromaChipsInput.value = selected.join("|");
  aromaCount.textContent = selected.length === 0
    ? "No aromas selected"
    : `${selected.length} selected`;

  selectedAromas.innerHTML = selected.length === 0
    ? '<span class="selected-empty">Selected aromas will appear here</span>'
    : selected
      .map(
        (note) => `
          <button class="selected-aroma" type="button" data-remove-aroma="${note}" aria-label="Remove ${note}">
            ${note}
          </button>
        `
      )
      .join("");
}

function setActiveAromaCategory(categoryId: string): void {
  document.querySelectorAll<HTMLButtonElement>(".aroma-tab").forEach((tabButton) => {
    const isActive = tabButton.dataset.aromaTab === categoryId;
    tabButton.classList.toggle("is-active", isActive);
    tabButton.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll<HTMLDivElement>(".aroma-panel").forEach((panel) => {
    const isActive = panel.dataset.aromaPanel === categoryId;
    panel.classList.toggle("is-active", isActive);
    panel.toggleAttribute("hidden", !isActive);
  });
}

function hydrateAromasFromInput(): void {
  const selected = new Set(aromaChipsInput.value.split("|").filter(Boolean));

  document.querySelectorAll<HTMLButtonElement>(".aroma-chip").forEach((chip) => {
    const isSelected = selected.has(chip.dataset.aromaChip ?? "");
    chip.classList.toggle("is-selected", isSelected);
    chip.setAttribute("aria-pressed", String(isSelected));
  });

  updateAromaSummary();
}

function clearAromaSelection(): void {
  aromaChipsInput.value = "";
  hydrateAromasFromInput();
}

async function saveNote(): Promise<void> {
  await saveToAppleNotes(readForm());
}

function restoreNote(): void {
  const savedNote = localStorage.getItem(storageKey);

  if (!savedNote) {
    return;
  }

  try {
    const note = JSON.parse(savedNote) as Record<string, string>;
    wineTypeSelect.value = note.wineType ?? "";
    updateColourOptions();
    writeForm(note);
    updateWineTypeDependentFields(true);
    updateScore();
    hydrateAromasFromInput();
    updateStatus(canOpenAppleNotesShare()
      ? "Restored local draft. Save to Apple Notes when ready."
      : appleNotesReadyMessage());
  } catch {
    localStorage.removeItem(storageKey);
  }
}

saveButton.addEventListener("click", () => {
  void saveNote();
});
document.querySelector<HTMLButtonElement>("#newNote")!.addEventListener("click", () => {
  form.reset();
  updateWineTypeDependentFields();
  updateScore();
  clearAromaSelection();
  localStorage.removeItem(storageKey);
  updateStatus(appleNotesReadyMessage());
});

form.addEventListener("reset", () => {
  localStorage.removeItem(storageKey);
  window.setTimeout(() => {
    updateWineTypeDependentFields();
    updateScore();
    clearAromaSelection();
  });
  updateStatus("Cleared");
});

wineTypeSelect.addEventListener("change", () => {
  updateWineTypeDependentFields();
});

scoreCriteria.forEach((id) => {
  document.querySelector<HTMLSelectElement>(`#${id}`)?.addEventListener("change", updateScore);
});

document.querySelectorAll<HTMLButtonElement>(".aroma-tab").forEach((tabButton) => {
  tabButton.addEventListener("click", () => {
    setActiveAromaCategory(tabButton.dataset.aromaTab ?? "primary");
  });
});

document.querySelectorAll<HTMLButtonElement>(".aroma-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const isSelected = !chip.classList.contains("is-selected");
    chip.classList.toggle("is-selected", isSelected);
    chip.setAttribute("aria-pressed", String(isSelected));
    updateAromaSummary();
  });
});

selectedAromas.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const aroma = target.dataset.removeAroma;

  if (!aroma) {
    return;
  }

  const chip = document.querySelector<HTMLButtonElement>(`.aroma-chip[data-aroma-chip="${aroma}"]`);
  chip?.classList.remove("is-selected");
  chip?.setAttribute("aria-pressed", "false");
  updateAromaSummary();
});

updateWineTypeDependentFields();
updateScore();
hydrateAromasFromInput();
configureAppleNotesSaveButton();
restoreNote();
