"use client";

import React, { useState } from "react";
import { HealthCheck, NotificationChannel } from "@prisma/client";
import { Radio, RadioGroup } from "@heroui/radio";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, Input, Link, Tooltip, useDisclosure } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

import { updateHealthCheck } from "@/src/core/actions/health-check";
import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon } from "@/src/components/icons";

const NoNotificationChannel = { id: 0, name: "None", type: "None" };

interface Props {
    healthCheck: HealthCheck;
    notificationChannels: NotificationChannel[];
}

type FormFields = {
    interval: number;
    notificationChannelId?: number;
    notificationCooldown: number;
};

export default function HealthCheckEditForm({ healthCheck, notificationChannels }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const form = useForm<FormFields>({
        defaultValues: {
            interval: healthCheck.interval,
            notificationCooldown: healthCheck.notificationCooldown,
            notificationChannelId: healthCheck.notificationChannelId ?? undefined
        },
        shouldUnregister: false
    });

    const { register, handleSubmit, formState, control } = form;

    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();

    const actualSubmit = async (data: FormFields) => {
        const channelId = parseInt(data.notificationChannelId?.toString() ?? "0");

        try {
            await updateHealthCheck({
                id: healthCheck.id,
                notificationChannelId: channelId > 0 ? channelId : null,
                notificationCooldown: data.notificationCooldown,
                interval: data.interval
            });

            router.push("/health-checks");
        } catch (error) {
            setErrorMessage((error as object).toString());
            errorModalDisclosure.onOpen();
        }
    };

    return (
        <>
            <MessageModal
                body={
                    <div className="grid gap-2">
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">{errorMessage}</pre>
                    </div>
                }
                disclosure={errorModalDisclosure}
                title="အမှား!"
            />
            <div className="grid gap-6">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Health Checks" delay={600} size="sm">
                        <Button isIconOnly as={Link} href="/health-checks" size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">Health Check အသေးစိတ်</h1>
                </section>

                <form className="w-full max-w-[464px] grid gap-4" onSubmit={handleSubmit(actualSubmit)}>
                    <Input
                        color="primary"
                        description="ဆာဗာ အခြေအနေကို စစ်ဆေးမည့် ကြားကာလ (မိနစ်ဖြင့်)"
                        errorMessage={formState.errors.interval?.message}
                        isInvalid={!!formState.errors.interval}
                        label="ကြားကာလ (Interval)"
                        max={10000}
                        min={1}
                        placeholder="ဥပမာ 5"
                        type="number"
                        variant="underlined"
                        {...register("interval", { valueAsNumber: true, required: "ကြားကာလ ထည့်ပါ။" })}
                    />

                    <Input
                        color="primary"
                        description="နောက်ထပ် အသိပေးချက် ပို့မည့်အထိ စောင့်ရသော အချိန် (မိနစ်ဖြင့်)"
                        errorMessage={formState.errors.notificationCooldown?.message}
                        isInvalid={!!formState.errors.notificationCooldown}
                        label="အသိပေးချက် စောင့်ချိန် (Cooldown)"
                        max={10000}
                        min={1}
                        placeholder="ဥပမာ 5"
                        type="number"
                        variant="underlined"
                        {...register("notificationCooldown", {
                            valueAsNumber: true,
                            required: "အသိပေးချက် စောင့်ချိန် ထည့်ပါ။"
                        })}
                    />

                    {notificationChannels.length > 0 ? (
                        <Controller
                            control={control}
                            name="notificationChannelId"
                            render={({ field }) => (
                                <RadioGroup
                                    label="အသိပေးချက် Channel"
                                    value={field.value?.toString() ?? "0"}
                                    onChange={field.onChange}
                                >
                                    {[NoNotificationChannel, ...notificationChannels].map((channel) => (
                                        <Radio key={channel.id} value={channel.id.toString()}>
                                            {channel.name} (
                                            {channel.type === "None" ? "အသိပေးချက် မရှိပါ" : channel.type})
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    ) : (
                        <Alert color="warning" hideIcon={true}>
                            သင့်မှာ အသိပေးချက် Channel မရှိသေးပါ။{" "}
                            <Link className="contents" href={`/notification-channels/create?return=${pathname}`}>
                                အသစ်ဖန်တီးမယ်
                            </Link>
                        </Alert>
                    )}

                    <Button
                        color="primary"
                        isLoading={formState.isSubmitting || formState.isSubmitSuccessful}
                        type="submit"
                        variant="shadow"
                    >
                        သိမ်းမယ်
                    </Button>
                </form>
            </div>
        </>
    );
}
