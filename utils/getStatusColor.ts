export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-500";
        case "challenge":
        return "bg-yellow-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      case "canceled":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
};

export const  getProgressColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "success":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "failed":
      return "bg-red-500";
    case "canceled":
      return "bg-gray-500";
    default:
      return "bg-blue-500";
  }
}
