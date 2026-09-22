# Bolatemi update notes

## What was fixed

- Admin login now normalizes accidental `Name <email@example.com>` input to the real email address on both frontend and backend.
- Public product API supports featured products, and the homepage now shows live featured inventory when available.
- Admin Products uses a protected inventory endpoint so hidden/unavailable products are still visible to admins.
- Admin portal is easier to reach from the public header, mobile menu, and footer.
- Admin pages have a `View Store` shortcut and improved mobile layout.
- Backend CORS keeps local development working and allows the deployed Bolatemi storefront origin.

## Production environment variables

### Frontend (Vercel)

```text
VITE_API_URL=https://bolatemi-eight.vercel.app/api
```

### Backend (Vercel)

Set `CLIENT_URL` to the deployed frontend origin:

```text
CLIENT_URL=https://bolatemi-xaaw-chivercel.app
```

You can also comma-separate additional trusted frontend origins when needed.

## Admin URL

```text
https://bolatemi-xaaw-chivercel.app/admin
```

The public site also has an **Admin** shortcut in the header, mobile navigation, and footer.

## Deployment reminder

Do not commit `.env` or `.env.local` files. They contain deployment credentials/secrets. Configure those values in the Vercel project environment settings instead.
