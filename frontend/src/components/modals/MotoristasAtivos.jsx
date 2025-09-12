import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function MotoristasAtivosModal() {
  return (
    <Table className="min-w-full border border-border">
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead className="text-foreground">Nome</TableHead>
          <TableHead className="text-foreground">Turno</TableHead>
          <TableHead className="text-foreground">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-foreground">Carlos</TableCell>
          <TableCell className="text-foreground">Manhã</TableCell>
          <TableCell className="text-foreground font-medium">Ativo</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-foreground">Mariana</TableCell>
          <TableCell className="text-foreground">Tarde</TableCell>
          <TableCell className="text-foreground font-medium">Ativo</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
