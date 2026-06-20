import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { signUpSchema } from "../schemas/auth.schema.js";
import argon2 from "argon2";
import { transporter } from "../utils/transporter.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const signUpUser = asyncHandler(async (req, res) => {
  const result = signUpSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError("Schema Validation Failed", 500);
  }

  const validatedData = result.data;

  const exists = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validatedData.email));

  if (exists.length !== 0) {
    throw new AppError("User Already Exists With This email", 400);
  }

  const hashedPassword = await argon2.hash(validatedData.password);

  const newUser = await db
    .insert(usersTable)
    .values({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    })
    .returning();

  const token = jwt.sign(
    {
      _id: newUser[0].id,
      name: newUser[0].name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  await transporter.sendMail({
    from: '"Muzammil" <codenow12345@gmail.com>', // sender address
    to: "hightygamerz@gmail.com", // list of recipients
    subject: "Hello", // subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // HTML body
  });

  res.status(201).json({
    success: true,
    message: newUser[0],
    token,
  });
});
