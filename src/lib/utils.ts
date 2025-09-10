import { VocabItem } from "@/constants/text-type"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getVocabsLocal = () => {
  try {
    const vocabs = localStorage.getItem('vocab')
    return vocabs ? JSON.parse(vocabs) : []
    
  } catch (error) {
    return []
  }

}

export const setVocabsLocal = (vocabList: VocabItem[]) => {
  return localStorage.setItem('vocab', JSON.stringify(vocabList))

}