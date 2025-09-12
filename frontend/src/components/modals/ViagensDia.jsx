import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function ViagensDoDiaModal() {
  return (
    <Table className="min-w-full border border-border">
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead className="text-foreground">ID</TableHead>
          <TableHead className="text-foreground">Paciente</TableHead>
          <TableHead className="text-foreground">Destino</TableHead>
          <TableHead className="text-foreground">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-foreground">001</TableCell>
          <TableCell className="text-foreground">Maicon</TableCell>
          <TableCell className="text-foreground">Hospital</TableCell>
          <TableCell className="text-foreground font-medium">Concluída</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-foreground">002</TableCell>
          <TableCell className="text-foreground">Kaique</TableCell>
          <TableCell className="text-foreground">Clínica</TableCell>
          <TableCell className="text-foreground font-medium">Concluída</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
