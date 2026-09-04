# Compress100 Product Brief

## Positioning

Compress100 is a browser-first image and animated GIF compressor for people who need a file-size limit without uploading the original file.

The product promise is specific: choose a target, see the measured output, download locally. It does not promise an exact byte count because image encoders produce discrete results.

## Launch Scope

- JPG, PNG, WebP and animated GIF input
- Single and multiple file processing
- 50KB, 100KB and 200KB target pages
- Local browser processing with no image upload endpoint
- Actual before/after size and dimension reporting
- Download one result at a time
- Clear warning when a target cannot be reached within the quality guardrails

Desktop-only PicLite features such as folder watching, global shortcuts, plugins and background automation remain in the upstream desktop product. They are not part of the first SEO landing-page experience.

## Acceptance Criteria

1. A visitor can add an image from the first viewport.
2. The browser displays a measured output or a useful processing error.
3. The page never sends image bytes to the product server.
4. Each target-size URL has independent metadata and indexable body copy.
5. The tool remains usable at 320px viewport width.
