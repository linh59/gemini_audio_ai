
export type VocabItem = {
  id?: string;
  term: string;
  partOfSpeech?: string;
  meaningEn?: string;
  meaningVi?: string;
  example?: string;
  position?: PositionVocab
  color?: string;
  ipa?: string;
};

export type PositionVocab = {
  x: number;
  y: number;
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

export type VocabulariesProps = {
  vocabs: VocabItem[],
  onPositionChange: (id: string, pos: PositionVocab) => void;
  onDelete?: (id: string) => Promise<boolean>;
  onUpdate?: (id: string, data: VocabItem) => Promise<boolean>;

}

export type VocabItemProps = {
  vocab: VocabItem,
  domRef?: (el: HTMLDivElement | null) => void;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onDelete?: (id: string) => Promise<boolean>;
  onUpdate?: (id: string, data: VocabItem) => Promise<boolean>;

}


export type UpdateVocabProps = {
  vocab: VocabItem,
  onUpdate?: (id: string, data: VocabItem) => Promise<boolean>;
}

export type AddVocabProps = {
  onAddSuccess?: (data: VocabItem) => Promise<boolean>;
}