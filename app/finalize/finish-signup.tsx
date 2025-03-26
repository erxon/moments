"use client";

import ImageInput from "@/components/image-input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import axios from "axios";
import HTTPResponseHandler from "@/lib/http-response-handler.util";
import { redirect, useRouter } from "next/navigation";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import { Toaster } from "@/components/ui/sonner";

const formSchema = z.object({
  first_name: z.string().min(1, {
    message: "First name is required",
  }),
  middle_name: z.string({
    invalid_type_error: "Middle name must be a string",
  }),
  last_name: z.string().min(1, {
    message: "Last name is required",
  }),
  about: z.string().min(1, {
    message: "Please tell us more about yourself",
  }),
});

export default function FinishSignup() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      about: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const basicInfo = {
      first_name: values.first_name,
      middle_name: values.middle_name,
      last_name: values.last_name,
      about: values.about,
    };

    try {
      const result = await axios.post("/api/profile", basicInfo);

      if (result.status === 200) {
        router.push("/home");
      } else {
        triggerErrorToast("Something went wrong");
      }
    } catch (error) {
      triggerErrorToast("Something went wrong");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="mb-3 flex flex-col gap-3 w-[400px]">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middle_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Middle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Please tell us more about yourself..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button size="sm" type="submit">
            Done!
          </Button>
        </form>
      </Form>
      <div className="flex items-center gap-3 mr-auto mt-4">
        <p className="text-sm">Change theme</p>
        <ThemeSwitcher />
      </div>
    </>
  );
}
