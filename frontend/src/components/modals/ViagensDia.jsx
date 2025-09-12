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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Destino</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>001</TableCell>
          <TableCell>Maicon</TableCell>
          <TableCell>Hospital</TableCell>
          <TableCell>Concluída</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>002</TableCell>
          <TableCell>Kaique</TableCell>
          <TableCell>Clínica</TableCell>
          <TableCell>Concluída</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
