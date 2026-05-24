import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutStepsProps {
  currentStep: number
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const { t } = useTranslation()

  const steps = [
    { id: 1, label: t('checkout.step_address') },
    { id: 2, label: t('checkout.step_review') },
    { id: 3, label: t('checkout.step_confirm') }
  ]

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                currentStep > step.id
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : currentStep === step.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-gray-200 text-gray-400'
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-4 w-4" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={cn(
                'mt-1 text-xs font-medium',
                currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 w-16 sm:w-24 mx-2 transition-all',
                currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
