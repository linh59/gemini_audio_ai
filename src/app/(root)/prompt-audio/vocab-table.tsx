import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { VocabItem, VocabTableProps } from "@/constants/text-type";

const VocabTable = (props: VocabTableProps) => {
  return (
    <Table className="border-collapse-separate border-spacing-0">
      <TableHeader>
        <TableRow className="border-b border-border/40">
          <TableHead className="text-left font-semibold">Work/Collocations</TableHead>
          <TableHead className="text-left font-semibold">Part of speech</TableHead>
          <TableHead className="text-left font-semibold  md:table-cell">VI</TableHead>
          <TableHead className="text-left font-semibold  lg:table-cell">Example</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-border/40">
        {props.isLoading || !props.data ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <>
            {props.data.map((item, index: number) => (
              <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-semibold text-primary"> {item.term}</TableCell>

                <TableCell className="font-medium">{item.partOfSpeech}  </TableCell>
                <TableCell className="font-medium">{item.meaningVi}  </TableCell>
                <TableCell className="font-medium">{item.example}  </TableCell>

              </TableRow>
            ))}
          </>
        )
        }

      </TableBody>
    </Table>
  )
}

export default VocabTable