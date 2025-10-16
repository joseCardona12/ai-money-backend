import { Router } from "express";
import { authRouter } from "./auth/router";
import { onboardingRouter } from "./onboardings/router";
import { goalRouter } from "./goals/router";
import { accountRouter } from "./accounts/router";
import { settingRouter } from "./settings/router";
import { transactionRouter } from "./transactions/router";
import { budgetRouter } from "./budgets/router";

export const router: Router = Router();
router.use("/auth", authRouter);
router.use("/onboardings", onboardingRouter);
router.use("/goals", goalRouter);
router.use("/accounts", accountRouter);
router.use("/settings", settingRouter);
router.use("/transactions", transactionRouter);
router.use("/budgets", budgetRouter);
