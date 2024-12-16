import { createRouter, createWebHistory } from "vue-router";
import Admin from "../models/components/admin.vue";
import JobTitles from "../models/components/job_title.vue";
import Navigation from "../models/components/navigation.vue";
import Roots from "../models/components/roots.vue";
import Search from "../models/components/search.vue";
import Users from "../models/components/users.vue";
import HistoriOfChanges from "../models/components/histori_of_changes.vue";
import Workers from "../models/components/workers.vue";
import Address from "../models/components/address.vue";
import Organization from "../models/components/organization.vue";
import Department from "../models/components/department.vue";
import Hiring from "../models/components/hiring.vue";
import PersonelOperations from "../models/components/personel_operations.vue";

const routes = [
  { path: "/admin", component: Admin },
  { path: "/job-titles", component: JobTitles },
  { path: "/navigation", component: Navigation },
  { path: "/access-rights", component: Roots },
  { path: "/search", component: Search },
  { path: "/users", component: Users },
  { path: "/histori_of_changes", component: HistoriOfChanges },
  { path: "/employees", component: Workers },
  { path: "/addresses", component: Address },
  { path: "/organization", component: Organization },
  { path: "/departments", component: Department },
  { path: "/hiring", component: Hiring },
  { path: "/personal-operations", component: PersonelOperations },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
