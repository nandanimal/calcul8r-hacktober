// lib/prisma.js
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    // Prevent hot-reload from creating new clients
    if (!global.prisma) global.prisma = new PrismaClient();
    prisma = global.prisma;
}

export default prisma;
