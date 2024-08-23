import { defineCollection, z } from "astro:content";

const metadataDefinition = () =>
    z
    .object({
    title: z.string().optional(),
    ignoreTitleTemplate: z.boolean().optional(),

    canonical: z.string().url().optional(),

    robots: z
        .object({
        index: z.boolean().optional(),
        follow: z.boolean().optional(),
        })
        .optional(),

    description: z.string().optional(),

    openGraph: z
        .object({
        url: z.string().optional(),
        siteName: z.string().optional(),
        images: z
            .array(
            z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
            })
            )
            .optional(),
        locale: z.string().optional(),
        type: z.string().optional(),
        })
        .optional(),

    twitter: z
        .object({
        handle: z.string().optional(),
        site: z.string().optional(),
        cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();


const postCollection = defineCollection({
    schema: z.object({
        publishDate: z.date().optional(),
        updateDate: z.date().optional(),
        draft: z.boolean().optional(),

        headingTitle: z.string().optional(),
        title: z.string(),
        excerpt: z.string().optional(),
        introduction: z.string().optional(),
        image: z.string().optional(),
        year: z.string().optional(),

        tags: z.array(z.string()).optional(),
        services: z.array(z.string()).optional(),
        roles: z.array(z.string()).optional(),
        sellingPoints: z.array(z.string()).optional(),

        metadata: metadataDefinition(),
    }),
});

const roleCollection = defineCollection({
    schema: z.object({
        publishDate: z.date().optional(),
        updateDate: z.date().optional(),
        draft: z.boolean().optional(),
        title: z.string().optional()
    })
});

const serviceCollection = defineCollection({
    schema: z.object({
        publishDate: z.date().optional(),
        updateDate: z.date().optional(),
        draft: z.boolean().optional(),
        title: z.string().optional()
    })
});


export const collections = {
    post: postCollection,
    role: roleCollection,
    service: serviceCollection,
};
