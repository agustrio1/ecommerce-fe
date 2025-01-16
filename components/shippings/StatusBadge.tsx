import { ShipmentStatus } from "@/types/shipping.type";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  [ShipmentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [ShipmentStatus.PROCESSING]: "bg-blue-100 text-blue-800",
  [ShipmentStatus.SHIPPED]: "bg-purple-100 text-purple-800",
  [ShipmentStatus.DELIVERED]: "bg-green-100 text-green-800",
  [ShipmentStatus.CANCELED]: "bg-red-100 text-red-800",
};

export const StatusBadge = ({ status }: { status: ShipmentStatus }) => {
  return (
    <Badge className={`${statusColors[status]} font-semibold`}>
      {status}
    </Badge>
  );
};

