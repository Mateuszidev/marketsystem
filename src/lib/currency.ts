import { Prisma } from "@prisma/client";

export const formatCurrencyBRL = (value: number | Prisma.Decimal | string) => {
  const amount =
    value instanceof Prisma.Decimal ? value.toNumber() : typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

export const toDecimal = (value: number | string | Prisma.Decimal) => {
  if (value instanceof Prisma.Decimal) {
    return value;
  }

  return new Prisma.Decimal(value);
};

export const decimalToNumber = (value: Prisma.Decimal | number | null | undefined) => {
  if (value == null) {
    return 0;
  }

  return value instanceof Prisma.Decimal ? value.toNumber() : value;
};
