export type SpreadSheetSource = {
  pageTitle: string;
  sectionTitle: string;
  ja: string;
  en: string;
  who: string;
};

export type SpreadSheetDirLang = {
  ja: string;
  en: string;
  who: string;
};

export type SpreadSheetDir = {
  title: string;
  children: SpreadSheetDir[];
  sentences: SpreadSheetDirLang[];
};
