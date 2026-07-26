import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Editorial Content")
    .items([
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(
          S.document().schemaType("homePage").documentId("homePage"),
        ),
      S.documentTypeListItem("blogPost").title("Blog Posts"),
    ]);
