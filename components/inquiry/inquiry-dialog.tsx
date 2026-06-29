"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryInput } from "@/lib/validators/inquiry";
import { createInquiry } from "@/lib/actions/inquiry";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function InquiryDialog({
  propertyId,
  propertyTitle,
  defaultName = "",
  defaultEmail = "",
}: {
  propertyId: string;
  propertyTitle: string;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      propertyId,
      name: defaultName,
      email: defaultEmail,
      phone: "",
      message: `I'm interested in "${propertyTitle}". Please get in touch.`,
      visitDate: "",
    },
  });

  const onSubmit = async (values: InquiryInput) => {
    setServerError(null);
    const res = await createInquiry(values);
    if ("ok" in res) setDone(true);
    else setServerError(res.error);
  };

  if (done) {
    return (
      <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">
        <p className="font-medium text-accent">Request sent ✓</p>
        <p className="mt-1 text-muted">
          Our team will reach out shortly to confirm your visit.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-full border border-border px-5 py-3 text-center font-medium transition-colors hover:bg-card"
      >
        Schedule a visit
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 text-left" noValidate>
      {serverError && (
        <p role="alert" className="text-sm text-red-500">
          {serverError}
        </p>
      )}
      <div>
        <input placeholder="Your name" className={fieldClass} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          className={fieldClass}
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <input
        type="tel"
        placeholder="Phone (optional)"
        className={fieldClass}
        {...register("phone")}
      />
      <div>
        <label className="mb-1 block text-xs text-muted">Preferred visit date</label>
        <input type="date" className={fieldClass} {...register("visitDate")} />
      </div>
      <div>
        <textarea
          rows={3}
          placeholder="Message"
          className={fieldClass}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-full bg-accent px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Send request"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-border px-4 py-2.5 text-sm transition-colors hover:bg-card"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
