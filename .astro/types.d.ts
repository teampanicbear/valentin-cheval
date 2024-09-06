declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.mdoc': Promise<{
			Content(props: Record<string, any>): import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"navigation": {
"social.md": {
	id: "social.md";
  slug: "social";
  body: string;
  collection: "navigation";
  data: any
} & { render(): Render[".md"] };
};
"pages": {
"about/index.md": {
	id: "about/index.md";
  slug: "about";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"home/index.md": {
	id: "home/index.md";
  slug: "home";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
};
"post": {
"bidv/index.md": {
	id: "bidv/index.md";
  slug: "bidv";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".md"] };
"definchain/index.md": {
	id: "definchain/index.md";
  slug: "definchain";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".md"] };
"gotymebank/index.md": {
	id: "gotymebank/index.md";
  slug: "gotymebank";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".md"] };
};
"role": {
"brand-identity.md": {
	id: "brand-identity.md";
  slug: "brand-identity";
  body: string;
  collection: "role";
  data: InferEntrySchema<"role">
} & { render(): Render[".md"] };
"design-system.md": {
	id: "design-system.md";
  slug: "design-system";
  body: string;
  collection: "role";
  data: InferEntrySchema<"role">
} & { render(): Render[".md"] };
"graphic-design.md": {
	id: "graphic-design.md";
  slug: "graphic-design";
  body: string;
  collection: "role";
  data: InferEntrySchema<"role">
} & { render(): Render[".md"] };
"mobile-app-design.md": {
	id: "mobile-app-design.md";
  slug: "mobile-app-design";
  body: string;
  collection: "role";
  data: InferEntrySchema<"role">
} & { render(): Render[".md"] };
"product-design.md": {
	id: "product-design.md";
  slug: "product-design";
  body: string;
  collection: "role";
  data: InferEntrySchema<"role">
} & { render(): Render[".md"] };
"ux-research.md": {
	id: "ux-research.md";
  slug: "ux-research";
  body: string;
  collection: "role";
  data: InferEntrySchema<"role">
} & { render(): Render[".md"] };
"web-design.md": {
	id: "web-design.md";
  slug: "web-design";
  body: string;
  collection: "role";
  data: InferEntrySchema<"role">
} & { render(): Render[".md"] };
};
"service": {
"brand-design-strategy.md": {
	id: "brand-design-strategy.md";
  slug: "brand-design-strategy";
  body: string;
  collection: "service";
  data: InferEntrySchema<"service">
} & { render(): Render[".md"] };
"branding.md": {
	id: "branding.md";
  slug: "branding";
  body: string;
  collection: "service";
  data: InferEntrySchema<"service">
} & { render(): Render[".md"] };
"graphic-design.md": {
	id: "graphic-design.md";
  slug: "graphic-design";
  body: string;
  collection: "service";
  data: InferEntrySchema<"service">
} & { render(): Render[".md"] };
"mobile-application.md": {
	id: "mobile-application.md";
  slug: "mobile-application";
  body: string;
  collection: "service";
  data: InferEntrySchema<"service">
} & { render(): Render[".md"] };
"product-design.md": {
	id: "product-design.md";
  slug: "product-design";
  body: string;
  collection: "service";
  data: InferEntrySchema<"service">
} & { render(): Render[".md"] };
"user-experience-research.md": {
	id: "user-experience-research.md";
  slug: "user-experience-research";
  body: string;
  collection: "service";
  data: InferEntrySchema<"service">
} & { render(): Render[".md"] };
"website-design.md": {
	id: "website-design.md";
  slug: "website-design";
  body: string;
  collection: "service";
  data: InferEntrySchema<"service">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
