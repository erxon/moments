"use client";

import ImageType from "@/lib/types/image.types";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobeIcon, Lock, UsersRound } from "lucide-react";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import {
  Description,
  Label as LabelField,
  Title,
} from "../../components/form-fields";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  label: z.string().min(1, {
    message: "Label is required",
  }),
  visibility: z.enum(["public", "private", "followers"]),
});
export default function EditDialogForm({
  open,
  setOpenEditDialogForm,
  image,
  gallery_id,
}: {
  setOpenEditDialogForm: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  image: ImageType;
  gallery_id: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: image.title,
      description: image.description,
      label: image.label,
      visibility: image.visibility,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await axios.put(`/api/image/${image.id}`, values);
      if (result.status === 200) {
        mutate(`/api/gallery/${gallery_id}/images`);
        setIsLoading(false);
        setOpenEditDialogForm(false);
        triggerSuccessToast(result.data);
      } else {
        triggerErrorToast("Error updating image");
      }
    } catch (error) {
      if (error instanceof Error) {
        triggerErrorToast(error.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpenEditDialogForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit image information</DialogTitle>
          <DialogDescription>
            Here you can edit the information of the image.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                <Title name="title" form={form} />
                <Description name="description" form={form} />
                <LabelField name="label" form={form} />
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-2">Visibility</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex gap-1 items-center">
                                <GlobeIcon className="w-4 h-4" />
                                <p>Public</p>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex gap-1 items-center">
                                <Lock className="w-4 h-4" />
                                <p>Private</p>
                              </div>
                            </SelectItem>
                            <SelectItem value="followers">
                              <div className="flex gap-1 items-center">
                                <UsersRound className="w-4 h-4" />
                                <p>Followers</p>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? "Save" : "Saving..."}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
