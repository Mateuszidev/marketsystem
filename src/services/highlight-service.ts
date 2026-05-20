import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";
import type {
  CreateHighlightInput,
  ReorderHighlightsInput,
  UpdateHighlightInput,
} from "@/lib/validations";
import type { HighlightDTO, PublicHighlightDTO } from "@/types/highlight";

const mapHighlight = (highlight: {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}): HighlightDTO => ({
  id: highlight.id,
  title: highlight.title,
  description: highlight.description,
  imageUrl: highlight.imageUrl,
  buttonText: highlight.buttonText,
  buttonLink: highlight.buttonLink,
  active: highlight.active,
  order: highlight.order,
  createdAt: highlight.createdAt.toISOString(),
  updatedAt: highlight.updatedAt.toISOString(),
});

const toPublicHighlight = (highlight: HighlightDTO): PublicHighlightDTO => ({
  id: highlight.id,
  title: highlight.title,
  description: highlight.description,
  imageUrl: highlight.imageUrl,
  buttonText: highlight.buttonText,
  buttonLink: highlight.buttonLink,
});

const normalizeOptional = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const highlightService = {
  async listPublic(): Promise<PublicHighlightDTO[]> {
    try {
      const highlights = await prisma.highlight.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: 12,
      });

      return highlights.map(mapHighlight).map(toPublicHighlight);
    } catch (error) {
      console.error("Failed to load public highlights, returning empty list.", error);
      return [];
    }
  },

  async listAdmin(): Promise<HighlightDTO[]> {
    const highlights = await prisma.highlight.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return highlights.map(mapHighlight);
  },

  async getById(id: number): Promise<HighlightDTO> {
    const highlight = await prisma.highlight.findUnique({ where: { id } });

    if (!highlight) {
      throw new ApiError("Destaque não encontrado.", 404);
    }

    return mapHighlight(highlight);
  },

  async create(input: CreateHighlightInput): Promise<HighlightDTO> {
    const highlight = await prisma.highlight.create({
      data: {
        title: input.title.trim(),
        description: normalizeOptional(input.description),
        imageUrl: input.imageUrl.trim(),
        buttonText: normalizeOptional(input.buttonText),
        buttonLink: normalizeOptional(input.buttonLink),
        active: input.active,
        order: input.order,
      },
    });

    return mapHighlight(highlight);
  },

  async update(id: number, input: UpdateHighlightInput): Promise<HighlightDTO> {
    await this.getById(id);

    const highlight = await prisma.highlight.update({
      where: { id },
      data: {
        title: input.title.trim(),
        description: normalizeOptional(input.description),
        imageUrl: input.imageUrl.trim(),
        buttonText: normalizeOptional(input.buttonText),
        buttonLink: normalizeOptional(input.buttonLink),
        active: input.active,
        order: input.order,
      },
    });

    return mapHighlight(highlight);
  },

  async toggleActive(id: number): Promise<HighlightDTO> {
    const current = await this.getById(id);

    const highlight = await prisma.highlight.update({
      where: { id },
      data: { active: !current.active },
    });

    return mapHighlight(highlight);
  },

  async remove(id: number): Promise<void> {
    await this.getById(id);
    await prisma.highlight.delete({ where: { id } });
  },

  async reorder(input: ReorderHighlightsInput): Promise<HighlightDTO[]> {
    const uniqueIds = [...new Set(input.ids)];

    const existing = await prisma.highlight.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true },
    });

    if (existing.length !== uniqueIds.length) {
      throw new ApiError("Um ou mais destaques informados não existem.", 404);
    }

    await prisma.$transaction(
      uniqueIds.map((id, index) =>
        prisma.highlight.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );

    return this.listAdmin();
  },
};
