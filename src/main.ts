import "./styles.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((registration) => registration.update())
      .catch((error: unknown) => {
        console.warn("Service worker registration failed", error);
      });
  });
}

type Language = "en" | "de";

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
const languageStorageKey = "wset-wine-note-language";

const germanTranslations: Record<string, string> = {
  "WSET tasting note": "WSET-Verkostungsnotiz",
  "Wine Notes": "Weinnotizen",
  "Language": "Sprache",
  "English": "Englisch",
  "German": "Deutsch",
  "Ready to save in Apple Notes": "Bereit zum Speichern in Apple Notizen",
  "Clear form": "Löschen",
  "Save to Apple Notes": "In Apple Notizen speichern",
  "Open on an Apple device with sharing to save in Notes.": "Auf einem Apple-Gerät mit Teilen-Funktion öffnen, um in Notizen zu speichern.",
  "Open the Apple share sheet and choose Notes to insert note text": "Öffne das Apple-Teilen-Menü und wähle Notizen, um den Notiztext einzufügen",
  "Apple Notes saving requires an Apple device with Web Share support": "Das Speichern in Apple Notizen erfordert ein Apple-Gerät mit Web-Share-Unterstützung",
  "Wine Note": "Weinnotiz",
  "Exported": "Exportiert",
  "Selected aromas": "Ausgewählte Aromen",
  "Choose Notes in the share sheet to insert the note text.": "Wähle Notizen im Teilen-Menü, um den Notiztext einzufügen.",
  "Not saved. Choose Notes to save the note.": "Nicht gespeichert. Wähle Notizen, um die Notiz zu speichern.",
  "Apple Notes export is unavailable in this browser.": "Der Export nach Apple Notizen ist in diesem Browser nicht verfügbar.",
  "Restored local draft. Save to Apple Notes when ready.": "Lokaler Entwurf wiederhergestellt. Speichere ihn in Apple Notizen, wenn er fertig ist.",
  "Cleared": "Gelöscht",
  "Select": "Auswählen",
  "Select type first": "Zuerst Typ auswählen",
  "Select colour": "Farbe auswählen",
  "No aromas selected": "Keine Aromen ausgewählt",
  "Selected aromas will appear here": "Ausgewählte Aromen erscheinen hier",
  "Notes": "Notizen",
  "Aroma categories": "Aromakategorien",
  "Select BLIK criteria": "BLIK-Kriterien auswählen",
  "criteria selected": "Kriterien ausgewählt",
  "BLIK quality": "BLIK-Qualität",
  "BLIK assessment is calculated from balance, length, intensity, and complexity.": "Die BLIK-Beurteilung wird aus Balance, Länge, Intensität und Komplexität berechnet.",
  "BLIK average": "BLIK-Durchschnitt",
  "selected": "ausgewählt",
  "Remove": "Entfernen",

  "Clear appearance": "Klar",
  "Pale": "Blass",
  "Medium": "Mittel",
  "Deep": "Tief",
  "Light": "Leicht",
  "Medium(-)": "Mittel(-)",
  "Medium(+)": "Mittel(+)",
  "Pronounced": "Ausgeprägt",
  "Low": "Niedrig",
  "High": "Hoch",
  "White": "Weiß",
  "Red": "Rot",
  "Rose": "Rosé",
  "Lemon-green": "Zitronengrün",
  "Lemon": "Zitrone",
  "Gold": "Gold",
  "Amber": "Bernstein",
  "Brown": "Braun",
  "Purple": "Purpur",
  "Ruby": "Rubinrot",
  "Garnet": "Granatrot",
  "Tawny": "Tawny",
  "Pink": "Rosa",
  "Salmon": "Lachsfarben",
  "Orange": "Orange",
  "Onion skin": "Zwiebelschale",

  "Wine": "Wein",
  "Set the sample context before assessing it.": "Lege den Kontext der Probe fest, bevor du sie beurteilst.",
  "Producer, cuvee, vintage": "Erzeuger, Cuvée, Jahrgang",
  "Type": "Typ",
  "Region": "Region",
  "Country, region, appellation": "Land, Region, Appellation",
  "Grape variety": "Rebsorte",
  "Variety or blend": "Rebsorte oder Cuvée",
  "Appearance": "Aussehen",
  "Clarity, intensity, colour, and observable development.": "Klarheit, Intensität, Farbe und sichtbare Entwicklung.",
  "Clarity": "Klarheit",
  "Intensity": "Intensität",
  "Colour": "Farbe",
  "Rim variation, legs, deposits": "Randaufhellung, Tränen, Depot",
  "Nose": "Nase",
  "Condition, intensity, aroma characteristics, and development.": "Zustand, Intensität, Aromaeigenschaften und Entwicklung.",
  "Condition": "Zustand",
  "Clean, unclean": "Sauber, unsauber",
  "Aromas": "Aromen",
  "Fruit, floral, spice, oak, earth, tertiary": "Frucht, floral, Würze, Eiche, erdig, tertiär",
  "Palate": "Gaumen",
  "Structure, flavour intensity, finish, and balance.": "Struktur, Geschmacksintensität, Abgang und Balance.",
  "Sweetness": "Süße",
  "Acidity": "Säure",
  "Tannin": "Tannin",
  "Body": "Körper",
  "Alcohol": "Alkohol",
  "Flavours": "Geschmacksnoten",
  "Confirm aromas and note palate-specific flavours": "Aromen bestätigen und gaumenspezifische Geschmacksnoten notieren",
  "Finish": "Abgang",
  "Short, medium, long": "Kurz, mittel, lang",
  "Conclusion": "Fazit",
  "Balance": "Balance",
  "Length": "Länge",
  "Complexity": "Komplexität",
  "Score": "Punktzahl",
  "Quality": "Qualität",
  "Acceptable, good, very good, outstanding": "Akzeptabel, gut, sehr gut, herausragend",
  "Readiness": "Trinkreife",
  "Drink now, suitable for ageing": "Jetzt trinken, lagerfähig",
  "Balance, length, intensity, complexity": "Balance, Länge, Intensität, Komplexität",
  "Outstanding": "Herausragend",
  "Very good": "Sehr gut",
  "Good": "Gut",
  "Acceptable": "Akzeptabel",
  "Poor": "Schwach",

  "Primary": "Primär",
  "Secondary": "Sekundär",
  "Tertiary": "Tertiär",
  "Floral": "Floral",
  "Blossom": "Blüte",
  "Elderflower": "Holunderblüte",
  "Honeysuckle": "Geißblatt",
  "Jasmine": "Jasmin",
  "Violet": "Veilchen",
  "Green Fruit": "Grüne Früchte",
  "Apple": "Apfel",
  "Green apple": "Grüner Apfel",
  "Pear": "Birne",
  "Gooseberry": "Stachelbeere",
  "Quince": "Quitte",
  "Grape": "Traube",
  "Citrus Fruit": "Zitrusfrüchte",
  "Grapefruit": "Grapefruit",
  "Lime": "Limette",
  "Lemon peel": "Zitronenschale",
  "Orange peel": "Orangenschale",
  "Stone & Tropical": "Stein- & Tropenfrüchte",
  "Peach": "Pfirsich",
  "Apricot": "Aprikose",
  "Nectarine": "Nektarine",
  "Banana": "Banane",
  "Lychee": "Litschi",
  "Mango": "Mango",
  "Melon": "Melone",
  "Passion fruit": "Passionsfrucht",
  "Pineapple": "Ananas",
  "Red Fruit": "Rote Früchte",
  "Redcurrant": "Rote Johannisbeere",
  "Cranberry": "Cranberry",
  "Raspberry": "Himbeere",
  "Strawberry": "Erdbeere",
  "Red cherry": "Rote Kirsche",
  "Red plum": "Rote Pflaume",
  "Black Fruit": "Schwarze Früchte",
  "Blackcurrant": "Schwarze Johannisbeere",
  "Blackberry": "Brombeere",
  "Bramble": "Brombeerstrauch",
  "Blueberry": "Blaubeere",
  "Black cherry": "Schwarzkirsche",
  "Black plum": "Schwarze Pflaume",
  "Fruit Condition": "Fruchtzustand",
  "Unripe fruit": "Unreife Frucht",
  "Ripe fruit": "Reife Frucht",
  "Cooked fruit": "Gekochte Frucht",
  "Baked fruit": "Gebackene Frucht",
  "Dried fruit": "Getrocknete Frucht",
  "Jamminess": "Konfitüre",
  "Herbal & Herbaceous": "Kräutrig & vegetabil",
  "Green bell pepper": "Grüne Paprika",
  "Grass": "Gras",
  "Tomato leaf": "Tomatenblatt",
  "Asparagus": "Spargel",
  "Blackcurrant leaf": "Johannisbeerblatt",
  "Eucalyptus": "Eukalyptus",
  "Mint": "Minze",
  "Fennel": "Fenchel",
  "Dill": "Dill",
  "Dried herbs": "Getrocknete Kräuter",
  "Spice & Other": "Würze & Sonstiges",
  "Black pepper": "Schwarzer Pfeffer",
  "White pepper": "Weißer Pfeffer",
  "Liquorice": "Lakritz",
  "Cinnamon": "Zimt",
  "Wet stones": "Nasse Steine",
  "Flint": "Feuerstein",
  "Candy": "Bonbon",
  "Yeast & Lees": "Hefe & Feinhefe",
  "Biscuit": "Keks",
  "Bread": "Brot",
  "Toast": "Toast",
  "Pastry": "Gebäck",
  "Brioche": "Brioche",
  "Bread dough": "Brotteig",
  "Cheese": "Käse",
  "Yogurt": "Joghurt",
  "Malolactic": "Biologischer Säureabbau",
  "Butter": "Butter",
  "Cream": "Sahne",
  "Oak": "Eiche",
  "Vanilla": "Vanille",
  "Clove": "Nelke",
  "Nutmeg": "Muskatnuss",
  "Coconut": "Kokos",
  "Butterscotch": "Butterkaramell",
  "Cedar": "Zeder",
  "Charred wood": "Angekohltes Holz",
  "Smoke": "Rauch",
  "Chocolate": "Schokolade",
  "Coffee": "Kaffee",
  "Fermentation Markers": "Gärungsnoten",
  "Pear drop": "Birnenbonbon",
  "Bubblegum": "Kaugummi",
  "Kirsch": "Kirschwasser",
  "Candied fruit": "Kandierte Frucht",
  "White Wine Development": "Weißweinentwicklung",
  "Dried apricot": "Getrocknete Aprikose",
  "Dried apple": "Getrockneter Apfel",
  "Marmalade": "Marmelade",
  "Petrol": "Petrol",
  "Kerosene": "Kerosin",
  "Honey": "Honig",
  "Hay": "Heu",
  "Mushroom": "Pilz",
  "Red Wine Development": "Rotweinentwicklung",
  "Fig": "Feige",
  "Prune": "Backpflaume",
  "Raisin": "Rosine",
  "Dried cranberry": "Getrocknete Cranberry",
  "Cooked plum": "Gekochte Pflaume",
  "Leather": "Leder",
  "Earth": "Erde",
  "Meat": "Fleisch",
  "Tobacco": "Tabak",
  "Wet leaves": "Nasses Laub",
  "Forest floor": "Waldboden",
  "Bottle Spice & Savoury": "Flaschenwürze & herzhaft",
  "Ginger": "Ingwer",
  "Nutty": "Nussig",
  "Truffle": "Trüffel",
  "Game": "Wild",
  "Tar": "Teer",
  "Oxidative": "Oxidativ",
  "Almond": "Mandel",
  "Marzipan": "Marzipan",
  "Hazelnut": "Haselnuss",
  "Walnut": "Walnuss",
  "Toffee": "Toffee",
  "Caramel": "Karamell"
};

const supportedLanguages: Language[] = ["en", "de"];
const currentLanguage = readLanguagePreference();

document.documentElement.lang = currentLanguage;
document.title = currentLanguage === "de" ? "WSET Weinnotizen" : "WSET Wine Notes";
setMetaContent("application-name", t("Wine Notes"));
setMetaContent("apple-mobile-web-app-title", t("Wine Notes"));

function readLanguagePreference(): Language {
  const savedLanguage = localStorage.getItem(languageStorageKey);

  if (savedLanguage === "de" || savedLanguage === "en") {
    return savedLanguage;
  }

  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

function setMetaContent(name: string, content: string): void {
  document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.setAttribute("content", content);
}

function t(text: string): string {
  return currentLanguage === "de" ? germanTranslations[text] ?? text : text;
}

function option(value: string, label = value): FieldOption {
  return {
    label: t(label),
    value
  };
}

const appearanceOptions = [option("Clear", "Clear appearance"), ...["Pale", "Medium", "Deep"].map((value) => option(value))];

const intensityOptions = ["Light", "Medium(-)", "Medium", "Medium(+)", "Pronounced"].map((value) => option(value));

const acidTanninBodyOptions = ["Low", "Medium(-)", "Medium", "Medium(+)", "High"].map((value) => option(value));

const wineTypeOptions = ["White", "Red", "Rose"].map((value) => option(value.toLowerCase(), value));

const wineColorOptions: Record<string, FieldOption[]> = {
  white: ["Lemon-green", "Lemon", "Gold", "Amber", "Brown"].map((value) => option(value)),
  red: ["Purple", "Ruby", "Garnet", "Tawny", "Brown"].map((value) => option(value)),
  rose: ["Pink", "Salmon", "Orange", "Onion skin"].map((value) => option(value))
};

const scoreOptions: FieldOption[] = [
  option("1", "Low"),
  option("2", "Medium(-)"),
  option("3", "Medium"),
  option("4", "Medium(+)"),
  option("5", "High")
];

const aromaCategories: AromaCategory[] = [
  {
    id: "primary",
    label: t("Primary"),
    groups: [
      {
        title: t("Floral"),
        notes: ["Blossom", "Elderflower", "Honeysuckle", "Jasmine", "Rose", "Violet"]
      },
      {
        title: t("Green Fruit"),
        notes: ["Apple", "Green apple", "Pear", "Gooseberry", "Quince", "Grape"]
      },
      {
        title: t("Citrus Fruit"),
        notes: ["Grapefruit", "Lemon", "Lime", "Orange", "Lemon peel", "Orange peel"]
      },
      {
        title: t("Stone & Tropical"),
        notes: ["Peach", "Apricot", "Nectarine", "Banana", "Lychee", "Mango", "Melon", "Passion fruit", "Pineapple"]
      },
      {
        title: t("Red Fruit"),
        notes: ["Redcurrant", "Cranberry", "Raspberry", "Strawberry", "Red cherry", "Red plum"]
      },
      {
        title: t("Black Fruit"),
        notes: ["Blackcurrant", "Blackberry", "Bramble", "Blueberry", "Black cherry", "Black plum"]
      },
      {
        title: t("Fruit Condition"),
        notes: ["Unripe fruit", "Ripe fruit", "Cooked fruit", "Baked fruit", "Dried fruit", "Jamminess"]
      },
      {
        title: t("Herbal & Herbaceous"),
        notes: ["Green bell pepper", "Grass", "Tomato leaf", "Asparagus", "Blackcurrant leaf", "Eucalyptus", "Mint", "Fennel", "Dill", "Dried herbs"]
      },
      {
        title: t("Spice & Other"),
        notes: ["Black pepper", "White pepper", "Liquorice", "Cinnamon", "Wet stones", "Flint", "Candy"]
      }
    ]
  },
  {
    id: "secondary",
    label: t("Secondary"),
    groups: [
      {
        title: t("Yeast & Lees"),
        notes: ["Biscuit", "Bread", "Toast", "Pastry", "Brioche", "Bread dough", "Cheese", "Yogurt"]
      },
      {
        title: t("Malolactic"),
        notes: ["Butter", "Cream", "Cheese", "Yogurt"]
      },
      {
        title: t("Oak"),
        notes: ["Vanilla", "Clove", "Nutmeg", "Coconut", "Butterscotch", "Cedar", "Charred wood", "Smoke", "Chocolate", "Coffee"]
      },
      {
        title: t("Fermentation Markers"),
        notes: ["Banana", "Pear drop", "Bubblegum", "Kirsch", "Candied fruit"]
      }
    ]
  },
  {
    id: "tertiary",
    label: t("Tertiary"),
    groups: [
      {
        title: t("White Wine Development"),
        notes: ["Dried apricot", "Dried apple", "Marmalade", "Petrol", "Kerosene", "Honey", "Hay", "Mushroom"]
      },
      {
        title: t("Red Wine Development"),
        notes: ["Fig", "Prune", "Raisin", "Dried cranberry", "Cooked plum", "Leather", "Earth", "Meat", "Tobacco", "Wet leaves", "Forest floor"]
      },
      {
        title: t("Bottle Spice & Savoury"),
        notes: ["Cinnamon", "Ginger", "Nutmeg", "Toast", "Nutty", "Truffle", "Game", "Tar"]
      },
      {
        title: t("Oxidative"),
        notes: ["Almond", "Marzipan", "Hazelnut", "Walnut", "Chocolate", "Coffee", "Toffee", "Caramel"]
      }
    ]
  }
];

const sections: Section[] = [
  {
    title: t("Wine"),
    subtitle: t("Set the sample context before assessing it."),
    fields: [
      { id: "wineName", label: t("Wine"), placeholder: t("Producer, cuvee, vintage") },
      { id: "wineType", label: t("Type"), type: "select", options: wineTypeOptions },
      { id: "region", label: t("Region"), placeholder: t("Country, region, appellation") },
      { id: "grape", label: t("Grape variety"), placeholder: t("Variety or blend") }
    ]
  },
  {
    title: t("Appearance"),
    subtitle: t("Clarity, intensity, colour, and observable development."),
    fields: [
      { id: "clarity", label: t("Clarity"), type: "select", options: appearanceOptions },
      { id: "appearanceIntensity", label: t("Intensity"), type: "select", options: appearanceOptions },
      { id: "colour", label: t("Colour"), type: "select" },
      { id: "appearanceNotes", label: t("Notes"), type: "textarea", placeholder: t("Rim variation, legs, deposits") }
    ]
  },
  {
    title: t("Nose"),
    subtitle: t("Condition, intensity, aroma characteristics, and development."),
    fields: [
      { id: "condition", label: t("Condition"), placeholder: t("Clean, unclean") },
      { id: "noseIntensity", label: t("Intensity"), type: "select", options: intensityOptions },
      { id: "aromas", label: t("Aromas"), type: "aroma", placeholder: t("Fruit, floral, spice, oak, earth, tertiary") }
    ]
  },
  {
    title: t("Palate"),
    subtitle: t("Structure, flavour intensity, finish, and balance."),
    fields: [
      { id: "sweetness", label: t("Sweetness"), type: "select", options: acidTanninBodyOptions },
      { id: "acidity", label: t("Acidity"), type: "select", options: acidTanninBodyOptions },
      { id: "tannin", label: t("Tannin"), type: "select", options: acidTanninBodyOptions },
      { id: "body", label: t("Body"), type: "select", options: acidTanninBodyOptions },
      { id: "alcohol", label: t("Alcohol"), type: "select", options: acidTanninBodyOptions },
      { id: "flavours", label: t("Flavours"), type: "textarea", placeholder: t("Confirm aromas and note palate-specific flavours") },
      { id: "finish", label: t("Finish"), placeholder: t("Short, medium, long") }
    ]
  },
  {
    title: t("Conclusion"),
    subtitle: t("BLIK assessment is calculated from balance, length, intensity, and complexity."),
    fields: [
      { id: "balanceScore", label: t("Balance"), type: "select", options: scoreOptions },
      { id: "lengthScore", label: t("Length"), type: "select", options: scoreOptions },
      { id: "intensityScore", label: t("Intensity"), type: "select", options: scoreOptions },
      { id: "complexityScore", label: t("Complexity"), type: "select", options: scoreOptions },
      { id: "score", label: t("BLIK quality"), type: "score" },
      { id: "quality", label: t("Quality"), placeholder: t("Acceptable, good, very good, outstanding") },
      { id: "readiness", label: t("Readiness"), placeholder: t("Drink now, suitable for ageing") },
      { id: "conclusionNotes", label: t("Notes"), type: "textarea", placeholder: t("Balance, length, intensity, complexity") }
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
                ${t(note)}
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
        <span class="aroma-count" id="aromaCount">${t("No aromas selected")}</span>
      </div>

      <div class="aroma-tabs" role="tablist" aria-label="${t("Aroma categories")}">
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
        <span class="selected-empty">${t("Selected aromas will appear here")}</span>
      </div>

      <label class="aroma-notes" for="${field.id}">
        <span>${t("Notes")}</span>
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
          <span id="scoreLabel">${t("Select BLIK criteria")}</span>
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
      ?.map((fieldOption) => `<option value="${fieldOption.value}">${fieldOption.label}</option>`)
      .join("");

    return `
      <label class="glass-field" for="${field.id}" data-field-id="${field.id}">
        <span>${field.label}</span>
        <select class="glass-control" id="${field.id}" name="${field.id}">
          <option value="">${field.id === "colour" ? t("Select type first") : t("Select")}</option>
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
      <div class="header-copy">
        <p class="eyebrow">${t("WSET tasting note")}</p>
        <h1>${t("Wine Notes")}</h1>
      </div>
      <label class="language-field" for="languageSelect">
        <span>${t("Language")}</span>
        <select class="glass-control language-select" id="languageSelect" name="language">
          ${supportedLanguages.map((language) => `
            <option value="${language}" ${language === currentLanguage ? "selected" : ""}>
              ${language === "de" ? t("German") : t("English")}
            </option>
          `).join("")}
        </select>
      </label>
    </header>

    <form class="notes-form" id="notesForm">
      ${sections.map(sectionTemplate).join("")}
      <div class="glass-action-bar">
        <p class="save-status" id="saveStatus" aria-live="polite">${t("Ready to save in Apple Notes")}</p>
        <button class="glass-button glass-button-secondary" type="reset">${t("Clear form")}</button>
        <button class="glass-button glass-button-primary" id="saveNote" type="button">${t("Save to Apple Notes")}</button>
      </div>
    </form>
  </main>
`;

const form = document.querySelector<HTMLFormElement>("#notesForm")!;
const languageSelect = document.querySelector<HTMLSelectElement>("#languageSelect")!;
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
  ].map((fieldOption) => [fieldOption.value, fieldOption.label])
);

function updateStatus(message: string): void {
  saveStatus.textContent = message;
}

function appleNotesReadyMessage(): string {
  return canOpenAppleNotesShare()
    ? t("Ready to save in Apple Notes")
    : t("Open on an Apple device with sharing to save in Notes.");
}

function configureAppleNotesSaveButton(): void {
  const canShareToNotes = canOpenAppleNotesShare();
  saveButton.disabled = !canShareToNotes;
  saveButton.title = canShareToNotes
    ? t("Open the Apple share sheet and choose Notes to insert note text")
    : t("Apple Notes saving requires an Apple device with Web Share support");
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

function noteTitle(note: Record<string, string>): string {
  return note.wineName?.trim() || t("Wine Note");
}

function formatFieldValue(id: string, value: string): string {
  if (id === "aromaChips") {
    return value.split("|").filter(Boolean).map((note) => t(note)).join(", ");
  }

  return selectLabels.get(value) ?? value;
}

function buildNoteExportText(note: Record<string, string>): string {
  const exportedAt = new Intl.DateTimeFormat(currentLanguage, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date());
  const lines = [noteTitle(note), `${t("Exported")} ${exportedAt}`, ""];

  sections.forEach((section) => {
    const sectionLines: string[] = [];

    section.fields.forEach((field) => {
      const value = note[field.id]?.trim();

      if (value) {
        sectionLines.push(`${fieldLabels.get(field.id) ?? field.label}: ${formatFieldValue(field.id, value)}`);
      }

      if (field.id === "aromas") {
        const selectedAromasValue = note.aromaChips?.trim();

        if (selectedAromasValue) {
          sectionLines.push(`${t("Selected aromas")}: ${formatFieldValue("aromaChips", selectedAromasValue)}`);
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
    updateStatus(t("Open on an Apple device with sharing to save in Notes."));
    return;
  }

  const text = buildNoteExportText(note);
  const title = noteTitle(note);

  try {
    await navigator.share({
      title,
      text
    });

    updateStatus(t("Choose Notes in the share sheet to insert the note text."));
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      updateStatus(t("Not saved. Choose Notes to save the note."));
      return;
    }

    updateStatus(t("Apple Notes export is unavailable in this browser."));
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
    <option value="">${wineType ? t("Select colour") : t("Select type first")}</option>
    ${options.map((fieldOption) => `<option value="${fieldOption.value}">${fieldOption.label}</option>`).join("")}
  `;

  const canKeepCurrent = keepCurrent && options.some((fieldOption) => fieldOption.value === currentColour);
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

function blikQualityLabel(average: number): string {
  if (average >= 4.5) {
    return t("Outstanding");
  }

  if (average >= 3.5) {
    return t("Very good");
  }

  if (average >= 2.5) {
    return t("Good");
  }

  if (average >= 1.5) {
    return t("Acceptable");
  }

  return t("Poor");
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
    scoreLabel.textContent = `${assessedValues.length}/${scoreCriteria.length} ${t("criteria selected")}`;
    return;
  }

  const total = assessedValues.reduce((sum, value) => sum + value, 0);
  const average = total / scoreCriteria.length;
  const quality = blikQualityLabel(average);
  scoreInput.value = quality;
  scoreValue.textContent = quality;
  scoreLabel.textContent = `${t("BLIK average")}: ${average.toFixed(1)}/5`;
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
    ? t("No aromas selected")
    : `${selected.length} ${t("selected")}`;

  selectedAromas.innerHTML = selected.length === 0
    ? `<span class="selected-empty">${t("Selected aromas will appear here")}</span>`
    : selected
      .map(
        (note) => `
          <button class="selected-aroma" type="button" data-remove-aroma="${note}" aria-label="${t("Remove")} ${t(note)}">
            ${t(note)}
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
      ? t("Restored local draft. Save to Apple Notes when ready.")
      : appleNotesReadyMessage());
  } catch {
    localStorage.removeItem(storageKey);
  }
}

languageSelect.addEventListener("change", () => {
  const selectedLanguage = languageSelect.value;

  if (selectedLanguage !== "de" && selectedLanguage !== "en") {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(readForm()));
  localStorage.setItem(languageStorageKey, selectedLanguage);
  window.location.reload();
});

saveButton.addEventListener("click", () => {
  void saveNote();
});
form.addEventListener("reset", () => {
  localStorage.removeItem(storageKey);
  window.setTimeout(() => {
    updateWineTypeDependentFields();
    updateScore();
    clearAromaSelection();
  });
  updateStatus(t("Cleared"));
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
