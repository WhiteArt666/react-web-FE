# Images Directory

This directory contains all the images used in the application.

## Structure

- `courses/` - Contains course thumbnail images
  - `course1.jpg` - React & TypeScript course
  - `course2.jpg` - Machine Learning course
  - `course3.jpg` - UI/UX Design course
  - `course4.jpg` - JavaScript ES6+ course
  - `course5.jpg` - Digital Marketing course
  - `course6.jpg` - Business Management course

## Adding New Images

When adding new course images:

1. Place the image in the `courses/` directory
2. Use a descriptive filename (e.g., `course7.jpg`)
3. Update the `thumbnail` property in `courseService.ts`
4. Recommended image dimensions: 300x200 pixels

## Image Formats

- Currently using SVG placeholders for development
- In production, replace with actual course images (JPG, PNG, WebP)
- Optimize images for web to improve loading performance

## Usage

Images are served from the `public` directory and can be accessed via:
```
/images/courses/course1.jpg
```
