# PlayGym Hub

Gaming and Fitness subscriptions with Clerk auth and mock M-Pesa flow.

## Scripts
- dev: Vite dev server
- build: Type-check and build
- preview: Preview built app

## Env
Create `.env` with:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

## Routes
- `/` Home
- `/subscriptions` Plans
- `/payment` Protected, M-Pesa mock form
- `/dashboard` Protected
- `/sign-in`, `/sign-up` Clerk screens

## Placeholders
Add images under `public/placeholders/` and reference them as `/placeholders/your-image.jpg`.
