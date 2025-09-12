import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function ChamadosPendentesModal() {
  return (
    <Table className="min-w-full border border-border">
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead className="text-foreground">ID</TableHead>
          <TableHead className="text-foreground">Paciente</TableHead>
          <TableHead className="text-foreground">Origem</TableHead>
          <TableHead className="text-foreground">Destino</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-foreground">003</TableCell>
          <TableCell className="text-foreground">Ana</TableCell>
          <TableCell className="text-foreground">Residência</TableCell>
          <TableCell className="text-foreground">Hospital</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-foreground">004</TableCell>
          <TableCell className="text-foreground">Pedro</TableCell>
          <TableCell className="text-foreground">Clínica</TableCell>
          <TableCell className="text-foreground">Residência</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
