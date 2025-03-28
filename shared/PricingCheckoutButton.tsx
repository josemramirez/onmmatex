"use client";

import SubmitButton from "../shared/SubmitButton";
import { useFormState } from "react-dom";
import { createCheckout } from "@/actions/stripe-actions";
import { useEffect } from "react";
import { type TypeOptions, toast } from "react-toastify";

type PricingProps = {
  title: string;
  priceId: string;
};

const PricingCheckoutButton = ({ title, priceId }: PricingProps) => {
  const [state, formAction] = useFormState(createCheckout, undefined);

  useEffect(() => {
    if (state) {
      toast(state.message, { type: state.type as TypeOptions });
    }
  }, [state]);

  return (
    <form action={formAction.bind(null, priceId!)} className="w-full">
      <SubmitButton className="w-full" title={title} />
    </form>
  );
};

export default PricingCheckoutButton;
