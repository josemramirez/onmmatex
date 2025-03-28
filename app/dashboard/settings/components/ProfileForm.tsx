"use client";

import SubmitButton from "@/components/shared/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { onUpdateProfile } from "../actions";
import { useEffect } from "react";
import { type TypeOptions, toast } from "react-toastify";

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [state, formAction] = useFormState(onUpdateProfile, undefined);

  useEffect(() => {
    if (state) {
      toast(state.message, { type: state.type as TypeOptions });

      if (state.type === "success") {
        update(state.user);
      }
    }
  }, [state, update]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="mx-auto max-w-md p-6">
        <div className="flex flex-col space-y-1.5 mb-8">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Profile Name
          </h3>
          <p className="text-sm text-muted-foreground">
            Update your profile name
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name || ""}
              required
            />
          </div>
          <SubmitButton title="Update" />
        </form>
      </div>
    </div>
  );
};
export default ProfileForm;
