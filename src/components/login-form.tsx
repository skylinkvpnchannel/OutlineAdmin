"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Checkbox } from "@heroui/react";
import { checkPassword, login } from "@/src/core/actions";
import { Logo, EyeIcon } from "@/src/components/icons";
import { motion } from "framer-motion";

interface FormProps {
  password: string;
}

export default function LoginForm() {
  const form = useForm<FormProps>();
  const [showPassword, setShowPassword] = useState(false);

  const actualSubmit = async (data: FormProps) => {
    const userId = await checkPassword(data.password);
    if (userId) {
      await login(userId);
    } else {
      form.setError("password", {
        type: "custom",
        message: "စကားဝှက်မမှန်ပါ။",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4">
      {/* glass background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-400/10 blur-3xl rounded-full" />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative w-full max-w-sm
          bg-white/5 dark:bg-white/5
          border border-white/10
          backdrop-blur-xl
          rounded-3xl shadow-2xl
          p-8 flex flex-col items-center gap-5
          text-white
        "
        onSubmit={form.handleSubmit(actualSubmit)}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col items-center gap-2 mb-1"
        >
          <div className="grid place-items-center w-20 h-20 rounded-2xl bg-white/10 shadow-inner">
            <Logo size={60} />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Outline Dashboard
          </h1>

          <p className="text-sm text-white/70 text-center leading-relaxed">
            Server နဲ့ Access Key တွေကို အဆင်ပြေပြေ စီမံနိုင်ဖို့
            Admin အဖြစ် ဝင်ရောက်ပါ
          </p>
        </motion.div>

        {/* Password Input */}
        <div className="w-full grid gap-2">
          <Input
            className="w-full"
            color="primary"
            errorMessage={form.formState.errors.password?.message}
            isInvalid={!!form.formState.errors.password}
            label="Admin Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            variant="bordered"
            radius="lg"
            classNames={{
              label: "text-white/80",
              inputWrapper:
                "bg-white/5 border-white/10 hover:border-white/30 focus-within:border-emerald-400/70",
              input: "text-white placeholder:text-white/40",
              errorMessage: "text-red-300",
            }}
            {...form.register("password", {
              required: "စကားဝှက်ထည့်ပါ။",
              maxLength: { value: 64, message: "အများဆုံး 64 လုံးသာရမယ်။" },
            })}
          />

          {/* Show password toggle */}
          <div className="flex items-center justify-between text-sm text-white/70">
            <Checkbox
              isSelected={showPassword}
              onValueChange={setShowPassword}
              classNames={{
                label: "text-white/70",
                wrapper: "before:border-white/40",
              }}
            >
              Show password
            </Checkbox>

            <div className="flex items-center gap-1">
              <EyeIcon size={18} />
              <span>{showPassword ? "Visible" : "Hidden"}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full"
        >
          <Button
            className="
              w-full font-semibold text-base
              bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
              shadow-lg shadow-emerald-500/25
              hover:shadow-cyan-500/30
              text-white
            "
            isLoading={
              form.formState.isSubmitting || form.formState.isSubmitSuccessful
            }
            type="submit"
            radius="lg"
            variant="shadow"
          >
            ဝင်မယ်
          </Button>
        </motion.div>

        {/* Footer */}
        <div className="text-xs text-white/50 mt-1 text-center">
          © {new Date().getFullYear()} Outline Dashboard
        </div>
      </motion.form>
    </div>
  );
}
