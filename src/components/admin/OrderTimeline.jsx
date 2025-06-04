import { CheckIcon, TruckIcon, PackageIcon, ClockIcon } from "lucide-react";

const timelineSteps = [
  {
    id: "created",
    name: "Order Placed",
    description: "Order was received and is being processed",
    icon: ClockIcon,
    iconBackground: "bg-blue-500",
  },
  {
    id: "processing",
    name: "Processing",
    description: "Order is being prepared for shipping",
    icon: PackageIcon,
    iconBackground: "bg-amber-500",
  },
  {
    id: "shipped",
    name: "Shipped",
    description: "Order has been shipped and is on its way",
    icon: TruckIcon,
    iconBackground: "bg-purple-500",
  },
  {
    id: "delivered",
    name: "Delivered",
    description: "Order has been delivered successfully",
    icon: CheckIcon,
    iconBackground: "bg-green-500",
  },
];

export default function OrderTimeline({ status, createdAt }) {
  const getCompletedSteps = () => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return ["created", "processing", "shipped", "delivered"];
      case "shipped":
        return ["created", "processing", "shipped"];
      case "pending":
        return ["created", "processing"];
      default:
        return ["created"];
    }
  };

  const completedSteps = getCompletedSteps();
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timelineSteps.map((step, stepIdx) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive =
            completedSteps[completedSteps.length - 1] === step.id;

          return (
            <li key={step.id}>
              <div className="relative pb-8">
                {stepIdx !== timelineSteps.length - 1 ? (
                  <span
                    className={`absolute left-4 top-4 -ml-px h-full w-0.5 ${
                      isCompleted ? "bg-primary" : "bg-slate-200"
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`${
                        isCompleted ? step.iconBackground : "bg-slate-200"
                      } h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}
                    >
                      <step.icon
                        className={`h-4 w-4 ${
                          isCompleted ? "text-white" : "text-slate-400"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-primary"
                            : isCompleted
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step.name}
                      </p>
                      <p
                        className={`mt-0.5 text-xs ${
                          isCompleted ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-slate-500">
                      {isCompleted && (
                        <time dateTime={createdAt}>
                          {stepIdx === 0 ? formattedDate : ""}
                        </time>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
