import { Chip } from "@nextui-org/react";
import React from "react";

type Status =
  | "completed"
  | "pending"
  | "cancelled"
  | "fail"
  | "success"
  | "muted";

const statusColorMap: Record<
  Status,
  "danger" | "warning" | "success" | "default"
> = {
  completed: "success",
  pending: "warning",
  cancelled: "danger",
  fail: "danger",
  success: "success",
  muted: "default",
};

export const StatusBadge = ({ status }: { status: Status }) => {
  const color = statusColorMap[status as keyof typeof statusColorMap];

  return (
    <Chip
      className="capitalize border-none gap-1 text-default-600"
      size="sm"
      variant="flat"
      color={color}
    >
      {status}
    </Chip>
  );
};
