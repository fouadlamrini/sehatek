import Badge from "../ui/Badge";
import { ORDER_STATUSES, ORDER_STATUS_COLORS } from "../../constants";

const labelByValue = ORDER_STATUSES.reduce(
  (acc, status) => ({ ...acc, [status.value]: status.label }),
  {}
);

const OrderStatusBadge = ({ status }) => (
  <Badge color={ORDER_STATUS_COLORS[status] ?? "gray"}>
    {labelByValue[status] ?? status}
  </Badge>
);

export default OrderStatusBadge;
