import { IconReceipt } from "@tabler/icons-react";
import { getPrivatePaymentHistory } from "../lib/paymentRepository";

// Native formatter (defined outside the component for performance)
const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

const PaymentHistory = async ({ id }: { id: string | undefined | null }) => {
  if (!id) return <div>No payment account found.</div>;
  const payments = await getPrivatePaymentHistory(id);
  if (payments.length === 0) {
    return (
      <div className="grid justify-items-center gap-4 py-8">
        <div>
          <IconReceipt className="stroke-muted-foreground size-40 stroke-1" />
        </div>
        <div className="grid justify-items-center gap-4">
          <h3 className="text-2xl font-bold">No Payment</h3>
          <p className="text-sm">Your payment will appear here.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Payment ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Stripe timestamps are in seconds; JS Date needs milliseconds */}
                  {dateFormatter.format(new Date(payment.created * 1000))}
                </td>
                <td className="px-6 py-4 font-medium">
                  {currencyFormatter.format(payment.amount)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      payment.status === "succeeded"
                        ? "bg-emerald-100 text-emerald-700"
                        : payment.status === "canceled"
                          ? "bg-red-100 text-red-700" // Red for canceled
                          : payment.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                  {payment.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
