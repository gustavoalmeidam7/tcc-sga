import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function AmbulanciasLivresModal() {
  return (
    <Table className="min-w-full border border-border">
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead className="text-foreground">Placa</TableHead>
          <TableHead className="text-foreground">Modelo</TableHead>
          <TableHead className="text-foreground">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-foreground">ABC-1234</TableCell>
          <TableCell className="text-foreground">Mercedes-Benz Sprinter</TableCell>
          <TableCell className="text-foreground font-medium">Disponível</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-foreground">DEF-5678</TableCell>
          <TableCell className="text-foreground">Renault Master</TableCell>
          <TableCell className="text-foreground font-medium">Disponível</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
