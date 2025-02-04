This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🛠️ Tech Stack

| Component                                          | Technology                                      |
| -------------------------------------------------- | ----------------------------------------------- |
| Frontend                                           | Next.js (React) + Tailwind CSS + DaisyUI        |
| Backend                                            | Next.js API Routes (Node.js)                    |
| Image Processing                                   | YOLO / GPT-4V (for object detection)            |
| Embeddings Model                                   | text-embedding-ada-002 (OpenAI) or Hugging Face |
| Vector Database                                    | Pinecone                                        |
| Recipe Generation                                  | GPT-4 (context-based customization)             |
| AI Image Generation                                | DALL·E 3                                        |
| Authentication                                     | Clerk or Supabase Auth                          |
| Database (Optional for history & user preferences) | Supabase / PostgreSQL                           |
| Hosting                                            | Vercel (Frontend & Serverless API)              |

## Application Architecture

### User uploads a fridge image

1. The user takes a picture of their fridge and uploads it.

### AI processes the image to detect ingredients

1. A computer vision model (YOLO, CLIP, or OpenAI GPT-4V if available) identifies the ingredients.
2. Detected ingredients are extracted as structured text.

### Generate an embedding for the detected ingredients

1. Convert the extracted ingredient list into a vector using OpenAI's text-embedding-ada-002 (or an alternative embedding model).

### Search for relevant recipes in Pinecone

1. Perform a vector similarity search in Pinecone to find recipes that closely match the detected ingredients.

### Provide context to GPT-4 for recipe customization

1. Send the retrieved recipes + detected ingredients to GPT-4 with additional context.
2. GPT-4 improves the recipe, suggests multiple variations, and provides additional tips (e.g., missing ingredients, substitutes, cooking methods).

### (Optional) Generate an AI image of the dish

1. If the user wants a preview, DALL·E 3 (or another image model) generates an AI-rendered dish based on the recipe.

### Display final recipe recommendations

1. The user sees multiple AI-enhanced recipes tailored to their fridge contents.
2. They can save, share, or refine their choices.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
