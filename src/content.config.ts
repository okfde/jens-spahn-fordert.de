import { defineCollection, z } from "astro:content";
import { getSecret } from "astro:env/server";

const demandSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date(),
  tags: z.array(z.string()),
  link: z.string(),
  id: z.string(),
  index: z.number().int().positive(),
});

const demands = defineCollection({
  schema: demandSchema,
  async loader(): Promise<Array<z.infer<typeof demandSchema>>> {
    const { list } = await (
      await fetch(getSecret("NOCODB_URL") as string, {
        headers: {
          "xc-token": getSecret("NOCODB_TOKEN") as string,
          Accept: "application/json",
        },
      })
    ).json();

    return (list as Array<unknown>)
      .map((item: any) => ({
        title: item.demand,
        description: item.description ?? undefined,
        date: new Date(item.date),
        tags: item._nc_m2m_Demands_Tags.map((tag: any) => tag.Tags.Title),
        link: item.link,
        id: item.Id.toString(),
      }))
      .map((item, index) => ({
        ...item,
        index: index + 1,
      }))
      .reverse();
  },
});

export const collections = {
  demands,
};
export type Demand = z.infer<typeof demandSchema>;
