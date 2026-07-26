import type { SchemaTypeDefinition } from "sanity";
import { blogPost } from "./blogPost";
import { homePage } from "./homePage";

export const schemaTypes: SchemaTypeDefinition[] = [homePage, blogPost];
