import { defineField, defineType } from "sanity";

/**
 * Editorial homepage content only.
 * Product categories live in Postgres — featuredCategorySlugs references
 * those Prisma Category.slug values, never Sanity category documents.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubhead",
      title: "Hero Subhead",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "featuredCategorySlugs",
      title: "Featured Category Slugs",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Postgres Category.slug values to feature on the homepage (e.g. lithium-batteries). Categories are not managed in Sanity.",
    }),
  ],
  preview: {
    select: {
      title: "heroHeadline",
      media: "heroImage",
    },
  },
});
