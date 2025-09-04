export type VocabItem = {
  term: string;
  partOfSpeech?: string;
  meaningEn: string;
  meaningVi: string;
  example?: string;
};
export type EchoingTextResponse = {
  ssml: string;                
  vocab: VocabItem[];
};
export type VocabTableProps = {
  data: VocabItem[];
  isLoading?: boolean;
  total?: number;
}