"use client";

import {
  EllipsisIcon,
  GlobeIcon,
  Image as ImageIcon,
  Pencil,
  TagIcon,
  Trash,
  UsersRound,
  Lock,
} from "lucide-react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/swr.util";
import ImageType from "@/lib/types/image.types";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import VisibilitySelection from "../components/visibility-selection";
import { Description, Label, Title } from "../components/form-fields";
import { Label as FormLabel } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function LoadImages({ gallery_id }: { gallery_id: string }) {
  const [openEditDialogForm, setOpenEditDialogForm] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<ImageType | null>(null);
  const { data, error, isLoading } = useSWR(
    `/api/gallery/${gallery_id}/images`,
    fetcher
  );

  if (error)
    return (
      <div>
        <NoImages />
      </div>
    );
  if (isLoading)
    return (
      <div>
        <div className="columns-1 md:columns-3 gap-4">
          <Skeleton className="h-[300px] max-w-full object-full" />
          <Skeleton className="h-[300px] max-w-full object-full" />
          <Skeleton className="h-[300px] max-w-full object-full" />
        </div>
      </div>
    );

  const images = data as ImageType[];

  return (
    <>
      <div className="columns-1 md:columns-3 gap-4">
        {data.map((image: ImageType) => {
          const createdAt = localeDateStringFormatter(
            new Date(image.created_at!).toLocaleDateString()
          );
          const timeCreated = localeTimeStringFormatter(
            new Date(image.created_at!).toLocaleTimeString()
          );

          return (
            <div
              key={image.id}
              className="mb-4 break-inside-avoid border rounded-lg"
            >
              <div className="flex items-start justify-between p-2">
                <div className="mb-4">
                  <p className="text-sm font-semibold">{image.title}</p>
                  <p className="text-sm text-neutral-500">
                    {createdAt} {timeCreated}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisIcon className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <ImageIcon className="w-4 h-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setImageToEdit(image);
                        setOpenEditDialogForm(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Image
                alt={image.title}
                width={1000}
                height={1000}
                className="h-auto max-w-full object-full"
                src={image.path}
              />
              <div className="p-2">
                <div className="flex items-center gap-1 mb-4">
                  <TagIcon className="w-4 h-4" />
                  <p className="text-sm">{image.label}</p>
                </div>
                <div className="font-medium p-1 px-2 rounded-full bg-blue-500 text-white text-xs w-fit">
                  Picture Tag
                </div>
              </div>
            </div>
          );
        })}
        {openEditDialogForm && (
          <EditDialogForm
            open={openEditDialogForm}
            setOpenEditDialogForm={setOpenEditDialogForm}
            image={imageToEdit!}
            gallery_id={gallery_id}
          />
        )}
      </div>
    </>
  );
}

export default function Images({ gallery_id }: { gallery_id: string }) {
  return (
    <>
      <LoadImages gallery_id={gallery_id} />
    </>
  );
}

function EditDialogForm({
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
    <>
      <Dialog open={open} onOpenChange={() => setOpenEditDialogForm(false)}>
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
                  <Label name="label" form={form} />
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
    </>
  );
}

function NoImages() {
  return (
    <div className="flex items-center gap-2">
      <ImageIcon className="w-4 h-4 text-neutral-500" />
      <p className="text-neutral-500 text-sm">No images yet</p>
    </div>
  );
}
