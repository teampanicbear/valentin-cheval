import type { CollectionEntry } from 'astro:content';
import type { Post } from '~/types';

import { getCollection } from 'astro:content';
import { cleanSlug, trimSlash, POST_PERMALINK_PATTERN } from './permalinks';
import { getFeatureImage } from './images';

const generatePermalink = async ({
    id,
    slug,
    publishDate,
    }) => {
    const year = String(publishDate.getFullYear()).padStart(4, '0');
    const month = String(publishDate.getMonth() + 1).padStart(2, '0');
    const day = String(publishDate.getDate()).padStart(2, '0');
    const hour = String(publishDate.getHours()).padStart(2, '0');
    const minute = String(publishDate.getMinutes()).padStart(2, '0');
    const second = String(publishDate.getSeconds()).padStart(2, '0');
    const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
        .replace('%id%', id)
        .replace('%year%', year)
        .replace('%month%', month)
        .replace('%day%', day)
        .replace('%hour%', hour)
        .replace('%minute%', minute)
        .replace('%second%', second);

    return permalink
        .split('/')
        .map((el) => trimSlash(el))
        .filter((el) => !!el)
        .join('/');
};
const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
    const { id, slug: rawSlug = '', data } = post;
    const { Content, remarkPluginFrontmatter } = await post.render();
    const {
        publishDate: rawPublishDate = new Date(),
        updateDate: rawUpdateDate,
        title,
        headingTitle,
        excerpt,
        introduction,
        image,
        year,
        services: rawServices = [],
        roles: rawRoles = [],
        sellingPoints: rawSellingPoints = [],
        draft = false,
        metadata = {},
    } = data;

    const slug = cleanSlug(rawSlug); // cleanSlug(rawSlug.split('/').pop());
    const publishDate = new Date(rawPublishDate);
    const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

    const services = rawServices.map((service: string) => ({
        slug: cleanSlug(service),
        title: service,
    }));
    const roles = rawRoles.map((role: string) => ({
        slug: cleanSlug(role),
        title: role,
    }));
    const sellingPoints = rawSellingPoints.map((point: string) => ({
        slug: cleanSlug(point),
        title: point,
    }));

    const featureImage = await getFeatureImage(`~/content/post/${slug}/${image}`);
    return {
        id: id,
        slug: slug,
        permalink: await generatePermalink({ id, slug, publishDate }),

        publishDate: publishDate,
        updateDate: updateDate,
        title: title,

        headingTitle: headingTitle,
        excerpt: excerpt,
        introduction: introduction,
        image: featureImage,

        year: year,

        roles: roles,
        services: services,
        sellingPoints: sellingPoints,

        draft: draft,

        metadata,

        Content: Content
        // or 'content' in case you consume from API

        // readingTime: remarkPluginFrontmatter?.readingTime,
    };
};

const load = async function (): Promise<Array<Post>> {
    const posts = await getCollection('post');
    const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

    const results = (await Promise.all(normalizedPosts))
        .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
        .filter((post) => !post.draft);

    return results;
};

let _posts: Array<Post>;

export const fetchPosts = async (): Promise<Array<Post>> => {
    if (!_posts) {
        _posts = await load();
    }

    return _posts;
};

export const getStaticPathsProjectPost = async () => {
    // if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
    return (await fetchPosts()).flatMap((post) => {
        return ({
            params: {
                page: post.permalink,
            },
            props: { post },
        })
    });
};


export async function getNextPost(originalPost: Post) {
    let allPosts = await fetchPosts();
    const index = allPosts.findIndex(post => post.permalink === originalPost.permalink);

    if (index !== -1) {
        if (index === allPosts.length - 1) {
            return allPosts[0];
        } else {
            return allPosts[index + 1];
        }
    }

    return null;
}