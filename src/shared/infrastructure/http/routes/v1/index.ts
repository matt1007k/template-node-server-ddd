import { Router } from "express";
import { FilesRoute } from "./files.routes";
import { GroupsRoute } from "./groups.route";
import { NotificationsRoute } from "./notifications.route";
import { PermissionsRoute } from "./permissions.route";
import { ReportsRoute } from "./reports.route";
import { UsersRoute } from "./users.route";

export class V1Routes {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  registerRoutes() {
    this.router.use("/users", new UsersRoute().register());
    this.router.use("/files", new FilesRoute().register());
    this.router.use("/notifications", new NotificationsRoute().register());
    this.router.use("/reports", new ReportsRoute().register());
    this.router.use("/groups", new GroupsRoute().register());
    this.router.use("/permissions", new PermissionsRoute().register());
    return this.router;
  }
}
