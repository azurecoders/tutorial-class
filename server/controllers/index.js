import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { signUpSchema } from "../schemas/auth.schema.js";
import argon2 from "argon2";
import { transporter } from "../utils/transporter.js";

export const signUpUser = async (req, res) => {
  try {
    const result = signUpSchema.safeParse(req.body);

    if (!result.success) {
      res.status(404).json({
        success: false,
        message: result.error.flatten(),
      });
    }

    const validatedData = result.data;

    const exists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, validatedData.email));

    if (exists.length !== 0) {
      res.status(404).json({
        success: false,
        message: "User Already exists with this email",
      });
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
    });
  } catch (error) {
    console.log(error);
  }
};
