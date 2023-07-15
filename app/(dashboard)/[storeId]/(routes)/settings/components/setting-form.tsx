"use client"

import Heading from "@/components/ui/Heading";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store;
}

type SettingsFormValues = z.infer<typeof formSchema>

const formSchema = z.object({
    name: z.string().min(1),
});

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })

    const onSubmit = async (data : SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            toast.success("Store updated Successfully")
            router.refresh();
        } catch (error: any) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            toast.success("Store deleted Successfully");
            router.refresh();
            router.push("/");
        } catch (error: any) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
            <div className="flex justify-between items-center">
                <Heading
                    title="Settings"
                    description="Manage your Store"
                />
                <Button className=""
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form} >
                <form className="space-y-8 w-full"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Store Name" disabled={loading} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button variant="destructive" className="ml-auto" type="submit">
                        Save
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert 
                title="NEXT_PUBLIC_API_URL"
                description={`${origin}/api/${params.storeId}`}
                variant="public"
            />
        </>
    );
}
