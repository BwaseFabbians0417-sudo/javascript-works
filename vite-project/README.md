# FENGS LUXE EMPIRE

A responsive storefront with 90 numbered products, category browsing, product-number lookup, search, filters, sorting, product details and options, related-product recommendations, favorites, a persistent cart, customer accounts, and order requests. Customers can choose a delivery country and storefront language (English, Russian, French, or German); preferences are saved in their browser.

The storefront includes Black Friday and December gift-edit promo panels. Black Friday opens the existing 30%-or-more deal filter; the December panel filters a curated set of gift-friendly catalog categories. The custom brand mark is `public/fengs-luxe-mark.svg`.

The About and Contact links lead to dedicated sections on the storefront. Contact details use the configured store email and phone. The inquiry form prepares a message in the visitor's default email app; it does not transmit or store messages on the site.

## Run locally

```sh
npm install
npm run dev
```

## Accounts and order requests

With no backend configured, sign-up and sign-in work in **local demo mode**: account records, sign-in state, and order requests are stored only in the current browser's local storage on the current device. Passwords are not stored as plain text; the demo derives a salted PBKDF2 hash using Web Crypto. Browser-local storage is not a production authentication system: data can be cleared or altered by the device owner, there is no email verification or password reset, and accounts/orders do not sync across devices or reach the store. Users should not reuse sensitive passwords. The local demo does not grant store-admin privileges.

For production, connect Supabase Auth and use the SQL setup below. Supabase order tables use row-level security so a customer can only access their own orders; the registered store-owner account can manage order requests. Once credentials are configured, authentication and order requests use Supabase instead of local demo storage.

1. Create a Supabase project and enable the Email provider in **Authentication → Providers**.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the project's public project URL and publishable/anon key. Never put a `service_role` key in a `VITE_` variable.
3. In **Authentication → URL Configuration**, allow your local URL (usually `http://localhost:5173`) and deployed Vercel URL for email confirmation and password-reset links.
4. Restart Vite, open the account dialog, and register the store-owner account using `OLORUNNIYIOLUWAPELUMI0417@GMAIL.COM`.
5. Run [`supabase-setup.sql`](./supabase-setup.sql) in the Supabase SQL Editor **after the store-owner account exists**. It creates the orders and admin tables, enables row-level security, and grants the matching store email access to the order-management view. If the owner account uses another email, update the email in the final SQL statement before running it.
6. In Vercel, add the same two public Supabase environment variables and redeploy.

When Supabase is configured, customers can sign up, sign in, reset/update a password, update their name and phone, submit delivery requests, cancel their own requests while the status is still **Requested**, and view their order history. The store-owner account gets an order-management view and can update request statuses. To accept an order, sign in with the owner account, open **Admin** (or **Orders**), refresh the list if needed, then change that order's status from **Requested** to **Confirmed**. In local demo mode, customers can create accounts, sign in, update their profile, submit local order requests, cancel requests that are still Requested, and view their local order history, but cannot reset a forgotten password or automatically notify the store by email.

### Automatic order email notifications

Online checkout requires a customer account so each submitted order is saved in Supabase before the store is notified. To email the configured store inbox, deploy the `notify-order` Supabase Edge Function and connect a Resend account:

1. Rerun [`supabase-setup.sql`](./supabase-setup.sql) in the Supabase SQL Editor to create the private order-email notification table.
2. Verify a sender domain/address with Resend.
3. Link the Supabase CLI to this project and deploy the function: `supabase functions deploy notify-order`. Keep JWT verification enabled; do not use `--no-verify-jwt`.
4. Configure Edge Function secrets (never add these to `.env.local`, Vercel `VITE_` variables, or browser code):

   ```sh
   supabase secrets set RESEND_API_KEY=re_your_server_key ORDER_NOTIFICATION_EMAIL=your-inbox@example.com ORDER_FROM_EMAIL="FENGS Orders <orders@your-verified-domain.com>" STORE_APP_URL=https://your-store.vercel.app/
   ```

The function verifies the signed-in customer owns the order, then emails the store inbox with the order and delivery details plus a link to the admin sign-in screen. Set `STORE_APP_URL` to your deployed HTTPS storefront URL. The link opens the account dialog; the owner must sign in before viewing or accepting requests, and it cannot approve an order by itself. The server-only service-role key is used only by the Edge Function to prevent duplicate notification sends; it is never exposed to the storefront. If the email service is temporarily unavailable, the order remains saved and checkout offers a retry. The local demo and guest email drafts do not send automatic notifications.

Customers can edit the cart before submitting: use **− / +** to change quantity or **Remove** to remove a product variant. Cancellation keeps a record with status **Cancelled** rather than deleting the order history. If the Supabase tables were created before customer cancellations were added, rerun `supabase-setup.sql` to add the cancellation policy.

When Supabase is not configured, customers may check out as guests. Guest checkout prepares a detailed order-request email in the customer's email app, including delivery details and the order reference. The customer must press **Send**; the storefront does not receive or store the guest request, and the temporary reference is only kept in the current page. With Supabase configured, customers must sign in so the order can be saved and emailed to the store. For saved order history, automatic store notifications, or cross-device tracking, customers must use an account.

## Catalog and delivery

Product cards show stable identifiers such as `#001`. Enter a number (for example `42` or `#042`) in the search bar to jump to that product. The catalog has demo products with Unsplash images; change the catalog data in `src/App.jsx` to use your real inventory. Product detail dialogs include selectable options and a few related items from the same category.

Fresh fruit has a separate **Fresh Produce** section and category, distinct from pantry groceries. Availability and freshness must be confirmed for each delivery destination. Food details do not promise a shelf life; customers should follow the original package for date, storage, and allergen information.

Checkout collects a recipient and delivery address, country, and preferred carrier, then saves an order request to Supabase. Country flags and carrier names in the footer are destination/preference options, not proof of carrier coverage or a shipping contract. Confirm stock, shipping availability, final delivery costs, and delivery times with the customer before accepting or dispatching an order.

## Region, language, and prices

The browser's language/region is used only as a starting hint when there is no saved preference; it is not used to determine a visitor's precise location. Customers can change country and language in the top bar or footer. Changing the country selects its usual storefront language, which can then be changed independently.

The interface supports English, Russian, French, and German. Product names/descriptions and some delivery-provider/status names remain in the catalog's original language. Non-RUB prices use approximate, hard-coded display conversions for presentation only; they are not live exchange rates or quotes. Order requests and stored subtotals remain in RUB, and the final amount and delivery terms must be confirmed with the customer before acceptance.

Product details include category-specific care and lifespan guidance. Food guidance directs customers to the original package for date, storage, and allergen information; the demo catalog does not claim a specific shelf life or provide medical/food-safety advice.

## Payment and account security

Online card payments and OPay merchant checkout are not configured. The order slip offers Paystack- and Flutterwave-style provider choices through a local fake API, clearly labeled as a demo: it does not contact a payment provider, collect card/bank details, charge money, or mark orders paid. After an order request, the printable slip shows the store-provided OPay recipient name and account number, plus a link to OPay's official website for customers to make a manual transfer themselves. This link does not prefill a payment or verify a transfer. The slip can prepare a plain-text email for an order request or a customer-reported transfer reference; in local demo mode the customer's email app sends nothing until they press **Send**. A transfer report is not proof of settlement. Confirm stock, delivery, and the final amount before asking a customer to transfer, and verify any transfer directly in the receiving account. Never place OPay or email API secrets in frontend code or `VITE_` variables. Automated shipping labels/tracking are also not configured. Do not collect card numbers or passwords in order notes or email.

## Store contact

- Email: OLORUNNIYIOLUWAPELUMI0417@GMAIL.COM
- Phone: +7 952 243-27-85
- Order currency: RUB (regional display prices are approximate)
