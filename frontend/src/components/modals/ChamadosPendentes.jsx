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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Origem</TableHead>
          <TableHead>Destino</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>003</TableCell>
          <TableCell>Ana</TableCell>
          <TableCell>Residência</TableCell>
          <TableCell>Hospital</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>004</TableCell>
          <TableCell>Pedro</TableCell>
          <TableCell>Clínica</TableCell>
          <TableCell>Residência</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
