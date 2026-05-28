
  # Design System Guidelines

  This is a code bundle for Design System Guidelines. The original project is available at https://www.figma.com/design/5DHSm2e6yE690jXsLDPZAC/Design-System-Guidelines.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  For the WordPress CMS integration, set `VITE_WP_API_BASE` to your WordPress REST base URL, for example `http://localhost/wordpress/wp-json`. If it is not set, the React app falls back to `/wp-json`.

  Vite reads env files at build time. After changing `VITE_WP_API_BASE`, run the matching build command again and upload the new `dist`; changing env files on the server will not change an already built bundle.

## WordPress CMS integration

The React app is intentionally kept separate from WordPress. WordPress only acts as the CMS and exposes data through REST endpoints. The frontend should keep rendering the current React UI.

Important locations:

- `src/app/pages`: UI/page layout files. These are the files most likely to change when a new UI source is delivered.
- `src/app/cms`: CMS adapter hooks. Keep WordPress fetching, data mapping, filtering, and defaults here as much as possible.
- `src/app/lib/wordpress.ts`: REST types and low-level fetch helpers.
- `wordpress/wp-content/themes/tona-home-cms`: WordPress theme, post types, ACF fields, and REST endpoint registration.

Current conflict-reduction pattern:

- UI files should call a page hook such as `useJobsPage(...)`.
- Hooks return a stable view model for the UI, for example `heroTitle`, `filteredJobs`, `perks`, `internPositions`, `colors`, and CTA data.
- WordPress-specific details such as page slug, REST endpoint, category logic, ACF mapping, and post filtering should live in `src/app/cms`, not inside page JSX.

Example from `Jobs.tsx`:

```tsx
const {
  departments,
  filteredJobs,
  perks,
  internPositions,
  heroTitle,
  colors,
} = useJobsPage({
  fallbackJobs: fallbackJobs as JobPost[],
  fallbackPerks,
  fallbackInternPositions,
});
```

When adding CMS to another page, prefer creating a hook first:

```txt
src/app/cms/useAboutPage.ts
src/app/cms/useCulturePage.ts
src/app/cms/useServicesPage.ts
```

Then keep the page component mostly visual.

## Updating UI from an external source

Use this workflow whenever another team provides a new frontend source.

1. Create a backup branch before copying anything:

```bash
git checkout -b backup/before-ui-update
```

2. Create a branch for the incoming UI:

```bash
git checkout -b ui/incoming-update
```

3. Copy only the UI source first. Usually this means files under:

```txt
src/app/pages
src/app/components
src/styles
src/imports
```

Avoid copying these unless the API contract intentionally changed:

```txt
src/app/cms
src/app/lib/wordpress.ts
wordpress/wp-content/themes/tona-home-cms
.env.local
```

4. Search for unresolved merge markers:

```bash
rg "<<<<<<<|=======|>>>>>>>" src wordpress
```

5. Search for encoding damage in UI text:

```bash
rg "Ã|Â|Ä|áº|á»|Æ|â|�" src/app/pages src/app/components
```

6. Reconnect CMS hooks in changed pages.

For any page that was overwritten, restore the hook import and hook call. For Jobs, keep this import:

```tsx
import { useJobsPage, type InternPosition, type PerkItem } from "../cms/useJobsPage";
```

Then keep the page using values from `useJobsPage(...)` instead of re-adding fetch logic directly in the component.

7. Run a production build:

```bash
npm run build
```

Env files:

```txt
.env.local
VITE_WP_API_BASE=http://localhost/wordpress/wp-json

.env.test
VITE_WP_API_BASE=https://newweb.tonacorp.com/wordpress/wp-json

.env.production
VITE_WP_API_BASE=
```

Build commands:

```bash
npm run build:test
npm run build:production
```

8. Manually check key routes:

```txt
/vi/
/vi/gioi-thieu-tona
/vi/doi-ngu
/vi/cuoc-song-tona
/vi/dich-vu
/vi/du-an-tona
/vi/tin-tuc
/vi/nghe-nghiep
```

9. If a page breaks after UI replacement, check this order:

- Missing icon import from `lucide-react`.
- Old variable name from incoming UI, for example `cultureActivities` instead of `activities`.
- Missing hook helper such as `renderLines` or `backgroundStyle`.
- CMS hook import removed during overwrite.
- Mojibake text such as `Dá»± Ãn`.

## Rules to keep future merges smaller

- Do not put `fetchCmsPage`, `fetchCmsJobs`, `fetchCmsProjects`, or REST mapping directly inside page JSX when adding new CMS work.
- Keep WordPress slugs and endpoint assumptions inside `src/app/cms` or `src/app/lib/wordpress.ts`.
- Keep UI labels and layout in page files.
- If the UI source changes heavily, update the visual JSX first, then reconnect the existing hook return values.
- Prefer adding a new hook field over changing the shape of existing hook fields. Stable field names reduce merge conflicts.
  
