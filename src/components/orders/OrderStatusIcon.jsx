import {
  Clock3,
  CogIcon,
  PackageCheck,
  TruckIcon,
  XCircle,
} from "lucide-react";

const statusIcons = {
  pending: Clock3,
  processing: CogIcon,
  shipped: TruckIcon,
  delivered: PackageCheck,
  completed: PackageCheck,
  cancelled: XCircle,
};

export default function OrderStatusIcon({ status, size = 12 }) {
  const Icon = statusIcons[status?.toLowerCase()];
  return Icon ? <Icon size={size} aria-hidden="true" /> : null;
}
