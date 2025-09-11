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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Placa</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>ABC-1234</TableCell>
          <TableCell>Mercedes-Benz Sprinter</TableCell>
          <TableCell>Disponível</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>DEF-5678</TableCell>
          <TableCell>Renault Master</TableCell>
          <TableCell>Disponível</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
