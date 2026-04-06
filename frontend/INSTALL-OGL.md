# 🚨 IMPORTANT: Install Missing Dependency

Before the new Phase 2 UI will work, you **MUST** install the `ogl` library:

```bash
cd D:\Hironix\frontend
npm install ogl
```

After installing, **restart the dev server**:
1. Stop the current dev server (Ctrl+C)
2. Run `npm run dev` again
3. Refresh your browser

## Why is this needed?

The Prism animated background component uses the `ogl` (OpenGL) library for WebGL rendering. Without it installed, the component will fail to import and the app won't render properly.

## What you'll see after fixing:

✅ Beautiful animated Prism background on landing page
✅ Full hero section with gradient text
✅ Feature cards and CTAs
✅ New login page with medium-intensity Prism
✅ Admin and Employee dashboards

## Alternative: Disable Prism Temporarily

If you want to see the UI without the Prism effect first, you can temporarily comment out the Prism imports in:
- `LandingPage.jsx`
- `LoginPage.jsx`
- `AppShell.jsx`

But for the full Phase 2 experience, **install ogl**!
