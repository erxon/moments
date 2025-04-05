import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Title({ name, form }: { name: string; form: any }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Description({ name, form }: { name: string; form: any }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              className="resize-none"
              placeholder="description"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Label({ name, form }: { name: string; form: any }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Label</FormLabel>
          <FormControl>
            <Input placeholder="label" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
