import { Dispatch, SetStateAction } from "react";

export type VocabItem = {
  id: string;
  term: string;
  partOfSpeech?: string;
  meaningEn?: string;
  meaningVi?: string;
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

export type XY = { x: number; y: number };

export type VocabulariesProps = {
  vocabs: VocabItem[],
  // setVocabs: Dispatch<SetStateAction<VocabItem[]>>;
   onPositionChange: (id: VocabItem["id"], pos: XY) => void;
}