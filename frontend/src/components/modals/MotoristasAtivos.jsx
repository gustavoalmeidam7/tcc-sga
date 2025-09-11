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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Turno</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Carlos</TableCell>
          <TableCell>Manhã</TableCell>
          <TableCell>Ativo</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mariana</TableCell>
          <TableCell>Tarde</TableCell>
          <TableCell>Ativo</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
