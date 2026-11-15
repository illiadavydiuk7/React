import { startTransition, useActionState, useRef } from 'react'
import { useFormik } from 'formik'
import GuestsStepper from './GuestsStepper.jsx'
import { sendBooking } from '../api.js'
import { bookingSchema } from '../bookingSchema.js'

const initialValues = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  comment: '',
}

const fieldOrder = ['name', 'phone', 'date', 'time']

export default function BookingForm() {
  const fieldRefs = useRef({})

  const [result, dispatch, isPending] = useActionState(bookTable, null)

  const formik = useFormik({
    initialValues,
    validationSchema: bookingSchema,
    onSubmit: (values) => {
      if (isPending) return
      const castValues = bookingSchema.cast(values)
      startTransition(() => dispatch(castValues))
    },
  })

  // Дія для useActionState: null — сигнал «Очистити»; інакше надсилаємо
  // бронювання, після успіху очищаємо форму й повертаємо відповідь.
  async function bookTable(previousResult, booking) {
    if (booking === null) return null
    const response = await sendBooking(booking)
    if (response.ok) startTransition(() => formik.resetForm())
    return response
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    const errors = await formik.validateForm()
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        name: true,
        phone: true,
        date: true,
        time: true,
        guests: true,
        comment: true,
      })
      const firstInvalid = fieldOrder.find((field) => errors[field])
      if (firstInvalid) {
        fieldRefs.current[firstInvalid]?.focus()
      }
      return
    }
    formik.handleSubmit(e)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.currentTarget.requestSubmit()
    }
  }

  function handleReset() {
    formik.resetForm()
    startTransition(() => dispatch(null))
    fieldRefs.current.name?.focus()
  }

  return (
    <form
      className="booking-form"
      noValidate
      onSubmit={handleFormSubmit}
      onKeyDown={handleKeyDown}
    >
      <div className="field">
        <label>
          Ім'я
          <input
            ref={(el) => {
              fieldRefs.current.name = el
            }}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="name"
            required
            aria-invalid={
              formik.touched.name && formik.errors.name ? 'true' : 'false'
            }
            aria-describedby="name-error"
          />
        </label>
        <p id="name-error" className="field-error">
          {formik.touched.name ? formik.errors.name : undefined}
        </p>
      </div>
      <div className="field">
        <label>
          Телефон
          <input
            ref={(el) => {
              fieldRefs.current.phone = el
            }}
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="tel"
            placeholder="+380671234567"
            required
            aria-invalid={
              formik.touched.phone && formik.errors.phone ? 'true' : 'false'
            }
            aria-describedby="phone-error"
          />
        </label>
        <p id="phone-error" className="field-error">
          {formik.touched.phone ? formik.errors.phone : undefined}
        </p>
      </div>
      <div className="row">
        <div className="field">
          <label>
            Дата
            <input
              ref={(el) => {
                fieldRefs.current.date = el
              }}
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              aria-invalid={
                formik.touched.date && formik.errors.date ? 'true' : 'false'
              }
              aria-describedby="date-error"
            />
          </label>
          <p id="date-error" className="field-error">
            {formik.touched.date ? formik.errors.date : undefined}
          </p>
        </div>
        <div className="field">
          <label>
            Час
            <input
              ref={(el) => {
                fieldRefs.current.time = el
              }}
              type="time"
              name="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              aria-invalid={
                formik.touched.time && formik.errors.time ? 'true' : 'false'
              }
              aria-describedby="time-error"
            />
          </label>
          <p id="time-error" className="field-error">
            {formik.touched.time ? formik.errors.time : undefined}
          </p>
        </div>
      </div>

      <GuestsStepper
        value={formik.values.guests}
        onChange={(val) => formik.setFieldValue('guests', val)}
      />

      <label>
        Коментар
        <textarea
          name="comment"
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          maxLength={200}
          aria-describedby="comment-counter"
        />
      </label>
      <p id="comment-counter" className="counter">
        {formik.values.comment.length} / 200
      </p>
      <div className="actions">
        <button type="submit" aria-disabled={isPending}>
          {isPending ? 'Надсилаємо…' : 'Забронювати'}
        </button>
        <button type="button" onClick={handleReset}>
          Очистити
        </button>
      </div>
      <p
        role="status"
        className={result?.ok === false ? 'status error' : 'status'}
      >
        {result?.message}
      </p>
    </form>
  )
}
