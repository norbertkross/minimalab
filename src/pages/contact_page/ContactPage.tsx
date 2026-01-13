import { useState, useCallback } from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import CircleComponent from '../../components/reuseable/gradient_cirle'
import SelectService from './select_service'
import Form from './form'
import { UserService } from '../../expose_db'
import { Home } from 'lucide-react'

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  service: string;
  phone: string;
}

export default function NewContact() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setFormData(prev => ({ ...prev, service: serviceId }))
  }

  const handleFormChange = useCallback((data: FormData, _isValid: boolean) => {
    void _isValid
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  const handleFormSubmit = async () => {
    if (!selectedService || !formData.email) {
      console.error('Required fields missing')
      return
    }

    try {
      setIsSubmitting(true)
      // Fixed: Create properly formatted data for addQuote
      const quoteData = {
        email: formData.email!,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        message: formData.message || '',
        phone: formData.phone || '',
        service: selectedService
      }
      await UserService.addQuote(quoteData)
      setShowSuccess(true)
    } catch (error) {
      let er: string = (error as Error).message
      er = ''
      console.error('Submission failed:', er)
    } finally {
      setIsSubmitting(false)
    }
  }


  const closeSuccessModal = () => {
    setShowSuccess(false)
  }

  return (
    <>
      <Header/>
      <div className="relative flex min-h-screen flex-col items-center bg-white p-6">
        <CircleComponent children={<Home size={26} className='text-white'/>}/>

        {step === 1 && (
          <div>
            <SelectService
              onServiceSelect={handleServiceSelect}
              selectedService={selectedService}
            />
          </div>
        )}

        {step === 2 && (
          <Form
            onFormChange={handleFormChange}
          />

        )}

        <div className="mt-6 flex justify-between gap-14 bg-white p-6 md:gap-60">

          {step > 1 && (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="block max-w-full rounded-full bg-gray-200 px-6 py-2 text-black"
            >
              Go back
            </button>
          )}

          {step === 2 ? (
            <button
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="rounded-full bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          ) : (
            <button
              onClick={() => selectedService && setStep(prev => prev + 1)}
              disabled={!selectedService}
              className="rounded-full bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Success!</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Your form has been submitted successfully.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
                    onClick={closeSuccessModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  )
}
