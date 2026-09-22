import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";
import { env } from "../config/env";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, admin } = await authService.login(email, password);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: env.isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ success: true, data: { admin, token } });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token").json({ success: true, message: "Logged out" });
});


export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.admin!.id, currentPassword, newPassword);

  res.json({ success: true, message: "Password changed successfully" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: req.admin });
});
