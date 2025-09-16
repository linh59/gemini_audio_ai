'use client'
import { Button } from "@/components/ui/button";
import type { VocabItem } from "@/constants/text-type";
import { useEffect, useReducer } from "react";

type VocabPaginationProps = {
  vocabs: VocabItem[];
  itemPerPage?: number;
};

type ActionTypes =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_PAGE'; page: number };

function reducerPagination(state: number, action: ActionTypes) {
  switch (action.type) {
    case 'NEXT':      return state + 1;
    case 'PREV':      return state - 1;
    case 'SET_PAGE':  return action.page;
    default:          return state;
  }
}

export function VocabPagination({ vocabs, itemPerPage = 10 }: VocabPaginationProps) {
  const [currentPage, dispatch] = useReducer(reducerPagination, 1);

  const totalItems  = vocabs.length;
  const pages       = Math.max(1, Math.ceil(totalItems / itemPerPage));

  useEffect(() => {
    if (currentPage > pages) dispatch({ type: 'SET_PAGE', page: pages });
    if (currentPage < 1)     dispatch({ type: 'SET_PAGE', page: 1 });
  }, [currentPage, pages]);

  if (totalItems === 0) return null; 

  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={() => dispatch({ type: 'SET_PAGE', page: Math.max(1, currentPage - 1) })}
          disabled={currentPage <= 1}             
        >
          Previous
        </Button>

        {currentPage}/{pages}

        <Button
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={() => dispatch({ type: 'SET_PAGE', page: Math.min(pages, currentPage + 1) })}
          disabled={currentPage >= pages}           
        >
          Next
        </Button>
      </div>

      <div>{itemPerPage}/page</div>
      <div>{totalItems} items</div>
      <div>{pages} pages</div>
    </div>
  );
}
