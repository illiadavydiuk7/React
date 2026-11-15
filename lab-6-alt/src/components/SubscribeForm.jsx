import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import * as yup from 'yup'
import { subscribe } from '../api.js'

const emailSchema = yup
  .string()
  .email('Вкажіть адресу на кшталт olena@gmail.com')
  .required('Вкажіть адресу на кшталт olena@gmail.com')

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? 'Підписуємо…' : 'Підписатися'}
    </button>
  )
}

async function subscribeAction(previousState, formData) {
  const email = formData.get('email')
  try {
    const validEmail = await emailSchema.validate(email)
    return subscribe(validEmail)
  } catch (err) {
    return { ok: false, message: err.message, email }
  }
}

export default function SubscribeForm() {
  const [state, formAction] = useActionState(subscribeAction, null)

  return (
    <form className="subscribe-form" action={formAction} noValidate>
      <label>
        Email для новин
        <input
          type="email"
          name="email"
          autoComplete="email"
          defaultValue={state?.email}
          aria-invalid={state?.ok === false ? 'true' : 'false'}
          aria-describedby="subscribe-status"
        />
      </label>
      <SubmitButton />
      <p
        id="subscribe-status"
        role="status"
        className={state?.ok === false ? 'status error' : 'status'}
      >
        {state?.message}
      </p>
    </form>
  )
}
