import { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const FIELD_MAPPING = {
  github: ['external_username'],
  devto: ['external_username'],
  gitlab: ['external_username'],
}

const FIELD_LABELS = {
  external_username: 'Username',
}

function normalizeSourceName(sourceName) {
  if (!sourceName || typeof sourceName !== 'string') {
    return ''
  }

  return sourceName.trim().toLowerCase()
}

export default function IntegrationSetupModal({
  isOpen,
  onClose,
  sourceName,
  onSubmit,
  initialValues,
}) {
  const normalizedSource = normalizeSourceName(sourceName)

  const fields = useMemo(() => {
    return FIELD_MAPPING[normalizedSource] || []
  }, [normalizedSource])

  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const nextValues = fields.reduce((acc, fieldName) => {
      acc[fieldName] = ''
      return acc
    }, {})

    fields.forEach((fieldName) => {
      const sourceValue = initialValues?.[fieldName]
      if (typeof sourceValue === 'string') {
        nextValues[fieldName] = sourceValue
      }
    })

    setValues(nextValues)
    setErrors({})
  }, [isOpen, fields, initialValues])

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validate = () => {
    const nextErrors = {}

    fields.forEach((fieldName) => {
      const rawValue = values[fieldName]
      const value = typeof rawValue === 'string' ? rawValue.trim() : ''

      if (!value) {
        nextErrors[fieldName] = `${FIELD_LABELS[fieldName] || fieldName} is required.`
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const payload = {
      source_name: normalizedSource,
    }

    fields.forEach((fieldName) => {
      payload[fieldName] = values[fieldName].trim()
    })

    try {
      setIsSubmitting(true)
      await onSubmit(payload)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">Configure {normalizedSource || 'integration'}</h2>
        <p className="mt-2 text-sm text-slate-600">Enter required values before connecting.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {fields.map((fieldName) => (
            <Input
              key={fieldName}
              name={fieldName}
              label={`${FIELD_LABELS[fieldName] || fieldName} *`}
              value={values[fieldName] || ''}
              onChange={handleChange}
              error={errors[fieldName]}
              placeholder="Enter username"
              disabled={isSubmitting}
            />
          ))}

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
