import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import config from '../config';
import { leadFormSchema, type LeadFormValues } from '@red-giant/game-engine';

export interface LeadSubmitData {
  name: string;
  phone: string;
  email: string;
  company: string;
  timestamp: string;
}

export interface LeadCaptureProps {
  onSubmit: (lead: LeadSubmitData) => void;
  onSkip: () => void;
}

/** Post-win form for collecting player contact details, validated with the shared zod schema. */
export function LeadCapture({ onSubmit, onSkip }: LeadCaptureProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: '', phone: '', email: '', company: '', consent: false },
  });

  const handleFormSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSubmit({
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        company: data.company || '',
        timestamp: new Date().toISOString(),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
        style={{
          background: `linear-gradient(135deg, ${config.theme.background} 0%, ${config.theme.backgroundLight} 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-md">
          <motion.div
            className="mb-6 w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.theme.success }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <CheckIcon />
          </motion.div>

          <motion.h2
            className="text-4xl font-black font-display mb-4"
            style={{ color: config.theme.success }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {config.lead.successTitle}
          </motion.h2>

          <motion.p
            className="text-xl mb-8"
            style={{ color: config.theme.text }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {config.lead.successMessage}
          </motion.p>

          <motion.button
            onClick={onSkip}
            className="py-4 px-8 rounded-2xl font-semibold text-lg"
            style={{ backgroundColor: config.theme.primary, color: config.theme.text }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {config.buttons.continue}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{
        background: `linear-gradient(135deg, ${config.theme.background} 0%, ${config.theme.backgroundLight} 100%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative z-10 w-full max-w-md px-8">
        <motion.div className="text-center mb-8" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h2 className="text-4xl font-black font-display mb-2" style={{ color: config.theme.text }}>
            {config.lead.title}
          </h2>
          <p className="text-xl" style={{ color: config.theme.primary }}>
            {config.lead.subtitle}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: config.theme.text }}>
              Full Name *
            </label>
            <input
              {...register('name')}
              placeholder={config.lead.namePlaceholder}
              className="w-full px-5 py-4 rounded-xl text-lg outline-none transition-all"
              style={{
                backgroundColor: config.theme.backgroundLight,
                color: config.theme.text,
                border: errors.name ? '2px solid #EF4444' : `2px solid ${config.theme.primary}40`,
              }}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: config.theme.text }}>
              Phone Number *
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder={config.lead.phonePlaceholder}
              className="w-full px-5 py-4 rounded-xl text-lg outline-none transition-all"
              style={{
                backgroundColor: config.theme.backgroundLight,
                color: config.theme.text,
                border: errors.phone ? '2px solid #EF4444' : `2px solid ${config.theme.primary}40`,
              }}
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: config.theme.text }}>
              Email (optional)
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder={config.lead.emailPlaceholder}
              className="w-full px-5 py-4 rounded-xl text-lg outline-none transition-all"
              style={{
                backgroundColor: config.theme.backgroundLight,
                color: config.theme.text,
                border: errors.email ? '2px solid #EF4444' : `2px solid ${config.theme.primary}40`,
              }}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: config.theme.text }}>
              Company (optional)
            </label>
            <input
              {...register('company')}
              placeholder={config.lead.companyPlaceholder}
              className="w-full px-5 py-4 rounded-xl text-lg outline-none transition-all"
              style={{
                backgroundColor: config.theme.backgroundLight,
                color: config.theme.text,
                border: `2px solid ${config.theme.primary}40`,
              }}
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              {...register('consent')}
              type="checkbox"
              id="consent"
              className="mt-1 w-5 h-5 rounded"
              style={{ accentColor: config.theme.primary }}
            />
            <label htmlFor="consent" className="text-sm leading-relaxed" style={{ color: config.theme.text, opacity: 0.8 }}>
              {config.lead.consentText}
            </label>
          </div>
          {errors.consent && <p className="text-red-400 text-sm">{errors.consent.message}</p>}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 px-8 rounded-2xl font-bold text-xl shadow-lg relative overflow-hidden"
            style={{ backgroundColor: config.theme.primary, color: config.theme.text, fontFamily: config.fonts.display }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Submitting...</span>
              </span>
            ) : (
              config.buttons.submit
            )}
          </motion.button>

          <button
            type="button"
            onClick={onSkip}
            className="w-full py-3 text-lg"
            style={{ color: config.theme.text, opacity: 0.6 }}
          >
            {config.buttons.skip}
          </button>
        </motion.form>
      </div>

      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none opacity-10"
        style={{ backgroundColor: config.theme.primary }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none opacity-10"
        style={{ backgroundColor: config.theme.accent }}
      />
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="white">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default LeadCapture;
