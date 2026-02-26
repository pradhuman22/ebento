import { listPaymentMethod } from "../lib/paymentRepository";
import PaymentCardRemove from "./payment-card-remove";

const PaymentCardList = async ({ id }: { id: string }) => {
  const { cards } = await listPaymentMethod(id);
  if (cards.length === 0)
    return (
      <p className="text-muted-foreground mb-2 text-sm">No saved cards yet.</p>
    );
  return (
    <ul className="mb-4 space-y-2">
      {cards.map((card) => (
        <li
          key={card.id}
          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
        >
          <span>
            {card.brand.toUpperCase()} •••• {card.last4}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              Expires {card.expMonth.toString().padStart(2, "0")}/{card.expYear}
            </span>
            <PaymentCardRemove
              stripeCustomerId={id}
              paymentMethodId={card.id}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PaymentCardList;
