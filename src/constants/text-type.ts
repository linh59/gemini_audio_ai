export type VocabItem = {
  id: number;
  term: string;
  partOfSpeech?: string;
  meaningEn: string;
  meaningVi: string;
  example?: string;
  position?: PositionVocab
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

export type VocabItemProps = {
  vocab: VocabItem,
  domRef?: (el: HTMLDivElement | null) => void;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}

export type VocabsRef = {
  style: any,
}