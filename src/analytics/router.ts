import { Router } from "express";
import { AnalyticsController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const analyticsRouter: Router = Router();

// All routes require authentication
analyticsRouter.use(authMiddleware);

// GET /api/analytics - Get all analytics for user
analyticsRouter.get("/", AnalyticsController.getUserAnalytics);

// GET /api/analytics/trends - Get analytics trends
analyticsRouter.get("/trends", AnalyticsController.getAnalyticsTrends);

// GET /api/analytics/health - Get financial health metrics
analyticsRouter.get("/health", AnalyticsController.getFinancialHealthMetrics);

// GET /api/analytics/user/:userId - Get all analytics for specific user by ID (admin)
analyticsRouter.get("/user/:userId", AnalyticsController.getAnalyticsByUserId);

// GET /api/analytics/:id - Get analytics by ID
analyticsRouter.get("/:id", AnalyticsController.getAnalyticsById);

// POST /api/analytics - Create analytics
analyticsRouter.post("/", AnalyticsController.createAnalytics);

// PUT /api/analytics/:id - Update analytics
analyticsRouter.put("/:id", AnalyticsController.updateAnalytics);
